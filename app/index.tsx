import { Ionicons } from '@expo/vector-icons';
import { Link, type Href } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/src/auth/AuthContext';
import { Screen } from '@/src/components/Screen';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

type IconName = ComponentProps<typeof Ionicons>['name'];

/**
 * Entry hub: explains the demo and routes to library, search, or auth.
 */
export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Games DB</Text>
        <Text style={styles.subtitle}>
          Demo app: accounts and your library live on this device only. Game data comes from the
          public RAWG API.
        </Text>
      </View>

      <View style={styles.actions}>
        <MenuLink href="/library" icon="library-outline" label="My library" />
        <MenuLink href="/search" icon="search-outline" label="Search games" />
        {user ? (
          <MenuLink href="/account" icon="person-outline" label="Account" />
        ) : (
          <MenuLink href="/login" icon="log-in-outline" label="Sign in / Register" />
        )}
      </View>
    </Screen>
  );
}

function MenuLink({ href, icon, label }: { href: Href; icon: IconName; label: string }) {
  return (
    <Link href={href} asChild>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [styles.row, pressed && { opacity: 0.9 }]}
      >
        <Ionicons name={icon} size={26} color="#fff" />
        <Text style={styles.rowLabel}>{label}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
  },
  actions: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  rowLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
