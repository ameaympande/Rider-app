import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'light' | 'dark';
}

export function GlassCard({ children, style, variant = 'light', ...props }: GlassCardProps) {
  return (
    <View 
      style={[
        styles.container, 
        variant === 'dark' ? styles.dark : styles.light,
        style
      ]} 
      {...props}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    padding: spacing.lg,
    backgroundColor: colors.cardBg,
    borderColor: colors.glassBorder,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  light: {
    backgroundColor: colors.cardBg,
  },
  dark: {
    backgroundColor: colors.surfaceHigh,
  },
});
