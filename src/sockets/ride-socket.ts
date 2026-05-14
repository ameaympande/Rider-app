import {io, type Socket} from 'socket.io-client';

import {appConfig} from '../constants/config';
import {useAuthStore} from '../store/auth-store';
import type {RiderStatus} from '../types/rider';
import type {
  ClientToServerEvents,
  LocationUpdatePayload,
  RidePresencePayload,
  ServerToClientEvents,
  SpeedUpdatePayload,
  EmergencySosPayload,
} from '../types/socket-events';

type RideSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

class RideSocketClient {
  private socket: RideSocket | null = null;

  connect(): RideSocket {
    if (this.socket?.connected) {
      return this.socket;
    }

    const token = useAuthStore.getState().session?.accessToken;

    this.socket = io(appConfig.socketUrl, {
      transports: ['websocket'],
      autoConnect: true,
      auth: token ? {token} : undefined,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 500,
      reconnectionDelayMax: 5000,
    });

    return this.socket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  joinRide(payload: RidePresencePayload): void {
    this.connect().emit('joinRide', payload);
  }

  leaveRide(payload: RidePresencePayload): void {
    this.socket?.emit('leaveRide', payload);
  }

  sendLocation(payload: LocationUpdatePayload): void {
    this.connect().emit('locationUpdate', payload);
  }

  sendSpeed(payload: SpeedUpdatePayload): void {
    this.connect().emit('speedUpdate', payload);
  }

  updateStatus(payload: RidePresencePayload & {status: RiderStatus}): void {
    this.connect().emit('riderStatus', payload);
  }

  sendEmergencySos(payload: EmergencySosPayload): void {
    this.connect().emit('emergencySOS', payload);
  }

  onRiderLocation(
    listener: ServerToClientEvents['riderLocation'],
  ): () => void {
    const socket = this.connect();
    socket.on('riderLocation', listener);

    return () => {
      socket.off('riderLocation', listener);
    };
  }

  onRiderSpeed(listener: ServerToClientEvents['riderSpeed']): () => void {
    const socket = this.connect();
    socket.on('riderSpeed', listener);

    return () => {
      socket.off('riderSpeed', listener);
    };
  }

  onRideUpdated(listener: ServerToClientEvents['rideUpdated']): () => void {
    const socket = this.connect();
    socket.on('rideUpdated', listener);

    return () => {
      socket.off('rideUpdated', listener);
    };
  }

  onEmergencyAlert(
    listener: ServerToClientEvents['emergencyAlert'],
  ): () => void {
    const socket = this.connect();
    socket.on('emergencyAlert', listener);

    return () => {
      socket.off('emergencyAlert', listener);
    };
  }

  onRiderJoined(listener: ServerToClientEvents['riderJoined']): () => void {
    const socket = this.connect();
    socket.on('riderJoined', listener);

    return () => {
      socket.off('riderJoined', listener);
    };
  }

  onRiderLeft(listener: ServerToClientEvents['riderLeft']): () => void {
    const socket = this.connect();
    socket.on('riderLeft', listener);

    return () => {
      socket.off('riderLeft', listener);
    };
  }

  onError(listener: ServerToClientEvents['error']): () => void {
    const socket = this.connect();
    socket.on('error', listener);

    return () => {
      socket.off('error', listener);
    };
  }
}

export const rideSocketClient = new RideSocketClient();
