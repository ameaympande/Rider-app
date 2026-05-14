import type {EmergencyContact, User} from '../../types/rider';
import {apiClient} from './api-client';

export type UpdateProfileRequest = {
  name?: string;
  bikeName?: string;
  avatar?: string;
};

export const userApi = {
  getMe(): Promise<User> {
    return apiClient.get<User>('/users/me');
  },
  updateMe(payload: UpdateProfileRequest): Promise<User> {
    return apiClient.patch<User, UpdateProfileRequest>('/users/me', payload);
  },
  addEmergencyContact(payload: EmergencyContact): Promise<User> {
    return apiClient.post<User, EmergencyContact>(
      '/users/emergency-contact',
      payload,
    );
  },
};
