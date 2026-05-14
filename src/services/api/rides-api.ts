import type {Ride, User} from '../../types/rider';
import {apiClient} from './api-client';

export type CreateRideRequest = {
  name: string;
  destination?: string;
  isPrivate: boolean;
};

export type JoinRideRequest = {
  inviteCode?: string;
};

export const ridesApi = {
  createRide(payload: CreateRideRequest): Promise<Ride> {
    return apiClient.post<Ride, CreateRideRequest>('/rides', payload);
  },
  getRide(rideId: string): Promise<Ride> {
    return apiClient.get<Ride>(`/rides/${rideId}`);
  },
  joinRide(rideId: string, payload: JoinRideRequest): Promise<Ride> {
    return apiClient.post<Ride, JoinRideRequest>(`/rides/${rideId}/join`, payload);
  },
  leaveRide(rideId: string): Promise<Ride> {
    return apiClient.post<Ride, Record<string, never>>(
      `/rides/${rideId}/leave`,
      {},
    );
  },
  getMembers(rideId: string): Promise<User[]> {
    return apiClient.get<User[]>(`/rides/${rideId}/members`);
  },
  removeMember(rideId: string, userId: string): Promise<Ride> {
    return apiClient.delete<Ride>(`/rides/${rideId}/members/${userId}`);
  },
};
