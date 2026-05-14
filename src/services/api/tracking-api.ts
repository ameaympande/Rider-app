import type {BackendRiderLocation} from '../../types/rider';
import {apiClient} from './api-client';

export type SaveLocationRequest = {
  rideId: string;
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  battery?: number;
  status?: BackendRiderLocation['status'];
};

export const trackingApi = {
  saveLocation(payload: SaveLocationRequest): Promise<BackendRiderLocation> {
    return apiClient.post<BackendRiderLocation, SaveLocationRequest>(
      '/tracking/location',
      payload,
    );
  },
  getLiveRiders(rideId: string): Promise<BackendRiderLocation[]> {
    return apiClient.get<BackendRiderLocation[]>(`/tracking/live/${rideId}`);
  },
  getHistory(rideId: string): Promise<BackendRiderLocation[]> {
    return apiClient.get<BackendRiderLocation[]>(
      `/tracking/history/${rideId}`,
    );
  },
};
