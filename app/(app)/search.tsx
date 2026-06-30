import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, type ListRenderItem } from 'react-native';

import { RawgConfigError, RawgHttpError, getGameDetails, searchGames, type RawgGame, type RawgGameDetails } from '@/src/api/rawg';
import { GameDetailsModal, rawgToDetailsContent, type GameDetailsContent } from '@/src/components/GameDetailsModal';
import { GameFiltersPanel } from '@/src/components/GameFiltersPanel';
import { LoadMoreFooter } from '@/src/components/LoadMoreFooter';
import { SearchResultRow } from '@/src/components/SearchResultRow';
import { useListScreenStyles } from '@/src/components/listScreenStyles';
import { Screen } from '@/src/components/Screen';
import { GAME_LIST_FLATLIST_PROPS } from '@/src/constants/flatList';
import { describeFilters } from '@/src/filters/describeFilters';
import { EMPTY_GAME_FILTERS, hasActiveFilters, type GameFilters } from '@/src/filters/types';
import {
  addGameToLibrary,
  listLibraryRawgIds,
  removeGameFromLibrary,
} from '@/src/db/libraryGames';
import { useAuth } from '@/src/auth/AuthContext';
import { useDebouncedValue } from '@/src/hooks/useDebouncedValue';
import { useGameCatalogOptions } from '@/src/hooks/useGameCatalogOptions';
import { useTheme } from '@/src/theme/ThemeContext';

/**
 * Debounced RAWG search with shared platform/genre multiselect filters.
 */
