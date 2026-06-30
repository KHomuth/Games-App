import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { CatalogOption } from '@/src/db/rawgCatalog';
import { EMPTY_GAME_FILTERS, hasActiveFilters, type GameFilters } from '@/src/filters/types';
import { useTheme } from '@/src/theme/ThemeContext';
import type { ThemeColors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

import { MultiSelectField } from './MultiSelectField';
import { TextField } from './TextField';

type Props = {
  filters: GameFilters;
  onChange: (next: GameFilters) => void;
  platformOptions: CatalogOption[];
  genreOptions: CatalogOption[];
  catalogReady: boolean;
  catalogError: string | null;
};

export function GameFiltersPanel({
  filters,
  onChange,
  platformOptions,
  genreOptions,
  catalogReady,
  catalogError,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const catalogDisabled = !catalogReady || Boolean(catalogError);
  const showClearAll = hasActiveFilters(filters);

  return (
    <View style={styles.wrap}>
      {showClearAll ? (
        <View style={styles.toolbar}>
          <Pressable
            accessibilityRole="button"
            onPress={() => onChange(EMPTY_GAME_FILTERS)}
            style={({ pressed }) => [styles.clearAllButton, pressed && { opacity: 0.75 }]}
          >
            <Text style={styles.clearAllText}>Clear all filters</Text>
          </Pressable>
        </View>
      ) : null}

      <TextField
        placeholder="Game title…"
        value={filters.query}
        onChangeText={(query) => onChange({ ...filters, query })}
        onClear={() => onChange({ ...filters, query: '' })}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {!catalogReady && !catalogError ? (
        <View style={styles.catalogLoading}>
          <ActivityIndicator color={colors.primary} size="small" />
          <Text style={styles.catalogLoadingText}>Loading filters…</Text>
        </View>
      ) : null}

      {catalogError ? <Text style={styles.catalogError}>{catalogError}</Text> : null}

      <MultiSelectField
        label="Platforms"
        placeholder="Any platform"
        options={platformOptions.map((o) => ({ value: o.id, label: o.label }))}
        selected={filters.platformIds}
        onChange={(platformIds) => onChange({ ...filters, platformIds })}
        disabled={catalogDisabled}
      />

      <MultiSelectField
        label="Genres"
        placeholder="Any genre"
        options={genreOptions.map((o) => ({ value: o.slug, label: o.label }))}
        selected={filters.genreSlugs}
        onChange={(genreSlugs) => onChange({ ...filters, genreSlugs })}
        disabled={catalogDisabled}
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.sm,
    },
    toolbar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: spacing.sm,
    },
    clearAllButton: {
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
    },
    clearAllText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    catalogLoading: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.sm,
    },
    catalogLoadingText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    catalogError: {
      color: colors.danger,
      fontSize: 14,
      marginBottom: spacing.sm,
    },
  });
}
