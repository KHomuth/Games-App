import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';

import { GameFiltersPanel } from '@/src/components/GameFiltersPanel';
import { LibraryGameCard } from '@/src/components/LibraryGameCard';
import { LoadMoreFooter } from '@/src/components/LoadMoreFooter';
import { listScreenStyles } from '@/src/components/listScreenStyles';
import { Screen } from '@/src/components/Screen';
import { GAME_LIST_FLATLIST_PROPS } from '@/src/constants/flatList';
import { describeFilters } from '@/src/filters/describeFilters';
import { EMPTY_GAME_FILTERS, hasActiveFilters, type GameFilters } from '@/src/filters/types';
import { useAuth } from '@/src/auth/AuthContext';
import {
  removeGameFromLibrary,
  searchLibraryGames,
  type LibraryGameRow,
  type LibrarySearchSort,
} from '@/src/db/libraryGames';
import { useDebouncedValue } from '@/src/hooks/useDebouncedValue';
import { useGameCatalogOptions } from '@/src/hooks/useGameCatalogOptions';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

/**
 * Per-user saved games with shared filters and Load more pagination.
 */
export default function LibraryScreen() {
  const { user } = useAuth();
  const [filters, setFilters] = useState<GameFilters>(EMPTY_GAME_FILTERS);
  const debouncedQuery = useDebouncedValue(filters.query, 450);
  const { platformIds, genreSlugs } = filters;
  const debouncedFilters = useMemo(
    () => ({ query: debouncedQuery, platformIds, genreSlugs }),
    [debouncedQuery, platformIds, genreSlugs]
  );

  const { platforms, genres, platformOptions, genreOptions, ready, error: catalogError } =
    useGameCatalogOptions();

  const [items, setItems] = useState<LibraryGameRow[]>([]);
  const [sortBy, setSortBy] = useState<LibrarySearchSort>('added');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const filterDescription = useMemo(
    () =>
      hasActiveFilters(debouncedFilters)
        ? describeFilters(debouncedFilters, platforms, genres)
        : null,
    [debouncedFilters, platforms, genres]
  );

  const loadPage = useCallback(
    async (append: boolean, listOffset: number) => {
      if (!user) return;

      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        const result = await searchLibraryGames(user.id, debouncedFilters, {
          offset: listOffset,
          sortBy,
          sortDirection,
        });

        if (append) {
          setItems((prev) => [...prev, ...result.games]);
        } else {
          setItems(result.games);
        }
        setTotal(result.total);
        setHasMore(result.hasMore);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [user, debouncedFilters, sortBy, sortDirection]
  );

  useEffect(() => {
    if (!user) {
      setItems([]);
      setHasMore(false);
      setTotal(0);
      return;
    }
    void loadPage(false, 0);
  }, [user, debouncedFilters, sortBy, sortDirection, loadPage]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      void loadPage(false, 0);
    }, [user, loadPage])
  );

  const onLoadMore = useCallback(() => {
    if (!hasMore || loadingMore || loading || !user) return;
    void loadPage(true, items.length);
  }, [hasMore, loadingMore, loading, user, loadPage, items.length]);

  const onRemove = useCallback(
    async (rawgId: number) => {
      if (!user) return;
      await removeGameFromLibrary(user.id, rawgId);
      void loadPage(false, 0);
    },
    [user, loadPage]
  );

  const keyExtractor = useCallback((item: LibraryGameRow) => String(item.rawgId), []);

  const renderItem: ListRenderItem<LibraryGameRow> = useCallback(
    ({ item }) => <LibraryGameCard item={item} onRemove={onRemove} />,
    [onRemove]
  );

  const listEmpty = useMemo(
    () =>
      !loading ? (
        <Text style={listScreenStyles.empty}>
          {hasActiveFilters(debouncedFilters)
            ? 'No saved games matched these filters.'
            : 'Nothing in your library yet. Use Search and tap “add to library” on a game you like.'}
        </Text>
      ) : null,
    [loading, debouncedFilters]
  );

  const listFooter = useMemo(
    () => (
      <LoadMoreFooter
        visible={hasMore && !loading && items.length > 0}
        loading={loadingMore}
        onPress={onLoadMore}
      />
    ),
    [hasMore, loading, items.length, loadingMore, onLoadMore]
  );

  const changeSort = (nextSortBy: LibrarySearchSort) => {
    if (sortBy === nextSortBy) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(nextSortBy);
      setSortDirection(nextSortBy === 'added' ? 'desc' : 'asc');
    }
  };

  const sortLabel = (field: LibrarySearchSort, label: string) => {
    const active = sortBy === field;
    const arrow = active ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : '';
    return `${label}${arrow}`;
  };

  return (
    <Screen safe={false}>
      <GameFiltersPanel
        filters={filters}
        onChange={setFilters}
        platformOptions={platformOptions}
        genreOptions={genreOptions}
        catalogReady={ready}
        catalogError={catalogError}
      />

      <View style={styles.sortRow}>
        <Pressable
          onPress={() => changeSort('name')}
          style={[styles.sortButton, sortBy === 'name' && styles.sortButtonActive]}
        >
          <Text style={styles.sortButtonText}>{sortLabel('name', 'Name')}</Text>
        </Pressable>
        <Pressable
          onPress={() => changeSort('released')}
          style={[styles.sortButton, sortBy === 'released' && styles.sortButtonActive]}
        >
          <Text style={styles.sortButtonText}>{sortLabel('released', 'Release')}</Text>
        </Pressable>
        <Pressable
          onPress={() => changeSort('metacritic')}
          style={[styles.sortButton, sortBy === 'metacritic' && styles.sortButtonActive]}
        >
          <Text style={styles.sortButtonText}>{sortLabel('metacritic', 'Rating')}</Text>
        </Pressable>
      </View>

      {filterDescription ? (
        <Text style={listScreenStyles.filterNote}>{filterDescription}</Text>
      ) : null}

      {total > 0 ? (
        <Text style={styles.countNote}>
          {items.length} of {total} in library
        </Text>
      ) : null}

      {loading ? (
        <ActivityIndicator style={listScreenStyles.loader} color={colors.primary} />
      ) : null}

      <FlatList
        {...GAME_LIST_FLATLIST_PROPS}
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={listScreenStyles.listContent}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={listFooter}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sortButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  sortButtonText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  sortButtonActive: {
    borderColor: colors.primary,
    borderWidth: 3,
  },
  countNote: {
    fontSize: 13,
    color: colors.textSecondary,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
});
