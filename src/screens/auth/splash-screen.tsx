import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export function SplashScreen(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#0F172A', '#05070A']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        <View style={styles.logoWrapper}>
          <View style={styles.logoCircle}>
             <View style={styles.logoInner} />
          </View>
          <View style={styles.logoGlow} />
        </View>

        <View style={styles.branding}>
          <Text style={styles.brandName}>RIDER</Text>
          <Text style={[styles.brandName, { color: colors.neonGreen }]}>COMPANION</Text>
          <Text style={styles.tagline}>Connected Convoy Network</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.neonGreen} />
        <Text style={styles.loadingText}>Initializing secure systems...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    marginBottom: spacing.xxl,
    position: 'relative',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.neonGreen,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: colors.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  logoInner: {
    width: 32,
    height: 32,
    backgroundColor: '#000000',
    borderRadius: 6,
    transform: [{ rotate: '45deg' }],
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.neonGreen,
    opacity: 0.15,
    top: -10,
    left: -10,
    zIndex: 1,
  },
  branding: {
    alignItems: 'center',
  },
  brandName: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: -2,
    lineHeight: 48,
  },
  tagline: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    opacity: 0.6,
  },
  footer: {
    paddingBottom: spacing.xxxxl,
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
});
