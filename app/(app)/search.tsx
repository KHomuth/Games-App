import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  RawgConfigError,
  RawgHttpError,
  searchGames,
  type RawgGame,
  type SearchMode,
} from '@/src/api/rawg';
import { getAllGenres, getAllPlatforms } from '@/src/api/rawg/metadata';
import { useAuth } from '@/src/auth/AuthContext';
import { GameResultCard } from '@/src/components/GameResultCard';
import { Screen } from '@/src/components/Screen';
import { TextField } from '@/src/components/TextField';
import { addGameToLibrary } from '@/src/db/libraryGames';
import { useDebouncedValue } from '@/src/hooks/useDebouncedValue';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

/**
 * Debounced RAWG search with abortable requests; saves require a signed-in user.
 */
export default function SearchScreen() {
  const { user } = useAuth();
  const [mode, setMode] = useState<SearchMode>('gameName');
  const [term, setTerm] = useState('');
  const debouncedTerm = useDebouncedValue(term, 450);
  const [results, setResults] = useState<RawgGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [filterDescription, setFilterDescription] = useState<string | null>(null);
  const [filterUnmatched, setFilterUnmatched] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Warm RAWG platform/genre catalogs so the first platform search is not blocked on pagination.
  useEffect(() => {
    const ac = new AbortController();
    void Promise.all([getAllPlatforms(ac.signal), getAllGenres(ac.signal)]).catch(() => {});
    return () => ac.abort();
  }, []);

  const runSearch = useCallback(async () => {
    abortRef.current?.abort();
    const trimmed = debouncedTerm.trim();
    if (!trimmed) {
      setResults([]);
      setError(null);
      setFilterDescription(null);
      setFilterUnmatched(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError(null);

    try {
      const data = await searchGames({ mode, term: trimmed }, { signal: controller.signal });
      setResults(data.games);
      setFilterDescription(data.filterDescription ?? null);
      setFilterUnmatched(data.filterUnmatched ?? false);
    } catch (e: unknown) {
      if (e instanceof Error && e.name === 'AbortError') {
        return;
      }
      if (e instanceof RawgConfigError) {
        setError(e.message);
        setResults([]);
        setFilterDescription(null);
        setFilterUnmatched(false);
      } else if (e instanceof RawgHttpError) {
        setError('Could not reach RAWG. Check your network or API key.');
        setResults([]);
        setFilterDescription(null);
        setFilterUnmatched(false);
      } else {
        setError('Something went wrong while searching.');
        setResults([]);
        setFilterDescription(null);
        setFilterUnmatched(false);
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedTerm, mode]);

  useEffect(() => {
    void runSearch();
    return () => {
      abortRef.current?.abort();
    };
  }, [runSearch]);

  const changeMode = (next: SearchMode) => {
    setMode(next);
    setTerm('');
    setResults([]);
    setError(null);
    setFilterDescription(null);
    setFilterUnmatched(false);
  };

  const onSave = async (game: RawgGame) => {
    if (!user) {
      Alert.alert('Sign in required', 'Create an account or sign in to save games to your library.');
      return;
    }
    setSavingId(game.id);
    try {
      const outcome = await addGameToLibrary(user.id, game);
      if (outcome.ok) {
        Alert.alert('Saved', `${game.name} is in your library.`);
      } else if (outcome.code === 'ALREADY_SAVED') {
        Alert.alert('Already saved', 'This game is already in your library.');
      }
    } finally {
      setSavingId(null);
    }
  };

  const emptyHint =
    mode === 'platform'
      ? 'Type a platform name (matches RAWG’s catalog: PC, PlayStation 5, Xbox Series S, iOS, …).'
      : mode === 'genre'
        ? 'Type a genre (Action, RPG, Shooter, …). Names come from RAWG’s genre list.'
        : 'Type a game title to search.';

  return (
    <Screen safe={false}>
      <View style={styles.pad}>
        <View style={styles.modeRow}>
          <ModeChip label="Title" active={mode === 'gameName'} onPress={() => changeMode('gameName')} />
          <ModeChip label="Platform" active={mode === 'platform'} onPress={() => changeMode('platform')} />
          <ModeChip label="Genre" active={mode === 'genre'} onPress={() => changeMode('genre')} />
        </View>

        <TextField
          last
          placeholder={
            mode === 'gameName' ? 'Game name…' : mode === 'platform' ? 'Platform…' : 'Genre…'
          }
          value={term}
          onChangeText={setTerm}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {filterDescription && !error ? (
          <Text style={styles.filterNote}>{filterDescription}</Text>
        ) : null}
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color={colors.primary} />
      ) : null}

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !loading && debouncedTerm.trim() ? (
            <Text style={styles.empty}>
              {filterUnmatched
                ? mode === 'platform'
                  ? `No platform matched “${debouncedTerm.trim()}”. Try another spelling or a name from RAWG (e.g. PC, Nintendo Switch).`
                  : `No genre matched “${debouncedTerm.trim()}”. Try another spelling (e.g. Action, Indie).`
                : mode === 'gameName'
                  ? 'No games found for that title.'
                  : 'No games matched this filter.'}
            </Text>
          ) : !loading && !debouncedTerm.trim() ? (
            <Text style={styles.empty}>{emptyHint}</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <GameResultCard
            game={item}
            onAdd={() => void onSave(item)}
            addDisabled={savingId === item.id}
            addLabel={savingId === item.id ? 'Saving…' : 'Save'}
          />
        )}
      />
    </Screen>
  );
}

function ModeChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pad: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  modeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chipLabelActive: {
    color: '#fff',
  },
  error: {
    color: colors.danger,
    marginBottom: spacing.sm,
    fontSize: 14,
  },
  filterNote: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  loader: {
    marginVertical: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },
  empty: {
    textAlign: 'center',
    color: colors.textSecondary,
    marginTop: spacing.lg,
    fontSize: 15,
  },
});
