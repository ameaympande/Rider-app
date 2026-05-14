import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQuery, useMutation} from '@tanstack/react-query';
import {Map, AlertTriangle, Share2, Users, Navigation, ArrowLeft, Copy} from 'lucide-react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import {GradientButton} from '../../components/buttons/gradient-button';
import {MetricCard} from '../../components/cards/metric-card';
import {RiderCard} from '../../components/cards/rider-card';
import {Screen} from '../../components/layout/screen';
import {GlassCard} from '../../components/common/glass-card';
import type {RootStackParamList} from '../../navigation/routes';
import {ridesApi} from '../../services/api/rides-api';
import {rideSocketClient} from '../../sockets/ride-socket';
import {useRideStore} from '../../store/ride-store';
import {useTracking} from '../../hooks/use-tracking';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {toRideSummary, toRider, type User} from '../../types/rider';

type RideRoomScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'RideRoom'
>;

export function RideRoomScreen({
  route,
  navigation,
}: RideRoomScreenProps): React.JSX.Element {
  const activeRide = useRideStore(state => state.activeRide);
  const ridersById = useRideStore(state => state.ridersById);
  const setActiveRide = useRideStore(state => state.setActiveRide);
  const upsertRider = useRideStore(state => state.upsertRider);
  const riders = useMemo(() => Object.values(ridersById), [ridersById]);
  
  useTracking(route.params.rideId);
  
  const rideQuery = useQuery({
    queryKey: ['rides', route.params.rideId],
    queryFn: () => ridesApi.getRide(route.params.rideId),
  });

  const membersQuery = useQuery({
    queryKey: ['rides', route.params.rideId, 'members'],
    queryFn: () => ridesApi.getMembers(route.params.rideId),
  });

  const leaveRideMutation = useMutation({
    mutationFn: () => ridesApi.leaveRide(route.params.rideId),
    onSuccess: () => {
      setActiveRide(null);
      navigation.navigate('Home');
    },
  });

  const membersById = useMemo(() => {
    const nextMembers: Record<string, User> = {};
    membersQuery.data?.forEach(member => {
      nextMembers[member._id] = member;
    });
    return nextMembers;
  }, [membersQuery.data]);

  useEffect(() => {
    if (rideQuery.data) {
      setActiveRide(toRideSummary(rideQuery.data));
    }
  }, [rideQuery.data, setActiveRide]);

  useEffect(() => {
    rideSocketClient.joinRide({rideId: route.params.rideId});
    
    const unsubscribeLocation = rideSocketClient.onRiderLocation(location => {
      upsertRider(toRider(location, membersById[location.userId]));
    });

    const unsubscribeJoined = rideSocketClient.onRiderJoined(({userId}) => {
      membersQuery.refetch();
    });

    const unsubscribeLeft = rideSocketClient.onRiderLeft(({userId}) => {
      membersQuery.refetch();
    });

    const unsubscribeUpdated = rideSocketClient.onRideUpdated(({userId, status}) => {
      const rider = ridersById[userId];
      if (rider) {
        upsertRider({...rider, status});
      }
    });

    const unsubscribeAlert = rideSocketClient.onEmergencyAlert(({userId, message}) => {
      const rider = ridersById[userId];
      Alert.alert(`🚨 SOS ALERT`, `${rider?.displayName ?? 'A rider'} needs help! \nMessage: ${message ?? 'No message'}`);
    });

    return () => {
      unsubscribeLocation();
      unsubscribeJoined();
      unsubscribeLeft();
      unsubscribeUpdated();
      unsubscribeAlert();
      rideSocketClient.leaveRide({rideId: route.params.rideId});
    };
  }, [membersById, route.params.rideId, upsertRider, membersQuery, ridersById]);

  function handleSOS() {
    rideSocketClient.sendEmergencySos({
      rideId: route.params.rideId,
      message: 'Urgent assistance required!',
    });
    Alert.alert('SOS Sent', 'Your emergency alert has been broadcasted to the convoy.');
  }

  function copyInviteCode() {
    const code = activeRide?.inviteCode ?? rideQuery.data?.inviteCode;
    if (code) {
      Clipboard.setString(code);
      Alert.alert('Copied', 'Invite code copied to clipboard!');
    }
  }

  function handleEndTrip() {
    Alert.alert(
      'End Trip',
      'Are you sure you want to end this trip and leave the convoy?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'End Trip', style: 'destructive', onPress: () => leaveRideMutation.mutate()},
      ]
    );
  }

  return (
    <Screen withGradient style={styles.screen}>
      <View style={styles.topNav}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{activeRide?.name ?? 'Ride Room'}</Text>
        <TouchableOpacity style={styles.endButton} onPress={handleEndTrip}>
          <Text style={styles.endButtonText}>END</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <View style={styles.headingBlock}>
          <View style={styles.statusRow}>
             <View style={styles.liveIndicator} />
             <Text style={styles.liveText}>LIVE SESSION</Text>
          </View>
          <View style={styles.destinationRow}>
             <Navigation size={14} color={colors.textSecondary} />
             <Text style={styles.destination}>
               {activeRide?.destination ?? rideQuery.data?.destination ?? 'Route pending'}
             </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.codeBadge} onPress={copyInviteCode}>
          <Text style={styles.codeLabel}>JOIN CODE</Text>
          <View style={styles.codeRow}>
            <Text style={styles.code}>{activeRide?.inviteCode ?? rideQuery.data?.inviteCode ?? '----'}</Text>
            <Copy size={12} color={colors.neonGreen} style={{ marginLeft: 4 }} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.metrics}>
        <MetricCard
          label="Riders"
          value={`${membersQuery.data?.length ?? riders.length}`}
          accent="green"
        />
        <MetricCard label="Lead Speed" value="78" accent="orange" />
      </View>

      <View style={styles.controls}>
        <GradientButton
          label="Launch Live Map"
          icon={<Map size={20} color={colors.background} />}
          onPress={() => navigation.navigate('LiveMap', {rideId: route.params.rideId})}
          style={styles.mapButton}
        />
        <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
           <AlertTriangle size={24} color={colors.danger} />
           <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
           <Users size={18} color={colors.neonGreen} />
           <Text style={styles.sectionTitle}>Active Convoy</Text>
        </View>
        <TouchableOpacity style={styles.inviteButton} onPress={copyInviteCode}>
           <Share2 size={16} color={colors.textSecondary} />
           <Text style={styles.inviteText}>Invite</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={riders}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <GlassCard style={styles.riderRow}>
             <RiderCard rider={item} />
          </GlassCard>
        )}
        contentContainerStyle={styles.list}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing.md,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.md,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  backButton: {
    padding: spacing.xs,
  },
  endButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 55, 95, 0.1)',
  },
  endButtonText: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: '800',
  },
  header: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  headingBlock: {
    flex: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    shadowColor: colors.danger,
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  liveText: {
    color: colors.danger,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  destinationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  destination: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  codeBadge: {
    width: 90,
    height: 70,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  codeLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  code: {
    marginTop: spacing.xs,
    color: colors.neonGreen,
    fontSize: 18,
    fontWeight: '900',
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metrics: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  mapButton: {
    flex: 1,
  },
  sosButton: {
    width: 64,
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 55, 95, 0.2)',
    backgroundColor: 'rgba(255, 55, 95, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  sosText: {
    color: colors.danger,
    fontSize: 10,
    fontWeight: '900',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  inviteText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  riderRow: {
    padding: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 20,
    marginBottom: spacing.md,
  },
});
