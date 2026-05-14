import {create} from 'zustand';
import {createJSONStorage, persist} from 'zustand/middleware';
import {createMMKV} from 'react-native-mmkv';

import type {User} from '../types/rider';

export type AuthSession = {
  userId: string;
  phone: string;
  accessToken: string;
  refreshToken: string;
  user: User;
};

type AuthState = {
  session: AuthSession | null;
  hasHydrated: boolean;
  setSession: (session: AuthSession) => void;
  updateTokens: (tokens: {accessToken: string; refreshToken: string}) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

const authStorage = createMMKV({id: 'rider-auth'});

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      session: null,
      hasHydrated: false,
      setSession: session => set({session}),
      updateTokens: tokens =>
        set(state => ({
          session: state.session ? {...state.session, ...tokens} : null,
        })),
      setUser: user =>
        set(state => ({
          session: state.session
            ? {
                ...state.session,
                user,
                userId: user._id,
                phone: user.phone,
              }
            : null,
        })),
      logout: () => set({session: null}),
      setHasHydrated: hasHydrated => set({hasHydrated}),
    }),
    {
      name: 'auth-session',
      storage: createJSONStorage(() => ({
        getItem: key => authStorage.getString(key) ?? null,
        setItem: (key, value) => authStorage.set(key, value),
        removeItem: key => {
          authStorage.remove(key);
        },
      })),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
