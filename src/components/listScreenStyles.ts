import { StyleSheet } from 'react-native';

import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

/** Shared list / empty / error styles for Search and Library screens. */
export const listScreenStyles = StyleSheet.create({
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
