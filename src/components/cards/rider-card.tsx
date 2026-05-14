import React, {memo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Battery, Zap} from 'lucide-react-native';

import {colors} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import type {Rider} from '../../types/rider';
import {formatBattery, formatSpeed} from '../../utils/format';

type RiderCardProps = {
  rider: Rider;
};

function RiderCardComponent({rider}: RiderCardProps): React.JSX.Element {
  const isSOS = rider.status === 'SOS';
  const statusColor = isSOS ? colors.danger : colors.neonGreen;

  return (
    <View style={styles.card}>
      <View style={[styles.avatar, {borderColor: statusColor}]}>
        {isSOS ? (
          <Text style={[styles.avatarText, {color: colors.danger}]}>!</Text>
        ) : (
          <Text style={styles.avatarText}>{rider.displayName.slice(0, 1)}</Text>
        )}
      </View>
      <View style={styles.identity}>
        <Text style={styles.name}>{rider.displayName}</Text>
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, {backgroundColor: statusColor}]} />
          <Text style={styles.status}>{rider.status}</Text>
        </View>
      </View>
      <View style={styles.telemetry}>
        <View style={styles.telemetryItem}>
          <Zap size={12} color={colors.neonGreen} />
          <Text style={styles.speed}>
            {formatSpeed(rider.location.speedKmh)}
            <Text style={styles.unit}> km/h</Text>
          </Text>
        </View>
        <View style={styles.telemetryItem}>
          <Battery size={12} color={colors.textSecondary} />
          <Text style={styles.battery}>{formatBattery(rider.location.batteryLevel)}</Text>
        </View>
      </View>
    </View>
  );
}

export const RiderCard = memo(RiderCardComponent);

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  avatarText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '900',
  },
  identity: {
    flex: 1,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: spacing.xs,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  status: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  telemetry: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  speed: {
    color: colors.neonGreen,
    fontSize: 15,
    fontWeight: '800',
  },
  unit: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  battery: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
});
