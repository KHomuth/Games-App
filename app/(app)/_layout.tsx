import { Redirect, Stack, useSegments } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { useAuth } from '@/src/auth/AuthContext';
import { useTheme } from '@/src/theme/ThemeContext';
import type { ThemeColors } from '@/src/theme/colors';

/**
 * Search is public; library/account still require a restored on-device session.
 */
export default function AuthenticatedGroupLayout() {
  const { user, isReady } = useAuth();
  const { colors } = useTheme();
  const segments = useSegments();

  const screenOptions = useMemo(
    () => ({
      headerStyle: { backgroundColor: colors.surface },
      headerTintColor: colors.primary,
      headerTitleStyle: { fontWeight: '600' as const, color: colors.textPrimary },
      contentStyle: { backgroundColor: colors.background },
    }),
    [colors]
  );

  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!isReady) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const routeName = segments[segments.length - 1];
  const canAccessWithoutLogin = routeName === 'search';

  if (!user && !canAccessWithoutLogin) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="library" options={{ title: 'My library' }} />
      <Stack.Screen name="search" options={{ title: 'Search' }} />
      <Stack.Screen name="account" options={{ title: 'Account' }} />
    </Stack>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
  });
}
