import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useAuth } from '@/src/auth/AuthContext';
import { Screen } from '@/src/components/Screen';
import {
  listLibraryGames,
  removeGameFromLibrary,
  type LibraryGameRow,
} from '@/src/db/libraryGames';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

/**
 * Per-user saved games from SQLite (populated from search).
 */
export default function LibraryScreen() {
  const { user } = useAuth();
  const [items, setItems] = useState<LibraryGameRow[]>([]);

  const refresh = useCallback(async () => {
    if (!user) return;
    const rows = await listLibraryGames(user.id);
    setItems(rows);
  }, [user]);

  useFocusEffect(
    useCallback(() => {
      void refresh();
    }, [refresh])
  );

  const onRemove = async (rawgId: number) => {
    if (!user) return;
    await removeGameFromLibrary(user.id, rawgId);
    await refresh();
  };

  return (
    <Screen safe={false}>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.rawgId)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.empty}>
            Nothing saved yet. Use Search and tap “Save” on a game you like.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              {item.backgroundImage ? (
                <Image source={{ uri: item.backgroundImage }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Text style={styles.thumbText}>—</Text>
                </View>
              )}
              <View style={styles.cardBody}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.meta}>Released: {item.released ?? '—'}</Text>
                <Text style={styles.meta}>
                  Metacritic: {item.metacritic != null ? String(item.metacritic) : '—'}
                </Text>
                <Text style={styles.meta} numberOfLines={2}>
                  Platforms: {item.platforms.length ? item.platforms.join(', ') : '—'}
                </Text>
                <Text style={styles.meta} numberOfLines={2}>
                  Genres: {item.genres.length ? item.genres.join(', ') : '—'}
                </Text>
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={() => void onRemove(item.rawgId)}
              style={({ pressed }) => [styles.remove, pressed && { opacity: 0.85 }]}
            >
              <Text style={styles.removeText}>Remove</Text>
            </Pressable>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  empty: {
    textAlign: 'center',
    marginTop: spacing.xl,
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
  },
  thumbPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbText: {
    color: colors.textSecondary,
  },
  cardBody: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  remove: {
    marginTop: spacing.sm,
    alignSelf: 'flex-end',
    backgroundColor: colors.danger,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
  },
  removeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
