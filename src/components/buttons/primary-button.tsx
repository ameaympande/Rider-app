import React, {memo} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

type PrimaryButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  variant?: 'primary' | 'danger' | 'ghost';
  isLoading?: boolean;
  style?: StyleProp<ViewStyle>;
};

function PrimaryButtonComponent({
  label,
  variant = 'primary',
  isLoading = false,
  disabled,
  style,
  ...props
}: PrimaryButtonProps): React.JSX.Element {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      style={({pressed}) => [
        styles.base,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
      {...props}>
      {isLoading ? (
        <ActivityIndicator color={colors.background} />
      ) : (
        <Text style={[styles.label, variant === 'ghost' && styles.ghostLabel]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export const PrimaryButton = memo(PrimaryButtonComponent);

const styles = StyleSheet.create({
  base: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: spacing.xl,
  },
  primary: {
    backgroundColor: colors.neonGreen,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  ghost: {
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    transform: [{scale: 0.98}],
  },
  label: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '800',
  },
  ghostLabel: {
    color: colors.textPrimary,
  },
});
