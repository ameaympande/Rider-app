import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Activity, MapPin, Zap} from 'lucide-react-native';

import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import {GlassCard} from '../common/glass-card';

type MetricCardProps = {
  label: string;
  value: string;
  accent?: 'green' | 'orange' | 'blue';
};

const ICONS = {
  green: Activity,
  orange: MapPin,
  blue: Zap,
};

function MetricCardComponent({
  label,
  value,
  accent = 'green',
}: MetricCardProps): React.JSX.Element {
  const Icon = ICONS[accent];

  return (
    <GlassCard style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, styles[`${accent}Bg`]]}>
          <Icon size={16} color={colors[accent === 'green' ? 'neonGreen' : accent === 'orange' ? 'electricOrange' : 'deepBlue']} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </GlassCard>
  );
}

export const MetricCard = memo(MetricCardComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 110,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greenBg: {
    backgroundColor: 'rgba(57, 255, 136, 0.1)',
  },
  orangeBg: {
    backgroundColor: 'rgba(255, 122, 26, 0.1)',
  },
  blueBg: {
    backgroundColor: 'rgba(23, 107, 255, 0.1)',
  },
  label: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  value: {
    marginTop: spacing.md,
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: '900',
  },
});
