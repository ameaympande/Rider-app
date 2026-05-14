import {useEffect, useRef} from 'react';
import Geolocation from '@react-native-community/geolocation';
import {rideSocketClient} from '../sockets/ride-socket';
import {useRideStore} from '../store/ride-store';
import type {RiderStatus} from '../types/rider';

export function useTracking(rideId: string | undefined) {
  const watchId = useRef<number | null>(null);
  const lastUpdate = useRef<number>(0);

  useEffect(() => {
    if (!rideId) return;

    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
      authorizationLevel: 'whenInUse',
    });

    watchId.current = Geolocation.watchPosition(
      position => {
        const now = Date.now();
        // Throttle updates to every 3 seconds
        if (now - lastUpdate.current < 3000) return;
        
        lastUpdate.current = now;
        
        rideSocketClient.sendLocation({
          rideId,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          speed: position.coords.speed ? Math.round(position.coords.speed * 3.6) : 0, // Convert m/s to km/h
          heading: position.coords.heading ?? 0,
          status: 'RIDING' as RiderStatus,
        });
      },
      error => {
        console.error('Tracking Error:', error);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 10,
        interval: 3000,
        fastestInterval: 2000,
      },
    );

    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, [rideId]);
}
