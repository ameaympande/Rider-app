import React, {useMemo} from 'react';
import {FlatList, StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert} from 'react-native';
import {useMutation, useQuery} from '@tanstack/react-query';
import {Plus, Search, ChevronRight, Map, Menu, User, Bell, Navigation} from 'lucide-react-native';
import {DrawerScreenProps} from '@react-navigation/drawer';

import {GradientButton} from '../../components/buttons/gradient-button';
import {Screen} from '../../components/layout/screen';
import {GlassCard} from '../../components/common/glass-card';
import type {RootStackParamList} from '../../navigation/routes';
import {getApiErrorMessage} from '../../services/api/api-client';
import {ridesApi} from '../../services/api/rides-api';
import {userApi} from '../../services/api/user-api';
import {useAuthStore} from '../../store/auth-store';
import {useRideStore} from '../../store/ride-store';
import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {toRideSummary, type Ride, type RideSummary} from '../../types/rider';

type HomeScreenProps = DrawerScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({navigation}: HomeScreenProps): React.JSX.Element {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const setUser = useAuthStore(state => state.setUser);
  const setActiveRide = useRideStore(state => state.setActiveRide);
  const session = useAuthStore(state => state.session);
  
  const profileQuery = useQuery({
    queryKey: ['users', 'me'],
    queryFn: userApi.getMe,
    enabled: Boolean(session),
  });

  const createRideMutation = useMutation({
    mutationFn: ridesApi.createRide,
    onSuccess: ride => {
      setErrorMessage(null);
      if (profileQuery.data) setUser(profileQuery.data);
      openRide(ride);
    },
    onError: error => setErrorMessage(getApiErrorMessage(error)),
  });
  
  const recentRides = useMemo<RideSummary[]>(() => [], []);

  function openRide(ride: Ride): void {
    const rideSummary = toRideSummary(ride);
    setActiveRide(rideSummary);
    navigation.navigate('RideRoom', {rideId: rideSummary.id});
  }

  function createRide(): void {
    createRideMutation.mutate({
      name: 'Morning Ride',
      destination: 'Lonavala',
      isPrivate: true,
    });
  }

  return (
    <Screen style={styles.screen}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.topNav}>
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => navigation.toggleDrawer()}
          >
            <Menu size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          
          <View style={styles.branding}>
            <View style={styles.logoCircle} />
            <Text style={styles.brandName}>Rider Companion</Text>
          </View>

          <TouchableOpacity 
            style={styles.navButton}
            onPress={() => navigation.navigate('Profile')}
          >
            <User size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Good Morning,</Text>
          <Text style={styles.userName}>{profileQuery.data?.name ?? 'Rider'}</Text>
        </View>

        <View style={styles.searchContainer}>
          <TouchableOpacity style={styles.searchBar}>
            <Search size={20} color={colors.textMuted} />
            <Text style={styles.searchPlaceholder}>Where are you going?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard} onPress={createRide}>
            <View style={[styles.actionIcon, {backgroundColor: 'rgba(168, 255, 0, 0.1)'}]}>
              <Navigation size={24} color={colors.neonGreen} />
            </View>
            <Text style={styles.actionLabel}>Plan Ride</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Explore')}>
            <View style={[styles.actionIcon, {backgroundColor: 'rgba(49, 130, 206, 0.1)'}]}>
              <Map size={24} color={colors.deepBlue} />
            </View>
            <Text style={styles.actionLabel}>Explore</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard} onPress={() => Alert.alert('Notifications', 'No new alerts at the moment.')}>
            <View style={[styles.actionIcon, {backgroundColor: 'rgba(245, 101, 101, 0.1)'}]}>
              <Bell size={24} color={colors.danger} />
            </View>
            <Text style={styles.actionLabel}>Alerts</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Rides</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {recentRides.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Text style={styles.emptyText}>No rides yet. Start your journey with your convoy!</Text>
          </GlassCard>
        ) : (
          recentRides.map(ride => (
            <TouchableOpacity key={ride.id} onPress={() => navigation.navigate('RideRoom', {rideId: ride.id})}>
              <GlassCard style={styles.rideRow}>
                <View style={styles.rideInfo}>
                  <Text style={styles.rideName}>{ride.name}</Text>
                  <Text style={styles.rideDestination}>{ride.destination ?? 'Route pending'}</Text>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </GlassCard>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomCta}>
        <GradientButton
          label="Start Convoy"
          icon={<Plus size={20} color="#000000" />}
          isLoading={createRideMutation.isPending}
          onPress={createRide}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: 120,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  navButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.neonGreen,
  },
  brandName: {
    fontSize: 16,
    fontWeight: '900',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  welcomeSection: {
    marginBottom: spacing.xxl,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  userName: {
    fontSize: 36,
    fontWeight: '900',
    color: colors.textPrimary,
    marginTop: 4,
    letterSpacing: -1,
  },
  searchContainer: {
    marginBottom: spacing.xxl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    height: 64,
    borderRadius: 16,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: colors.textMuted,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xxxxl,
  },
  actionCard: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  actionIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.neonGreen,
  },
  emptyCard: {
    padding: spacing.xl,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  emptyText: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  rideRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
  },
  rideInfo: {
    flex: 1,
  },
  rideName: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  rideDestination: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
  bottomCta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
    backgroundColor: 'rgba(5, 7, 10, 0.9)',
  },
});
