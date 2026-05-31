import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

import { PrimaryButton } from '@/src/components/PrimaryButton';
import { useTheme } from '@/src/theme/ThemeContext';
import { spacing } from '@/src/theme/spacing';

type Props = {
  /** Extra margin above the control when stacked under other content. */
  topSpacing?: boolean;
};

/**
 * Switches between light and dark palettes; preference is stored in SQLite.
 */
export function ThemeToggle({ topSpacing }: Props) {
  const { mode, toggleMode, colors } = useTheme();

  return (
    <View style={[styles.wrap, topSpacing && styles.topSpacing]}>
      <PrimaryButton
        variant="secondary"
        label={mode === 'dark' ? 'Light mode' : 'Dark mode'}
        icon={
          <Ionicons
            name={mode === 'dark' ? 'sunny-outline' : 'moon-outline'}
            size={22}
            color={colors.textPrimary}
          />
        }
        onPress={toggleMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
  },
  topSpacing: {
    marginTop: spacing.md,
  },
});
