import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@/src/theme/ThemeContext';
import type { ThemeColors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

function createListScreenStyles(colors: ThemeColors) {
  return StyleSheet.create({
    error: {
      color: colors.danger,
      marginHorizontal: spacing.md,
      marginBottom: spacing.sm,
      fontSize: 14,
    },
    filterNote: {
      fontSize: 13,
      color: colors.textSecondary,
      marginHorizontal: spacing.md,
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
      lineHeight: 22,
      paddingHorizontal: spacing.md,
    },
  });
}

/** Shared list / empty / error styles for Search and Library screens. */
export function useListScreenStyles() {
  const { colors } = useTheme();
  return useMemo(() => createListScreenStyles(colors), [colors]);
}
