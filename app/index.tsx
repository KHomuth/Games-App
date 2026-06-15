import { Ionicons } from '@expo/vector-icons';
import { Link, type Href } from 'expo-router';
import type { ComponentProps } from 'react';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/src/auth/AuthContext';
import { Screen } from '@/src/components/Screen';
import { useTheme } from '@/src/theme/ThemeContext';
import type { ThemeColors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

type IconName = ComponentProps<typeof Ionicons>['name'];

/**
 * Entry hub: explains the demo and routes to library, search, or auth.
 */
export default function HomeScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
        <MenuLink href="/library" icon="library-outline" label="My library" styles={styles} colors={colors} />
        <MenuLink href="/search" icon="search-outline" label="Search games" styles={styles} colors={colors} />
        {user ? (
          <MenuLink href="/account" icon="person-outline" label="Account" styles={styles} colors={colors} />
        ) : (
          <MenuLink href="/login" icon="log-in-outline" label="Sign in / Register" styles={styles} colors={colors} />
        )}
      </View>
    </Screen>
  );
}

type HomeStyles = ReturnType<typeof createStyles>;

function MenuLink({
  href,
  icon,
  label,
  styles,
  colors,
}: {
  href: Href;
  icon: IconName;
  label: string;
  styles: HomeStyles;
  colors: ThemeColors;
}) {
  return (
    <Link href={href} asChild>
      <Pressable accessibilityRole="button" style={styles.row}>
        <Ionicons name={icon} size={30} color={colors.textOnPrimary} />
        <Text style={styles.rowLabel}>{label}</Text>
      </Pressable>
    </Link>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    header: {
      paddingTop: spacing.lg,
      marginTop: spacing.xxl + spacing.xxs,
      marginBottom: spacing.lg * 3,
      paddingHorizontal: spacing.lg,
    },
    title: {
      fontFamily: 'OrbitronExtraBold',
      fontSize: 45,
      color: colors.primary,
      textAlign: 'center',
      letterSpacing: 5.5,
      marginBottom: spacing.xl,
    },
    subtitle: {
      fontSize: 15,
      lineHeight: 22,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    actions: {
      gap: spacing.lg + spacing.sm + spacing.xxs,
      alignItems: 'center',
    },
    row: {
      width: '75%',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.md - spacing.xxs,
      backgroundColor: colors.primary,
      paddingVertical: spacing.sm + spacing.xxs,
      paddingHorizontal: spacing.lg + spacing.xxs,
      borderRadius: 22,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.15,
      shadowRadius: 5,
      elevation: 4,
    },
    rowLabel: {
      color: colors.textOnPrimary,
      fontSize: 26,
      fontWeight: '800',
    },
  });
}
