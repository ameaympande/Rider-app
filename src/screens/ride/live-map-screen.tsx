import React, {useMemo} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQuery} from '@tanstack/react-query';
import {ArrowLeft, Navigation, Users, Zap} from 'lucide-react-native';

import {MetricCard} from '../../components/cards/metric-card';
import {LiveMap} from '../../maps/live-map';
import {GlassCard} from '../../components/common/glass-card';
import type {RootStackParamList} from '../../navigation/routes';
import {trackingApi} from '../../services/api/tracking-api';
import {useRideStore} from '../../store/ride-store';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {toRider} from '../../types/rider';
import {useTracking} from '../../hooks/use-tracking';
import {rideSocketClient} from '../../sockets/ride-socket';

type LiveMapScreenProps = NativeStackScreenProps<RootStackParamList, 'LiveMap'>;

export function LiveMapScreen({
  route,
  navigation,
}: LiveMapScreenProps): React.JSX.Element {
  const ridersById = useRideStore(state => state.ridersById);
  const upsertRider = useRideStore(state => state.upsertRider);
  
  useTracking(route.params.rideId);

  const liveRidersQuery = useQuery({
    queryKey: ['tracking', 'live', route.params.rideId],
    queryFn: () => trackingApi.getLiveRiders(route.params.rideId),
  });

  React.useEffect(() => {
    const unsubscribe = rideSocketClient.onRiderLocation(location => {
       upsertRider(toRider(location));
    });
    return () => unsubscribe();
  }, [upsertRider]);

  const fetchedRiders = useMemo(
    () => liveRidersQuery.data?.map(location => toRider(location)) ?? [],
    [liveRidersQuery.data],
  );
  const riders = useMemo(() => {
    const storeRiders = Object.values(ridersById);
    return storeRiders.length > 0 ? storeRiders : fetchedRiders;
  }, [fetchedRiders, ridersById]);
  const leadSpeed = riders[0]?.location.speedKmh ?? 0;

  return (
    <View style={styles.screen}>
      <LiveMap riders={riders} />
      
      <View style={styles.topPanel}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        
        <GlassCard style={styles.headerCard}>
          <View style={styles.statusRow}>
             <View style={styles.liveDot} />
             <Text style={styles.liveText}>LIVE HUD</Text>
          </View>
          <Text style={styles.title} numberOfLines={1}>Convoy Stream</Text>
        </GlassCard>
      </View>

      <View style={styles.bottomPanel}>
        <GlassCard style={styles.metricsContainer}>
          <View style={styles.metricItem}>
             <Zap size={18} color={colors.neonGreen} />
             <View>
                <Text style={styles.metricLabel}>LEAD SPEED</Text>
                <Text style={styles.metricValue}>{Math.round(leadSpeed)} <Text style={styles.unit}>KM/H</Text></Text>
             </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.metricItem}>
             <Users size={18} color={colors.electricOrange} />
             <View>
                <Text style={styles.metricLabel}>ACTIVE</Text>
                <Text style={styles.metricValue}>{riders.length} <Text style={styles.unit}>RIDERS</Text></Text>
             </View>
          </View>
        </GlassCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topPanel: {
    position: 'absolute',
    top: spacing.xxl,
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerCard: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.danger,
  },
  liveText: {
    color: colors.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  bottomPanel: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.xxl,
  },
  metricsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  metricLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  metricValue: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  unit: {
    fontSize: 10,
    color: colors.textSecondary,
  },
});
