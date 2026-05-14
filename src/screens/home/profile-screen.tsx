import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from 'react-native';
import { User, Bike, Shield, LogOut, ChevronRight, Settings, Bell, CreditCard, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '../../components/layout/screen';
import { GlassCard } from '../../components/common/glass-card';
import { GradientButton } from '../../components/buttons/gradient-button';
import { useAuthStore } from '../../store/auth-store';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { RootStackParamList } from '../../navigation/routes';

export function ProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { session, logout } = useAuthStore();
  const user = session?.user;

  const menuItems = [
    { 
      icon: <User size={20} color={colors.neonGreen} />, 
      label: 'Personal Information',
      onPress: () => navigation.navigate('EditProfile')
    },
    { 
      icon: <Bike size={20} color={colors.electricOrange} />, 
      label: 'My Garage',
      onPress: () => navigation.navigate('Garage') 
    },
    { 
      icon: <Shield size={20} color={colors.deepBlue} />, 
      label: 'Safety',
      onPress: () => navigation.navigate('Safety')
    },
    { 
      icon: <CreditCard size={20} color={colors.warning} />, 
      label: 'Subscription',
      onPress: () => navigation.navigate('Subscription')
    },
    { 
      icon: <Bell size={20} color={colors.textSecondary} />, 
      label: 'Notifications',
      onPress: () => navigation.navigate('Notifications')
    },
    { 
      icon: <Settings size={20} color={colors.textSecondary} />, 
      label: 'App Settings',
      onPress: () => navigation.navigate('Settings')
    },
  ];

  return (
    <Screen style={styles.screen}>
      <View style={styles.topNav}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 44 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatarContainer}>
              <User size={40} color={colors.neonGreen} />
            </View>
            <TouchableOpacity 
              style={styles.editBadge}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Text style={styles.editBadgeText}>EDIT</Text>
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>{user?.name ?? 'Anonymous Rider'}</Text>
          <Text style={styles.phone}>{user?.phone ?? '+91 -- --- --'}</Text>
          <Text style={styles.bike}>{user?.bikeName ?? 'No bike added'}</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
             <Text style={styles.statValue}>24</Text>
             <Text style={styles.statLabel}>Rides</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
             <Text style={styles.statValue}>1.2k</Text>
             <Text style={styles.statLabel}>KM</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
             <Text style={styles.statValue}>4.9</Text>
             <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuIcon}>{item.icon}</View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <ChevronRight size={18} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        <GradientButton
          label="Sign Out"
          icon={<LogOut size={20} color={colors.background} />}
          onPress={logout}
          colors={colors.gradients.secondary}
          style={styles.logoutButton}
        />
        
        <Text style={styles.version}>Rider Companion v0.0.1</Text>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
    backgroundColor: colors.background,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: 120, // More bottom padding for visibility
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: spacing.lg,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: 'rgba(57, 255, 136, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    backgroundColor: colors.neonGreen,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.background,
  },
  editBadgeText: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '900',
  },
  name: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  phone: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  bike: {
    marginTop: spacing.md,
    color: colors.neonGreen,
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
    backgroundColor: 'rgba(57, 255, 136, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: spacing.xxl,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuContainer: {
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    marginTop: spacing.xl,
  },
  version: {
    textAlign: 'center',
    marginTop: spacing.xxl,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '600',
  },
});
