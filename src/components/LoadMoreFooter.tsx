import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { useTheme } from '@/src/theme/ThemeContext';
import type { ThemeColors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

type Props = {
  visible: boolean;
  loading: boolean;
  onPress: () => void;
};

export function LoadMoreFooter({ visible, loading, onPress }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  if (!visible) return null;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={loading}
      style={[styles.button, loading && styles.buttonDisabled]}
    >
      {loading ? (
        <ActivityIndicator color={colors.textOnPrimary} />
      ) : (
        <Text style={styles.label}>Load more</Text>
      )}
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    button: {
      marginTop: spacing.md,
      marginBottom: spacing.xl,
      alignSelf: 'center',
      backgroundColor: colors.primary,
      borderRadius: 10,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.lg,
      minWidth: 140,
      alignItems: 'center',
    },
    buttonDisabled: {
      opacity: 0.7,
    },
    label: {
      color: colors.textOnPrimary,
      fontWeight: '700',
      fontSize: 14,
    },
  });
}
