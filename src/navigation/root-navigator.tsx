import React, { useEffect, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home as HomeIcon, User as UserIcon, Settings as SettingsIcon, Clock } from 'lucide-react-native';

import { LoginScreen } from '../screens/auth/login-screen';
import { OtpScreen } from '../screens/auth/otp-screen';
import { SplashScreen } from '../screens/auth/splash-screen';
import { HomeScreen } from '../screens/home/home-screen';
import { ProfileScreen } from '../screens/home/profile-screen';
import { LiveMapScreen } from '../screens/ride/live-map-screen';
import { RideRoomScreen } from '../screens/ride/ride-room-screen';
import { EditProfileScreen } from '../screens/home/edit-profile-screen';
import { HistoryScreen } from '../screens/home/history-screen';
import { SettingsScreen } from '../screens/home/settings-screen';
import { ExploreScreen } from '../screens/home/explore-screen';
import { GarageScreen } from '../screens/home/garage-screen';
import { SafetyScreen } from '../screens/home/safety-screen';
import { SubscriptionScreen } from '../screens/home/subscription-screen';
import { NotificationScreen } from '../screens/home/notification-screen';
import { Sidebar } from '../components/layout/sidebar';
import { useAuthStore } from '../store/auth-store';
import { colors } from '../theme/colors';
import type { RootStackParamList } from './routes';
import { OnboardingScreen } from '../screens/auth/onboarding-screen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootStackParamList>();

const navigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    text: colors.textPrimary,
    border: colors.border,
    primary: colors.neonGreen,
  },
};

function AppDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: colors.neonGreen,
        drawerInactiveTintColor: colors.textSecondary,
        drawerStyle: {
          backgroundColor: colors.background,
          width: '75%',
        },
        drawerLabelStyle: {
          fontWeight: '800',
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          drawerIcon: ({ color }) => <HomeIcon size={22} color={color} />,
          drawerLabel: 'Dashboard',
        }} 
      />
      <Drawer.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          drawerIcon: ({ color }) => <UserIcon size={22} color={color} />,
        }} 
      />
      <Drawer.Screen 
        name="History" 
        component={HistoryScreen}
        options={{
          drawerIcon: ({ color }) => <Clock size={22} color={color} />,
        }} 
      />
      <Drawer.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => <SettingsIcon size={22} color={color} />,
        }} 
      />
    </Drawer.Navigator>
  );
}

export function RootNavigator(): React.JSX.Element {
  const session = useAuthStore(state => state.session);
  const hasHydrated = useAuthStore(state => state.hasHydrated);

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (hasHydrated) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [hasHydrated]);

  if (!hasHydrated || showSplash) {
    return <SplashScreen />;
  }

  const isProfileComplete = Boolean(session?.user?.name);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {session ? (
          !isProfileComplete ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : (
            <>
              <Stack.Screen name="AppDrawer" component={AppDrawer} />

              <Stack.Screen name="RideRoom" component={RideRoomScreen} />

              <Stack.Screen name="LiveMap" component={LiveMapScreen} />

              <Stack.Screen name="EditProfile" component={EditProfileScreen} />

              <Stack.Screen name="Explore" component={ExploreScreen} />
              
              <Stack.Screen name="Garage" component={GarageScreen} />
              <Stack.Screen name="Safety" component={SafetyScreen} />
              <Stack.Screen name="Subscription" component={SubscriptionScreen} />
              <Stack.Screen name="Notifications" component={NotificationScreen} />
            </>
          )
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />

            <Stack.Screen name="Otp" component={OtpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
