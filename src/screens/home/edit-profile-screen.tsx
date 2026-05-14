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
  Alert,
} from 'react-native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, User, Bike, Check } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from '../../components/layout/screen';
import { GradientButton } from '../../components/buttons/gradient-button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { userApi } from '../../services/api/user-api';
import { useAuthStore } from '../../store/auth-store';
import type { RootStackParamList } from '../../navigation/routes';

export function EditProfileScreen(): React.JSX.Element {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const { session, setUser } = useAuthStore();
  const user = session?.user;

  const [name, setName] = useState(user?.name ?? '');
  const [bikeName, setBikeName] = useState(user?.bikeName ?? '');

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateMe,
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    },
    onError: () => {
      Alert.alert('Error', 'Failed to update profile');
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter your name');
      return;
    }
    updateProfileMutation.mutate({
      name: name.trim(),
      bikeName: bikeName.trim(),
    });
  };

  return (

      <Screen style={styles.screen}>
        <View style={styles.topNav}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <ArrowLeft size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <TouchableOpacity onPress={handleSave} disabled={updateProfileMutation.isPending}>
            {updateProfileMutation.isPending ? (
              <Check size={24} color={colors.textMuted} />
            ) : (
              <Check size={24} color={colors.neonGreen} />
            )}
          </TouchableOpacity>
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <User size={48} color={colors.neonGreen} />
            </View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <User size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bike Model</Text>
              <View style={styles.inputWrapper}>
                <Bike size={20} color={colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={bikeName}
                  onChangeText={setBikeName}
                  placeholder="e.g. Ninja 400"
                  placeholderTextColor={colors.textMuted}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={[styles.inputWrapper, styles.disabledInput]}>
                <TextInput
                  style={[styles.input, { color: colors.textMuted }]}
                  value={user?.phone}
                  editable={false}
                />
              </View>
              <Text style={styles.infoText}>Phone number cannot be changed.</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <GradientButton
            label="Save Changes"
            onPress={handleSave}
            isLoading={updateProfileMutation.isPending}
          />
        </View>
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
    paddingBottom: spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(168, 255, 0, 0.2)',
    marginBottom: spacing.md,
  },
  changePhotoButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 255, 0, 0.1)',
  },
  changePhotoText: {
    color: colors.neonGreen,
    fontSize: 14,
    fontWeight: '700',
  },
  form: {
    gap: spacing.xl,
  },
  inputGroup: {
    gap: spacing.sm,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  disabledInput: {
    opacity: 0.6,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  infoText: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
});
