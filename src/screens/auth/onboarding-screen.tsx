import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight, User, Bike, Trophy, Check } from 'lucide-react-native';

import { Screen } from '../../components/layout/screen';
import { GradientButton } from '../../components/buttons/gradient-button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { userApi } from '../../services/api/user-api';
import { useAuthStore } from '../../store/auth-store';

const STEPS = ['Name', 'Bike', 'Experience'];

export function OnboardingScreen(): React.JSX.Element {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState('');
  const [bikeName, setBikeName] = useState('');
  const [experience, setExperience] = useState<'Beginner' | 'Intermediate' | 'Pro'>('Intermediate');
  
  const setUser = useAuthStore(state => state.setUser);
  
  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateMe,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
    },
  });

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    updateProfileMutation.mutate({
      name,
      bikeName,
    });
  };

  const renderProgress = () => (
    <View style={styles.progressContainer}>
      {STEPS.map((_, index) => (
        <View
          key={index}
          style={[
            styles.progressBar,
            {
              backgroundColor: index <= currentStep ? colors.neonGreen : 'rgba(255, 255, 255, 0.1)',
              width: `${100 / STEPS.length - 5}%`,
            },
          ]}
        />
      ))}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <Screen style={styles.screen}>
        <View style={styles.headerProgress}>
          {renderProgress()}
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {currentStep === 0 && (
              <View style={styles.stepContainer}>
                <View style={styles.iconCircle}>
                  <User size={32} color={colors.neonGreen} />
                </View>
                <Text style={styles.title}>What should we{'\n'}call you?</Text>
                <Text style={styles.subtitle}>Your name will be visible to your convoy members.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoFocus
                  autoCapitalize="words"
                />
              </View>
            )}

            {currentStep === 1 && (
              <View style={styles.stepContainer}>
                <View style={styles.iconCircle}>
                  <Bike size={32} color={colors.neonGreen} />
                </View>
                <Text style={styles.title}>What's your{'\n'}beast called?</Text>
                <Text style={styles.subtitle}>Add your bike model to help riders identify you.</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Ninja 400, Himalayan"
                  placeholderTextColor={colors.textMuted}
                  value={bikeName}
                  onChangeText={setBikeName}
                  autoFocus
                />
              </View>
            )}

            {currentStep === 2 && (
              <View style={styles.stepContainer}>
                <View style={styles.iconCircle}>
                  <Trophy size={32} color={colors.neonGreen} />
                </View>
                <Text style={styles.title}>Your riding{'\n'}experience?</Text>
                <Text style={styles.subtitle}>This helps us match you with the right ride rooms.</Text>
                
                <View style={styles.optionsContainer}>
                  {(['Beginner', 'Intermediate', 'Pro'] as const).map((level) => (
                    <TouchableOpacity
                      key={level}
                      style={[
                        styles.optionCard,
                        experience === level && styles.selectedOption,
                      ]}
                      onPress={() => setExperience(level)}
                    >
                      <Text style={[
                        styles.optionText,
                        experience === level && styles.selectedOptionText
                      ]}>{level}</Text>
                      {experience === level && <Check size={20} color="#000000" />}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <GradientButton
              label={currentStep === STEPS.length - 1 ? 'Start Riding' : 'Continue'}
              icon={<ArrowRight size={20} color="#000000" />}
              onPress={nextStep}
              disabled={
                (currentStep === 0 && !name.trim()) ||
                (currentStep === 1 && !bikeName.trim())
              }
              isLoading={updateProfileMutation.isPending}
              style={styles.button}
            />
          </View>
        </ScrollView>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  headerProgress: {
    paddingHorizontal: spacing.xl,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  content: {
    flex: 1,
    paddingTop: spacing.lg,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  stepContainer: {
    flex: 1,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 255, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: 'rgba(168, 255, 0, 0.2)',
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 40,
    letterSpacing: -1,
    marginBottom: spacing.md,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: spacing.xxxl,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    borderBottomWidth: 2,
    borderBottomColor: colors.neonGreen,
    paddingBottom: spacing.sm,
    marginBottom: spacing.xl,
  },
  optionsContainer: {
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.xl,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedOption: {
    backgroundColor: colors.neonGreen,
    borderColor: colors.neonGreen,
  },
  optionText: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  selectedOptionText: {
    color: '#000000',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: spacing.xl,
  },
  button: {
    height: 64,
    borderRadius: 32,
  },
});
