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
    modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  meta: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  linkText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
    textAlign: 'right',
  },
  modalImage: {
  width: '100%',
  height: 220,
  borderRadius: 12,
  marginBottom: spacing.md,
  },
  modalImage: {
  width: '100%',
  height: 220,
  borderRadius: 12,
  marginBottom: spacing.md,
  },
  modalSectionTitle: {
  fontSize: 15,
  fontWeight: '700',
  color: colors.textPrimary,
  marginTop: spacing.md,
  marginBottom: spacing.xs,
},
modalDescription: {
  fontSize: 14,
  color: colors.textSecondary,
  lineHeight: 21,
},
modalCloseButton: {
  marginTop: spacing.lg,
  alignSelf: 'flex-end',
},
modalCloseText: {
  fontSize: 15,
  fontWeight: '700',
  color: colors.primary,
},
});
