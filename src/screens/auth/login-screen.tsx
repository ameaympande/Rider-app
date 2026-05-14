import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { ArrowRight } from 'lucide-react-native';

import { GradientButton } from '../../components/buttons/gradient-button';
import { Screen } from '../../components/layout/screen';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import type { RootStackParamList } from '../../navigation/routes';
import { authApi } from '../../services/api/auth-api';
import { getApiErrorMessage } from '../../services/api/api-client';

type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;

export function LoginScreen({
  navigation,
}: LoginScreenProps): React.JSX.Element {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const sendOtpMutation = useMutation({
    mutationFn: authApi.sendOtp,
    onSuccess: () => {
      setErrorMessage(null);
      navigation.navigate('Otp', {
        phoneNumber: `+91${cleanedPhone}`,
      });
    },
    onError: error => {
      setErrorMessage(getApiErrorMessage(error));
    },
  });

  const cleanedPhone = phoneNumber.replace(/\D/g, '');
  const isValid = cleanedPhone.length === 10;
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Screen style={styles.screen} withGradient>
          <View style={styles.content}>
            <View style={styles.branding}>
              {/* <View style={styles.logoCircle} /> */}
              <Text style={styles.brandName}>RIDER</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.title}>What's your number?</Text>
              <Text style={styles.subtitle}>
                We'll send a code to verify your phone.
              </Text>

              <View style={styles.inputWrapper}>
                <View style={styles.countryCode}>
                  <Text style={styles.countryCodeText}>+91</Text>
                </View>
                <TextInput
                  keyboardType="number-pad"
                  placeholder="00000 00000"
                  placeholderTextColor={colors.textMuted}
                  value={phoneNumber}
                  onChangeText={text => {
                    const cleaned = text.replace(/[^0-9]/g, '');
                    setPhoneNumber(cleaned);
                  }}
                  autoFocus
                  maxLength={10}
                  style={styles.input}
                />
              </View>
              
              {errorMessage ? (
                <Text style={styles.error}>{errorMessage}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.terms}>
              By continuing you may receive an SMS for verification. Message and data rates may apply.
            </Text>
            <GradientButton
              label="Next"
              icon={<ArrowRight size={20} color="#000000" />}
              disabled={!isValid}
              isLoading={sendOtpMutation.isPending}
              onPress={() =>
                sendOtpMutation.mutate({
                  phone: `+91${phoneNumber.trim()}`,
                })
              }
              style={styles.button}
            />
          </View>
        </Screen>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    paddingTop: spacing.xxxl,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxxxl,
  },
  logoCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.neonGreen,
  },
  brandName: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  formSection: {
    flex: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: spacing.xxxl,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: colors.neonGreen,
    paddingBottom: spacing.sm,
  },
  countryCode: {
    paddingRight: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },
  countryCodeText: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 2,
  },
  footer: {
    paddingBottom: spacing.xxl,
    gap: spacing.xl,
  },
  terms: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
  button: {
    height: 64,
    borderRadius: 32,
  },
  error: {
    marginTop: spacing.md,
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
});
