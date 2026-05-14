import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';

import {appConfig} from '../../constants/config';
import {useAuthStore} from '../../store/auth-store';

export type ApiSuccessResponse<TData> = {
  success: true;
  data: TData;
  message: string;
};

export type ApiErrorResponse = {
  success?: false;
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export class ApiClient {
  private readonly client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 12_000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(config => {
      const token = useAuthStore.getState().session?.accessToken;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    this.client.interceptors.response.use(
      response => response,
      async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config as RetryableRequestConfig | undefined;
        const refreshToken = useAuthStore.getState().session?.refreshToken;

        if (
          error.response?.status !== 401 ||
          !originalRequest ||
          originalRequest._retry ||
          !refreshToken
        ) {
          throw error;
        }

        originalRequest._retry = true;

        try {
          const response = await axios.post<{
            accessToken: string;
            refreshToken: string;
          }>(`${baseUrl}/auth/refresh`, {refreshToken});

          useAuthStore.getState().updateTokens(response.data);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;

          return this.client.request(originalRequest);
        } catch (refreshError) {
          useAuthStore.getState().logout();
          throw refreshError;
        }
      },
    );
  }

  async get<TData>(url: string): Promise<TData> {
    const response = await this.client.get<TData>(url);
    return response.data;
  }

  async post<TData, TPayload extends object>(
    url: string,
    payload: TPayload,
  ): Promise<TData> {
    const response = await this.client.post<TData>(url, payload);
    return response.data;
  }

  async patch<TData, TPayload extends object>(
    url: string,
    payload: TPayload,
  ): Promise<TData> {
    const response = await this.client.patch<TData>(url, payload);
    return response.data;
  }

  async delete<TData>(url: string): Promise<TData> {
    const response = await this.client.delete<TData>(url);
    return response.data;
  }
}

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse | undefined;
    const message = response?.message;

    if (Array.isArray(message)) {
      return message.join('\n');
    }

    return message ?? response?.error ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}

export const apiClient = new ApiClient(appConfig.apiBaseUrl);
