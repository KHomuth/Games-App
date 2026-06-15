import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useTheme } from '@/src/theme/ThemeContext';
import type { ThemeColors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

export type MultiSelectOption<T extends string | number> = {
  value: T;
  label: string;
};

type Props<T extends string | number> = {
  label: string;
  placeholder: string;
  options: MultiSelectOption<T>[];
  selected: T[];
  onChange: (next: T[]) => void;
  disabled?: boolean;
};

export function MultiSelectField<T extends string | number>({
  label,
  placeholder,
  options,
  selected,
  onChange,
  disabled,
}: Props<T>) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [open, setOpen] = useState(false);

  const selectedLabels = options
    .filter((o) => selected.includes(o.value))
    .map((o) => o.label);

  const summary =
    selectedLabels.length === 0
      ? placeholder
      : selectedLabels.length <= 2
        ? selectedLabels.join(', ')
        : `${selectedLabels.length} selected`;

  const toggle = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const canClear = selected.length > 0 && !disabled;

  return (
    <>
      <View style={[styles.trigger, disabled && styles.triggerDisabled]}>
        <Pressable
          accessibilityRole="button"
          disabled={disabled}
          onPress={() => setOpen(true)}
          style={({ pressed }) => [styles.triggerMain, pressed && !disabled && { opacity: 0.85 }]}
        >
          <Text style={styles.label}>{label}</Text>
          <Text
            style={[styles.value, selectedLabels.length === 0 && styles.placeholder]}
            numberOfLines={1}
          >
            {summary}
          </Text>
        </Pressable>
        {canClear ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Clear ${label}`}
            hitSlop={8}
            onPress={() => onChange([])}
            style={({ pressed }) => [styles.triggerClear, pressed && { opacity: 0.6 }]}
          >
            <Text style={styles.clearGlyph}>×</Text>
          </Pressable>
        ) : null}
      </View>

      <Modal visible={open} animationType="slide" transparent onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label}</Text>
              <Pressable onPress={() => setOpen(false)} accessibilityRole="button">
                <Text style={styles.done}>Done</Text>
              </Pressable>
            </View>

            {selected.length ? (
              <Pressable
                accessibilityRole="button"
                onPress={() => onChange([])}
                style={styles.clearRow}
              >
                <Text style={styles.clearText}>Clear selection</Text>
              </Pressable>
            ) : null}

            <FlatList
              data={options}
              keyExtractor={(item) => String(item.value)}
              style={styles.list}
              renderItem={({ item }) => {
                const active = selected.includes(item.value);
                return (
                  <Pressable
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: active }}
                    onPress={() => toggle(item.value)}
                    style={[styles.option, active && styles.optionActive]}
                  >
                    <Text style={[styles.optionLabel, active && styles.optionLabelActive]}>
                      {item.label}
                    </Text>
                    {active ? <Text style={styles.check}>✓</Text> : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    trigger: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 10,
      backgroundColor: colors.surface,
      marginBottom: spacing.sm,
    },
    triggerMain: {
      flex: 1,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + spacing.xxs,
    },
    triggerClear: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + spacing.xxs,
      justifyContent: 'center',
    },
    clearGlyph: {
      fontSize: 22,
      lineHeight: 24,
      color: colors.textSecondary,
      fontWeight: '600',
    },
    triggerDisabled: {
      opacity: 0.6,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: spacing.xxs,
    },
    value: {
      fontSize: 16,
      color: colors.textPrimary,
    },
    placeholder: {
      color: colors.textSecondary,
    },
    backdrop: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'flex-end',
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: spacing.md,
      borderTopRightRadius: spacing.md,
      maxHeight: '70%',
      paddingBottom: spacing.lg,
    },
    sheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sheetTitle: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.textPrimary,
    },
    done: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.primary,
    },
    clearRow: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    clearText: {
      color: colors.danger,
      fontSize: 14,
      fontWeight: '600',
    },
    list: {
      paddingHorizontal: spacing.md,
    },
    option: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm + spacing.xxs,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    optionActive: {
      backgroundColor: colors.surfaceMuted,
      marginHorizontal: -spacing.md,
      paddingHorizontal: spacing.md,
    },
    optionLabel: {
      fontSize: 16,
      color: colors.textPrimary,
      flex: 1,
    },
    optionLabelActive: {
      fontWeight: '600',
      color: colors.primary,
    },
    check: {
      fontSize: 18,
      color: colors.primary,
      fontWeight: '700',
    },
  });
}
