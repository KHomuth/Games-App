import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useMemo } from 'react';

import { AuthProvider } from '@/src/auth/AuthContext';
import { ThemeProvider, useTheme } from '@/src/theme/ThemeContext';

// Keep the splash visible until auth finishes restoring the on-device session.
SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { colors, mode } = useTheme();

  const headerOptions = useMemo(
    () => ({
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.primary,
      headerTitleStyle: { fontWeight: '600' as const, color: colors.textPrimary },
      contentStyle: { backgroundColor: colors.background },
    }),
    [colors]
  );

  return (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack screenOptions={headerOptions}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: 'Sign in', presentation: 'modal' }} />
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    OrbitronExtraBold: require('../assets/fonts/Orbitron-ExtraBold.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  SplashScreen.hideAsync();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
