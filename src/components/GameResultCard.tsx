import { memo, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

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
function GameResultCardComponent({
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
      <View style={styles.cardRow}>
        {game.background_image ? (
          <Image source={{ uri: game.background_image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.placeholderText}>No art</Text>
          </View>
        )}

        <View style={styles.cardBody}>
          <Text style={styles.title}>{game.name}</Text>
          <Text style={styles.meta}>
            Released: {formatReleased(game.released, game.tba)}
          </Text>
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
                  {platformKeys.map((platformKey) => {
                    const icon = getPlatformIcon(platformKey);

                    return icon.family === 'ion' ? (
                      <Ionicons
                        key={platformKey}
                        name={icon.name}
                        size={18}
                        color={colors.textSecondary}
                      />
                    ) : (
                      <MaterialCommunityIcons
                        key={platformKey}
                        name={icon.name}
                        size={18}
                        color={colors.textSecondary}
                      />
                    );
                  })}
                </View>
              ) : (
                <Text style={styles.meta}>—</Text>
              )}
            </View>

            {showPlatforms ? (
              <Text style={styles.platformText}>{platformText}</Text>
            ) : null}
          </Pressable>

          <Text style={styles.meta} numberOfLines={2}>
            Genres: {genres}
          </Text>
        </View>
      </View>

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
    cardRow: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    image: {
      width: 72,
      height: 72,
      borderRadius: 8,
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
    cardBody: {
      flex: 1,
    },
    title: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.primary,
      marginBottom: spacing.xxs * 2,
    },
    meta: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: spacing.xxs,
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
      color: colors.textOnPrimary,
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
      color: colors.textOnPrimary,
      fontWeight: '600',
      fontSize: 14,
    },
    platformRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: spacing.xxs,
    },
    iconRow: {
      flex: 1,
      flexDirection: 'row',
      gap: spacing.xs,
      marginLeft: spacing.xs,
      flexWrap: 'wrap',
    },
    platformText: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: spacing.xxs,
      lineHeight: 18,
    },
  });
}

export const GameResultCard = memo(GameResultCardComponent);
