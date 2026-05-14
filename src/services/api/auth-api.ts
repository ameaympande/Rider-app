import {apiClient} from './api-client';
import type {User} from '../../types/rider';

export type SendOtpRequest = {
  phone: string;
};

export type SendOtpResponse = {
  success: true;
  message: string;
};

export type VerifyOtpRequest = {
  phone: string;
  otp: string;
};

export type VerifyOtpResponse = {
  success: true;
  accessToken: string;
  refreshToken: string;
  user: User;
};

export const authApi = {
  sendOtp(payload: SendOtpRequest): Promise<SendOtpResponse> {
    return apiClient.post<SendOtpResponse, SendOtpRequest>(
      '/auth/send-otp',
      payload,
    );
  },
  verifyOtp(payload: VerifyOtpRequest): Promise<VerifyOtpResponse> {
    return apiClient.post<VerifyOtpResponse, VerifyOtpRequest>(
      '/auth/verify-otp',
      payload,
    );
  },
};
