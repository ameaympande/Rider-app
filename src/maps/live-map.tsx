import React, {memo, useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, type Region} from 'react-native-maps';

import {colors} from '../theme/colors';
import type {Rider} from '../types/rider';
import {formatSpeed} from '../utils/format';

type LiveMapProps = {
  riders: Rider[];
};

function LiveMapComponent({riders}: LiveMapProps): React.JSX.Element {
  const initialRegion = useMemo<Region>(() => {
    const leadRider = riders[0];

    return {
      latitude: leadRider?.location.latitude ?? 18.5204,
      longitude: leadRider?.location.longitude ?? 73.8567,
      latitudeDelta: 0.04,
      longitudeDelta: 0.04,
    };
  }, [riders]);

  return (
    <MapView
      style={styles.map}
      initialRegion={initialRegion}
      showsUserLocation
      showsCompass={false}
      pitchEnabled
      rotateEnabled>
      {riders.map(rider => (
        <Marker
          key={rider.id}
          coordinate={{
            latitude: rider.location.latitude,
            longitude: rider.location.longitude,
          }}
          anchor={{x: 0.5, y: 0.5}}
          flat
          rotation={rider.location.heading}>
          <View style={styles.marker}>
            <View style={styles.pointer} />
            <Text style={styles.markerText}>
              {formatSpeed(rider.location.speedKmh)}
            </Text>
          </View>
        </Marker>
      ))}
    </MapView>
  );
}

export const LiveMap = memo(LiveMapComponent);

const styles = StyleSheet.create({
  map: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.mapDark,
  },
  marker: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.neonGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointer: {
    position: 'absolute',
    top: -6,
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.neonGreen,
  },
  markerText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '900',
  },
});
