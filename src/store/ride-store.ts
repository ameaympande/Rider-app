import {create} from 'zustand';

import type {Rider, RideSummary} from '../types/rider';

type RideState = {
  activeRide: RideSummary | null;
  ridersById: Record<string, Rider>;
  setActiveRide: (ride: RideSummary) => void;
  upsertRider: (rider: Rider) => void;
  removeRider: (riderId: string) => void;
  resetRide: () => void;
};

export const useRideStore = create<RideState>(set => ({
  activeRide: null,
  ridersById: {},
  setActiveRide: activeRide => set({activeRide}),
  upsertRider: rider =>
    set(state => ({
      ridersById: {
        ...state.ridersById,
        [rider.id]: rider,
      },
    })),
  removeRider: riderId =>
    set(state => {
      const nextRiders = {...state.ridersById};
      delete nextRiders[riderId];
      return {ridersById: nextRiders};
    }),
  resetRide: () => set({activeRide: null, ridersById: {}}),
}));