export default function SearchScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const listScreenStyles = useListScreenStyles();
  const [filters, setFilters] = useState<GameFilters>(EMPTY_GAME_FILTERS);
  const debouncedQuery = useDebouncedValue(filters.query, 450);
  const { platformIds, genreSlugs } = filters;
  const debouncedFilters = useMemo(
    () => ({ query: debouncedQuery, platformIds, genreSlugs }),
    [debouncedQuery, platformIds, genreSlugs]
  );

  const { platforms, genres, platformOptions, genreOptions, ready, error: catalogError } =
    useGameCatalogOptions();

  const [results, setResults] = useState<RawgGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [libraryIds, setLibraryIds] = useState<Set<number>>(() => new Set());
  const [savingId, setSavingId] = useState<number | null>(null);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<RawgGame | null>(null);
  const [gameDetails, setGameDetails] = useState<RawgGameDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const filterDescription = useMemo(
    () => describeFilters(debouncedFilters, platforms, genres),
    [debouncedFilters, platforms, genres]
  );

  const refreshLibraryIds = useCallback(async () => {
    if (!user) {
      setLibraryIds(new Set());
      return;
    }
    const ids = await listLibraryRawgIds(user.id);
    setLibraryIds(ids);
  }, [user]);

  useEffect(() => {
    void refreshLibraryIds();
  }, [refreshLibraryIds]);

  useFocusEffect(
    useCallback(() => {
      void refreshLibraryIds();
    }, [refreshLibraryIds])
  );

  const runSearch = useCallback(async () => {
    abortRef.current?.abort();

    if (!hasActiveFilters(debouncedFilters)) {
      setResults([]);
      setError(null);
      setNextPageUrl(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      const data = await searchGames({ filters: debouncedFilters }, { signal: controller.signal });
      setResults(data.games);
      setNextPageUrl(data.nextPageUrl);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') {
        return;
      }
      if (e instanceof RawgConfigError) {
        setError(e.message);
      } else if (e instanceof RawgHttpError) {
        setError('Could not reach RAWG. Check your network or API key.');
      } else {
        setError('Something went wrong while searching.');
      }
      setResults([]);
      setNextPageUrl(null);
    } finally {
      setLoading(false);
    }
  }, [debouncedFilters]);

  useEffect(() => {
    void runSearch();
    return () => {
      abortRef.current?.abort();
    };
  }, [runSearch]);

  const onLoadMore = useCallback(async () => {
    if (!nextPageUrl || loadingMore || loading) return;
    const controller = new AbortController();
    abortRef.current = controller;
    setLoadingMore(true);

    try {
      const data = await searchGames(
        { filters: debouncedFilters, pageUrl: nextPageUrl },
        { signal: controller.signal }
      );
      setResults((prev) => [...prev, ...data.games]);
      setNextPageUrl(data.nextPageUrl);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') {
        return;
      }
      if (e instanceof RawgConfigError) {
        setError(e.message);
      } else if (e instanceof RawgHttpError) {
        setError('Could not load more from RAWG. Check your network or API key.');
      } else {
        setError('Something went wrong while loading more results.');
      }
    } finally {
      setLoadingMore(false);
    }
  }, [nextPageUrl, loadingMore, loading, debouncedFilters]);

  const onSave = useCallback(
    async (game: RawgGame) => {
      if (!user) {
        Alert.alert(
          'Sign in required',
          'Create an account or sign in to save games to your library.'
        );
        return;
      }

      setSavingId(game.id);

      try {
        let details: RawgGameDetails | null = null;
        try {
          details = await getGameDetails(game.id);
        } catch {
          // Still save basic metadata when detail fetch fails.
        }

        const outcome = await addGameToLibrary(user.id, game, details);
        if (outcome.ok) {
          setLibraryIds((prev) => new Set(prev).add(game.id));
          Alert.alert('Added to library', `${game.name} was added to your library.`);
        } else if (outcome.code === 'ALREADY_SAVED') {
          setLibraryIds((prev) => new Set(prev).add(game.id));
          Alert.alert('Already in library', 'This game is already in your library.');
        }
      } finally {
        setSavingId(null);
      }
    },
    [user]
  );

  const onRemove = useCallback(
    async (rawgId: number) => {
      if (!user) return;

      setRemovingId(rawgId);

      try {
        await removeGameFromLibrary(user.id, rawgId);
        setLibraryIds((prev) => {
          const next = new Set(prev);
          next.delete(rawgId);
          return next;
        });
      } finally {
        setRemovingId(null);
      }
    },
    [user]
  );

  const onOpenDetails = useCallback(async (game: RawgGame) => {
    setSelectedGame(game);
    setGameDetails(null);
    setDetailsLoading(true);

    try {
      const details = await getGameDetails(game.id);
      setGameDetails(details);
    } catch (error) {
      console.error(error);
    } finally {
      setDetailsLoading(false);
    }
  }, []);

  const closeDetails = useCallback(() => {
    setSelectedGame(null);
    setGameDetails(null);
  }, []);

  const selectedDetailsContent = useMemo<GameDetailsContent | null>(() => {
    if (!selectedGame) return null;
    return rawgToDetailsContent(selectedGame, gameDetails);
  }, [selectedGame, gameDetails]);

  const keyExtractor = useCallback((item: RawgGame) => String(item.id), []);

  const renderItem: ListRenderItem<RawgGame> = useCallback(
    ({ item }) => {
      const inLibrary = user != null && libraryIds.has(item.id);
      const busy = savingId === item.id || removingId === item.id;
      let actionLabel: string | undefined;

      if (savingId === item.id) actionLabel = 'Adding…';
      else if (removingId === item.id) actionLabel = 'Removing…';

      return (
        <SearchResultRow
          game={item}
          inLibrary={inLibrary}
          busy={busy}
          actionLabel={actionLabel}
          onSave={onSave}
          onRemove={onRemove}
          onOpenDetails={onOpenDetails}
        />
      );
    },
    [user, libraryIds, savingId, removingId, onSave, onRemove, onOpenDetails]
  );

  const showEmpty = !loading && hasActiveFilters(debouncedFilters);
  const showHint = !loading && !hasActiveFilters(debouncedFilters);

  const listEmpty = useMemo(() => {
    if (showEmpty) {
      return <Text style={listScreenStyles.empty}>No games matched these filters.</Text>;
    }

    if (showHint) {
      return (
        <Text style={listScreenStyles.empty}>
          Enter a title and/or choose platforms and genres to search RAWG.
        </Text>
      );
    }

    return null;
  }, [showEmpty, showHint, listScreenStyles.empty]);

  const listFooter = useMemo(
    () => (
      <LoadMoreFooter
        visible={Boolean(nextPageUrl && !loading && results.length)}
        loading={loadingMore}
        onPress={() => void onLoadMore()}
      />
    ),
    [nextPageUrl, loading, results.length, loadingMore, onLoadMore]
  );

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

      {error ? <Text style={listScreenStyles.error}>{error}</Text> : null}

      {filterDescription && !error ? (
        <Text style={listScreenStyles.filterNote}>{filterDescription}</Text>
      ) : null}

      {loading ? (
        <ActivityIndicator style={listScreenStyles.loader} color={colors.primary} />
      ) : null}

      <FlatList
        {...GAME_LIST_FLATLIST_PROPS}
        data={results}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={listScreenStyles.listContent}
        ListEmptyComponent={listEmpty}
        ListFooterComponent={listFooter}
      />

      <GameDetailsModal
        visible={selectedGame !== null}
        game={selectedDetailsContent}
        loading={detailsLoading}
        onClose={closeDetails}
      />
    </Screen>
  );
}