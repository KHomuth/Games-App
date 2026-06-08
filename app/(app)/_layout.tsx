import { Redirect, router, useSegments } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

import { useAuth } from '@/src/auth/AuthContext';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

const screenOptions = {
  headerStyle: { backgroundColor: colors.surface },
  headerTintColor: colors.primary,
  headerTitleStyle: { fontWeight: '600' as const, color: colors.textPrimary },
  contentStyle: { backgroundColor: colors.background },
};

function CustomDrawerContent(props: any) {
  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.drawerContent}
    >
      <DrawerItemList {...props} />

      <View style={styles.drawerFooter}>
        <Pressable
          onPress={() => router.push('/')}
          style={styles.homeButton}
        >
          <Ionicons
            name="home-outline"
            size={20}
            color={colors.textSecondary}
          />

          <Text style={styles.homeButtonText}>
            Home
          </Text>
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
  const segments = useSegments();

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

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  drawerContent: {
    flexGrow: 1,
  },
  drawerFooter: {
  marginTop: spacing.xl * 2,
  paddingTop: spacing.md,
  borderTopWidth: 1,
  borderTopColor: colors.surfaceMuted,
},
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  homeButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '400',
  },
});