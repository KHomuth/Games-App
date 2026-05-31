import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { RawgGame } from '@/src/api/rawg/types';
import { useTheme } from '@/src/theme/ThemeContext';
import type { ThemeColors } from '@/src/theme/colors';
import { getPlatformIcon, getPlatformKey } from '@/src/theme/platformIcons';
import { spacing } from '@/src/theme/spacing';

type Props = {
  game: RawgGame;
  inLibrary?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  actionDisabled?: boolean;
  actionLabel?: string;
};

function formatReleased(iso: string | null, tba: boolean): string {
  if (tba) return 'TBA';
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

/**
 * Search result row: art, core metadata, optional “save to library” action.
 */
export function GameResultCard({
  game,
  inLibrary = false,
  onAdd,
  onRemove,
  actionDisabled,
  actionLabel,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [showPlatforms, setShowPlatforms] = useState(false);

  const order = ['pc', 'playstation', 'xbox', 'nintendo', 'mobile', 'other'];

  const platformText =
    game.platforms
      ?.map((p) => p.platform?.name)
      .filter((n): n is string => typeof n === 'string')
      .sort((a, b) => {
        const aKey = getPlatformKey(a);
        const bKey = getPlatformKey(b);
        return order.indexOf(aKey) - order.indexOf(bKey);
      })
      .join(', ') || '—';

  const genres =
    game.genres
      ?.map((g) => g.name)
      .filter((n): n is string => typeof n === 'string')
      .join(', ') || '—';

  const platformKeys = Array.from(
    new Set(
      game.platforms
        ?.map((p) => p.platform?.name)
        .filter((n): n is string => typeof n === 'string')
        .map(getPlatformKey)
    )
  );

  return (
    <View style={styles.card}>
      {game.background_image ? (
        <Image source={{ uri: game.background_image }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.placeholderText}>No art</Text>
        </View>
      )}
      <Text style={styles.title}>{game.name}</Text>
      <Text style={styles.meta}>Released: {formatReleased(game.released, game.tba)}</Text>
      <Text style={styles.meta}>
        Metacritic: {game.metacritic != null ? String(game.metacritic) : '—'}
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={() => setShowPlatforms((prev) => !prev)}
      >
        <View style={styles.platformRow}>
          <Text style={styles.meta}>Platforms:</Text>

          {platformKeys.length ? (
            <View style={styles.iconRow}>
              {platformKeys.map((platformKey) => (
                <Ionicons
                  key={platformKey}
                  name={getPlatformIcon(platformKey)}
                  size={18}
                  color={colors.textSecondary}
                />
              ))}
            </View>
          ) : (
            <Text style={styles.meta}>—</Text>
          )}
        </View>

        {showPlatforms ? <Text style={styles.platformText}>{platformText}</Text> : null}
      </Pressable>
      <Text style={styles.meta} numberOfLines={2}>
        Genres: {genres}
      </Text>
      {inLibrary && onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${game.name} from library`}
          onPress={onRemove}
          disabled={actionDisabled}
          style={({ pressed }) => [
            styles.removeBtn,
            pressed && { opacity: 0.85 },
            actionDisabled && styles.actionDisabled,
          ]}
        >
          <Text style={styles.removeLabel}>{actionLabel ?? 'Remove'}</Text>
        </Pressable>
      ) : null}
      {!inLibrary && onAdd ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Add ${game.name} to library`}
          onPress={onAdd}
          disabled={actionDisabled}
          style={({ pressed }) => [
            styles.addBtn,
            pressed && { opacity: 0.85 },
            actionDisabled && styles.actionDisabled,
          ]}
        >
          <Text style={styles.addLabel}>{actionLabel ?? 'Add to library'}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 14,
      padding: spacing.md,
      marginBottom: spacing.md,
      shadowColor: colors.cardShadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 6,
      elevation: 3,
    },
    image: {
      width: '100%',
      height: 160,
      borderRadius: 10,
      marginBottom: spacing.sm,
      backgroundColor: colors.surfaceMuted,
    },
    imagePlaceholder: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    placeholderText: {
      color: colors.textSecondary,
      fontSize: 14,
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    meta: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    addBtn: {
      marginTop: spacing.sm,
      alignSelf: 'flex-start',
      backgroundColor: colors.primary,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: 8,
    },
    actionDisabled: {
      opacity: 0.45,
    },
    addLabel: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 14,
    },
    removeBtn: {
      marginTop: spacing.sm,
      alignSelf: 'flex-end',
      backgroundColor: colors.danger,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.md,
      borderRadius: 8,
    },
    removeLabel: {
      color: '#fff',
      fontWeight: '600',
      fontSize: 14,
    },
    platformRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
    },
    iconRow: {
      flexDirection: 'row',
      gap: 6,
      marginLeft: 6,
      flexWrap: 'wrap',
    },
    platformText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 4,
    },
  });
}
