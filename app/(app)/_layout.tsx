import { Redirect, router, useSegments } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import { useAuth } from '@/src/auth/AuthContext';
import { useTheme } from '@/src/theme/ThemeContext';
import type { ThemeColors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

function CustomDrawerContent(props: any) {
  const { colors, mode, toggleMode } = useTheme();
  const drawerStyles = useMemo(() => createDrawerStyles(colors), [colors]);
  const themeLabel = mode === 'dark' ? 'Light mode' : 'Dark mode';
  const themeIcon = mode === 'dark' ? 'sunny-outline' : 'moon-outline';

  return (
    <DrawerContentScrollView
      {...props}
      style={drawerStyles.drawerScroll}
      contentContainerStyle={drawerStyles.drawerContent}
    >
      <View style={drawerStyles.drawerHeader}>
        <Pressable
          onPress={() => router.push('/')}
          style={drawerStyles.headerButton}
        >
          <Ionicons
            name="home-outline"
            size={20}
            color={colors.textSecondary}
          />

          <Text style={drawerStyles.headerButtonText}>
            Home
          </Text>
        </Pressable>
      </View> 
      
      <DrawerItemList {...props} />

      <View style={drawerStyles.drawerFooter}>
        <Pressable onPress={toggleMode} style={drawerStyles.footerButton}>
          <Ionicons name={themeIcon} size={20} color={colors.textSecondary} />
          <Text style={drawerStyles.footerButtonText}>{themeLabel}</Text>
        </Pressable>
      </View>
    </DrawerContentScrollView>
  );
}

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

  const styles = useMemo(() => createLayoutStyles(colors), [colors]);

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
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        ...screenOptions,
        drawerStyle: { backgroundColor: colors.surface },
        overlayColor: colors.overlay,
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerActiveBackgroundColor: colors.surfaceMuted,
        drawerItemStyle: {
          marginVertical: spacing.xs,
        },
      }}
    >
      <Drawer.Screen
        name="library"
        options={{
          title: 'My library',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="library-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="search"
        options={{
          title: 'Search',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="account"
        options={{
          title: 'Account',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

function createLayoutStyles(colors: ThemeColors) {
  return StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
  });
}

function createDrawerStyles(colors: ThemeColors) {
  return StyleSheet.create({
    drawerScroll: {
      backgroundColor: colors.surface,
    },
    drawerContent: {
      flexDirection: 'column',
      flexGrow: 1,
    },
    drawerFooter: {
      marginTop: 'auto',
      paddingTop: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    footerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    footerButtonText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '400',
    },
    drawerHeader: {
      marginBottom: spacing.xl * 2,
      paddingBottom: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
    },
    headerButtonText: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: '400',
    },
  });
}
