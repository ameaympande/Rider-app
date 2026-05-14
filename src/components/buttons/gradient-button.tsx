import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

interface GradientButtonProps {
  onPress: () => void;
  label: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  colors?: string[];
}

export function GradientButton({
  onPress,
  label,
  icon,
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  colors: customColors,
}: GradientButtonProps): React.JSX.Element {
  const buttonColors = disabled
    ? [colors.surfaceHigh, colors.surfaceHigh]
    : customColors || [colors.neonGreen, colors.neonGreen];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      style={[styles.container, style]}
    >
      <LinearGradient
        colors={buttonColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {isLoading ? (
          <ActivityIndicator color="#000000" size="small" />
        ) : (
          <>
            {icon && <View style={styles.icon}>{icon}</View>}
            <Text style={[styles.label, textStyle]}>{label}</Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    width: '100%',
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  icon: {
    marginRight: spacing.sm,
  },
});
