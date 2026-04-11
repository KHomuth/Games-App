import { StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

type Props = TextInputProps & {
  /** Optional bottom margin tweak for stacked fields */
  last?: boolean;
};

/**
 * Single-line input styled to match the rest of the UI.
 */
export function TextField({ style, last, ...rest }: Props) {
  return (
    <View style={[styles.wrap, !last && styles.margin]}>
      <TextInput
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  margin: { marginBottom: spacing.md },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
});
