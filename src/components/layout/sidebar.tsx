import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { User, LogOut, Home, Settings, History, HelpCircle, Map } from 'lucide-react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { useAuthStore } from '../../store/auth-store';

export function Sidebar(props: DrawerContentComponentProps) {
  const session = useAuthStore(state => state.session);
  const logout = useAuthStore(state => state.logout);
  const user = session?.user;

  function handleLogout() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={30} color={colors.neonGreen} />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user?.name ?? 'Rider'}</Text>
          <Text style={styles.userPhone}>{user?.phone ?? '---'}</Text>
        </View>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerList}>
        <TouchableOpacity style={styles.customItem} onPress={() => props.navigation.navigate('Home')}>
           <Home size={22} color={colors.textSecondary} />
           <Text style={styles.customLabel}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.customItem} onPress={() => props.navigation.navigate('Profile')}>
           <User size={22} color={colors.textSecondary} />
           <Text style={styles.customLabel}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.customItem} onPress={() => props.navigation.navigate('History')}>
           <History size={22} color={colors.textSecondary} />
           <Text style={styles.customLabel}>Ride History</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.customItem} onPress={() => props.navigation.navigate('Settings')}>
           <Settings size={22} color={colors.textSecondary} />
           <Text style={styles.customLabel}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.customItem}>
           <HelpCircle size={22} color={colors.textSecondary} />
           <Text style={styles.customLabel}>Support</Text>
        </TouchableOpacity>
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={22} color={colors.danger} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.version}>v0.0.1</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    paddingTop: spacing.xxxxl,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(168, 255, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 255, 0, 0.2)',
  },
  userInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  userPhone: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  drawerList: {
    paddingTop: spacing.md,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginVertical: spacing.md,
    marginHorizontal: spacing.xl,
  },
  customItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  customLabel: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    padding: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  logoutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '800',
  },
  version: {
    marginTop: spacing.md,
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
});
