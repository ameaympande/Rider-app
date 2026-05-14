import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { ArrowLeft, CreditCard, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '../../components/layout/screen';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { GradientButton } from '../../components/buttons/gradient-button';
import type { RootStackParamList } from '../../navigation/routes';

export function SubscriptionScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Screen style={styles.screen}>
      <View style={styles.topNav}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.planCard}>
          <Text style={styles.planBadge}>CURRENT PLAN</Text>
          <Text style={styles.planName}>Rider Pro</Text>
          <Text style={styles.planPrice}>$9.99<Text style={styles.planPeriod}>/month</Text></Text>
          
          <View style={styles.features}>
            <View style={styles.featureItem}>
              <Check size={18} color={colors.neonGreen} />
              <Text style={styles.featureText}>Unlimited Convoys</Text>
            </View>
            <View style={styles.featureItem}>
              <Check size={18} color={colors.neonGreen} />
              <Text style={styles.featureText}>Real-time HUD Tracking</Text>
            </View>
            <View style={styles.featureItem}>
              <Check size={18} color={colors.neonGreen} />
              <Text style={styles.featureText}>Premium Map Layers</Text>
            </View>
          </View>
        </View>

        <GradientButton label="Manage Subscription" onPress={() => {}} style={styles.button} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    marginBottom: spacing.xl,
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
    fontWeight: '900',
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
  },
  planCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(168, 255, 0, 0.2)',
    marginBottom: spacing.xl,
  },
  planBadge: {
    color: colors.neonGreen,
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  planName: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: spacing.xs,
  },
  planPrice: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: spacing.xl,
  },
  planPeriod: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  features: {
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
  button: {
    marginTop: spacing.md,
  },
});
