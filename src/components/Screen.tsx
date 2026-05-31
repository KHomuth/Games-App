import type { ReactNode } from 'react';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/src/theme/ThemeContext';
import type { ThemeColors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

type Props = {
  children: ReactNode;
  /** When false, skips safe-area padding (e.g. full-bleed lists). */
  safe?: boolean;
};

/**
 * Standard page shell with background and horizontal padding.
 */
export function Screen({ children, safe = true }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const content = <View style={styles.inner}>{children}</View>;

  if (safe) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        {content}
      </SafeAreaView>
    );
  }

  return <View style={styles.safe}>{content}</View>;
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: colors.background,
    },
    inner: {
      flex: 1,
      paddingHorizontal: spacing.md,
    },
  });
}
