import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/src/auth/AuthContext';
import { PrimaryButton } from '@/src/components/PrimaryButton';
import { Screen } from '@/src/components/Screen';
import { TextField } from '@/src/components/TextField';
import { colors } from '@/src/theme/colors';
import { spacing } from '@/src/theme/spacing';

/**
 * Email + password form backed by SQLite (sign in or create account).
 */
export default function LoginScreen() {
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace('/library');
    }
  }, [user]);

  const submit = async () => {
    setBusy(true);
    try {
      const result = mode === 'signin' ? await signIn(email, password) : await signUp(email, password);
      if (result.ok) {
        router.replace('/library');
      } else {
        Alert.alert('Could not continue', result.message);
      }
    } finally {
      setBusy(false);
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
  };

  return (
    <Screen>
      <Text style={styles.heading}>{mode === 'signin' ? 'Sign in' : 'Create account'}</Text>
      <Text style={styles.hint}>
        Passwords are hashed on-device (SHA-256 + salt). Nothing is sent to a custom backend.
      </Text>

      <TextField
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextField
        last
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <PrimaryButton
        label={mode === 'signin' ? 'Sign in' : 'Register'}
        onPress={() => void submit()}
        loading={busy}
      />

      <View style={styles.switchBlock}>
        <PrimaryButton
          variant="secondary"
          label={
            mode === 'signin' ? 'Need an account? Register' : 'Already registered? Sign in'
          }
          onPress={toggleMode}
          disabled={busy}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  switchBlock: {
    marginTop: spacing.md,
  },
});
