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
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMutation } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

import { GradientButton } from '../../components/buttons/gradient-button';
import { Screen } from '../../components/layout/screen';
import type { RootStackParamList } from '../../navigation/routes';
import { getApiErrorMessage } from '../../services/api/api-client';
import { authApi } from '../../services/api/auth-api';
import { useAuthStore } from '../../store/auth-store';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

type OtpScreenProps = NativeStackScreenProps<RootStackParamList, 'Otp'>;

export function OtpScreen({ route, navigation }: OtpScreenProps): React.JSX.Element {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const setSession = useAuthStore(state => state.setSession);
  const isValid = otp.trim().length === 6;
  const verifyOtpMutation = useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: response => {
      setErrorMessage(null);
      setSession({
        userId: response.user._id,
        phone: response.user.phone,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user,
      });
    },
    onError: error => {
      setErrorMessage(getApiErrorMessage(error));
    },
  });

  function verifyOtp(): void {
    verifyOtpMutation.mutate({
      phone: route.params.phoneNumber,
      otp: otp.trim(),
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Screen style={styles.screen} withGradient>
          <View style={styles.content}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <ArrowLeft size={24} color={colors.textPrimary} />
            </TouchableOpacity>

            <View style={styles.formSection}>
              <Text style={styles.title}>We sent you a code</Text>
              <Text style={styles.subtitle}>
                Enter the 6-digit code sent to {'\n'}
                <Text style={styles.highlight}>{route.params.phoneNumber}</Text>
              </Text>

              <View style={styles.inputWrapper}>
                <TextInput
                  keyboardType="number-pad"
                  maxLength={6}
                  placeholder="000000"
                  placeholderTextColor={colors.textMuted}
                  value={otp}
                  autoFocus
                  onChangeText={text => {
                    const cleaned = text.replace(/[^0-9]/g, '');
                    setOtp(cleaned);
                  }}
                  style={styles.input}
                />
              </View>

              <TouchableOpacity style={styles.resendButton}>
                <Text style={styles.resendText}>I didn't receive a code</Text>
              </TouchableOpacity>

              {errorMessage ? (
                <Text style={styles.error}>{errorMessage}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.footer}>
             <GradientButton
              label="Next"
              icon={<ArrowRight size={20} color="#000000" />}
              disabled={!isValid}
              isLoading={verifyOtpMutation.isPending}
              onPress={verifyOtp}
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
    paddingTop: spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
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
    lineHeight: 24,
    marginBottom: spacing.xxxxl,
  },
  highlight: {
    color: colors.textPrimary,
    fontWeight: '800',
  },
  inputWrapper: {
    borderBottomWidth: 2,
    borderBottomColor: colors.neonGreen,
    paddingBottom: spacing.sm,
    marginBottom: spacing.xl,
  },
  input: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 12,
    textAlign: 'center',
  },
  resendButton: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  resendText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  footer: {
    paddingBottom: spacing.xxl,
  },
  button: {
    height: 64,
    borderRadius: 32,
  },
  error: {
    marginTop: spacing.xl,
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
});
