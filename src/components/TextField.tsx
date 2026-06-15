import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeContext';
import type { ThemeColors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

type Props = TextInputProps & {
  /** Optional bottom margin tweak for stacked fields */
  last?: boolean;
  /** When set, shows a clear control while `value` is non-empty. */
  onClear?: () => void;
};

/**
 * Single-line input styled to match the rest of the UI.
 */
export function TextField({ style, last, value, onClear, ...rest }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const showClear =
    typeof onClear === 'function' && typeof value === 'string' && value.length > 0;

  return (
    <View style={[styles.wrap, !last && styles.margin]}>
      <View style={styles.inputRow}>
        <TextInput
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, showClear && styles.inputWithClear, style]}
          value={value}
          {...rest}
        />
        {showClear ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear search text"
            hitSlop={8}
            onPress={onClear}
            style={({ pressed }) => [styles.clearButton, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.clearGlyph}>×</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    wrap: { width: '100%' },
    margin: { marginBottom: spacing.md },
    inputRow: {
      position: 'relative',
      width: '100%',
    },
    input: {
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + spacing.xxs,
      fontSize: 16,
      color: colors.textPrimary,
      backgroundColor: colors.surface,
    },
    inputWithClear: {
      paddingRight: spacing.xl + spacing.sm,
    },
    clearButton: {
      position: 'absolute',
      right: spacing.sm,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
      paddingHorizontal: spacing.xs,
    },
    clearGlyph: {
      fontSize: 22,
      lineHeight: 24,
      color: colors.textSecondary,
      fontWeight: '600',
    },
  });
}
