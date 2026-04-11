import { router } from 'expo-router';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/src/auth/AuthContext';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

/**
 * Minimal profile view: shows the local account email and signs out.
 */
export default function AccountScreen() {
  const { user, signOut } = useAuth();

  const confirmSignOut = () => {
    Alert.alert('Sign out?', 'Your library stays on this device for next time you sign in.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <Screen>
      <Text style={styles.label}>Signed in as</Text>
      <Text style={styles.email}>{user?.email ?? '—'}</Text>

      <Text style={styles.note}>
        This is a demo: there is no cloud backend. Data lives in SQLite and AsyncStorage on this
        device only.
      </Text>

      <View style={styles.actions}>
        <PrimaryButton label="Sign out" variant="danger" onPress={confirmSignOut} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  email: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  note: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  actions: {
    marginTop: spacing.md,
  },
});
