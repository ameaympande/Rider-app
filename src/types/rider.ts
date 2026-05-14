export type RiderStatus = 'RIDING' | 'STOPPED' | 'OFFLINE' | 'SOS';

export type EmergencyContact = {
  name: string;
  phone: string;
};

export type User = {
  _id: string;
  name?: string;
  phone: string;
  avatar?: string;
  bikeName?: string;
  emergencyContacts: EmergencyContact[];
  createdAt: string;
  updatedAt: string;
};

export type Ride = {
  _id: string;
  name: string;
  destination?: string;
  adminId: string;
  isPrivate: boolean;
  inviteCode: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
};

export type BackendRiderLocation = {
  _id?: string;
  rideId: string;
  userId: string;
  lat: number;
  lng: number;
  speed?: number;
  heading?: number;
  battery?: number;
  status: RiderStatus;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type RiderLocation = Coordinate & {
  speedKmh: number;
  heading: number;
  batteryLevel: number;
  recordedAt: string;
};

export type Rider = {
  id: string;
  displayName: string;
  avatarUrl?: string;
  status: RiderStatus;
  location: RiderLocation;
};

export type RideSummary = {
  id: string;
  name: string;
  destination?: string;
  inviteCode: string;
  riderCount: number;
  startedAt: string;
  status: 'SCHEDULED' | 'ACTIVE' | 'COMPLETED';
};

export function toRideSummary(ride: Ride): RideSummary {
  return {
    id: ride._id,
    name: ride.name,
    destination: ride.destination,
    inviteCode: ride.inviteCode,
    riderCount: ride.members.length,
    startedAt: ride.createdAt,
    status: 'ACTIVE',
  };
}

export function toRider(location: BackendRiderLocation, user?: User): Rider {
  return {
    id: location.userId,
    displayName: user?.name ?? user?.phone ?? 'Rider',
    avatarUrl: user?.avatar,
    status: location.status,
    location: {
      latitude: location.lat,
      longitude: location.lng,
      speedKmh: location.speed ?? 0,
      heading: location.heading ?? 0,
      batteryLevel: location.battery ?? 0,
      recordedAt: location.createdAt ?? new Date().toISOString(),
    },
  };
}
