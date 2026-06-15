import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '@/src/theme/ThemeContext';
import { spacing } from '@/src/theme/spacing';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'danger' | 'secondary';
  icon?: ReactNode;
};

/**
 * Primary action control aligned with app colors (used across hub + forms).
 */
export function PrimaryButton({
  label,
  onPress,
  disabled,
  loading,
  variant = 'primary',
  icon,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(), []);

  const bg =
    variant === 'danger'
      ? colors.danger
      : variant === 'secondary'
        ? colors.surfaceMuted
        : colors.primary;
  const fg = variant === 'secondary' ? colors.textPrimary : colors.textOnPrimary;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        { backgroundColor: bg, opacity: pressed ? 0.88 : 1 },
        (disabled || loading) && styles.disabled,
      ]}
    >
      <View style={styles.row}>
        {loading ? (
          <ActivityIndicator color={fg} />
        ) : (
          <>
            {icon}
            <Text style={[styles.label, { color: fg }]}>{label}</Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

function createStyles() {
  return StyleSheet.create({
    base: {
      paddingVertical: spacing.sm + spacing.xxs,
      paddingHorizontal: spacing.lg,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 48,
    },
    disabled: { opacity: 0.5 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    label: {
      fontSize: 16,
      fontWeight: '600',
    },
  });
}
