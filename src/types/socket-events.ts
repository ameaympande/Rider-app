import type {BackendRiderLocation, RiderStatus} from './rider';

export type RidePresencePayload = {
  rideId: string;
};

export type LocationUpdatePayload = RidePresencePayload & {
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  battery?: number;
  status: RiderStatus;
};

export type SpeedUpdatePayload = RidePresencePayload & {
  speed: number;
};

export type EmergencySosPayload = RidePresencePayload & {
  message?: string;
};

export type RiderPresenceEvent = {
  userId: string;
};

export type RideUpdatedEvent = RidePresencePayload & {
  userId: string;
  status: RiderStatus;
};

export type ClientToServerEvents = {
  joinRide: (payload: RidePresencePayload) => void;
  leaveRide: (payload: RidePresencePayload) => void;
  locationUpdate: (payload: LocationUpdatePayload) => void;
  speedUpdate: (payload: SpeedUpdatePayload) => void;
  riderStatus: (payload: RidePresencePayload & {status: RiderStatus}) => void;
  emergencySOS: (payload: EmergencySosPayload) => void;
};

export type ServerToClientEvents = {
  riderJoined: (payload: RiderPresenceEvent) => void;
  riderLeft: (payload: RiderPresenceEvent) => void;
  riderLocation: (payload: BackendRiderLocation) => void;
  riderSpeed: (payload: SpeedUpdatePayload) => void;
  rideUpdated: (payload: RideUpdatedEvent) => void;
  emergencyAlert: (payload: EmergencySosPayload & {userId: string}) => void;
  error: (payload: {message: string}) => void;
};
