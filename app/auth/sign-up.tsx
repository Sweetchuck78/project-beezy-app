import { useTheme } from '@/components/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const { theme } = useTheme();

  const handleSignUp = async () => {
    setMsg('');

    if (!email.trim() || !password.trim()) {
      setMsg('Please enter both email and password.');
      return;
    }

    // 1️⃣ Sign up user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setMsg(signUpError.message);
      return;
    }

    const user = signUpData.user;
    if (!user) {
      setMsg('Unable to get user after sign up.');
      return;
    }

    // ✅ Inform the user to verify their email
    //setMsg('Check your inbox and verify your email before completing your profile.');

    // 2️⃣ Navigate to Complete Profile screen anyway (optional)
    router.push({
      pathname: '/auth/verify-email',
      params: { userId: user.id, email },
    });
  };

return (
  <LinearGradient
    colors={[theme.primary, theme.secondary]}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={{ flex: 1 }}
  >
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <View style={{ paddingVertical: 24, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={[styles.viewName, { color: theme.white }]}>
          Create Account
        </Text>
      </View>

      <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
        <Text style={[styles.introText, { color: theme.text }]}>
          Creating an account is simple and quick. Let's start with just your email.
        </Text>

        <Text style={{ color: theme.text }}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { color: theme.text }]}
          keyboardType="email-address"
        />

        <Text style={{ color: theme.text }}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[styles.input, { color: theme.text }]}
        />

        <TouchableOpacity
          style={[styles.buttonPrimary, { backgroundColor: theme.primary }]}
          onPress={handleSignUp}
        >
          <Text style={[styles.buttonText, { color: theme.white}]}>
            Sign Up
          </Text>
        </TouchableOpacity>

        <Text style={{ color: theme.error, marginTop: 10 }}>{msg}</Text>

        <View style={styles.bottomContent}>
          <Text style={[styles.bottomText, { color: theme.text }]}>
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => router.push("/auth/sign-in")}>
            <Text
              style={[
                styles.bottomTextLink,
                { color: theme.primary, marginLeft: 5 },
              ]}
            >
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  </LinearGradient>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'flex-start', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  viewName: { fontSize: 32, marginBottom: 20, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10, borderRadius: 6, marginTop: 10, height: 44 },
  bottomContent: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 2, flex: 1, paddingBottom: 88 },
  buttonPrimary: {
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  buttonText: { fontSize: 16, fontWeight: '600', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' },
  bottomText: { fontSize: 15, fontWeight: '400' },
  bottomTextLink: { fontWeight: 'bold', fontSize: 15 },
  introText: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "left",
    lineHeight: 24,
  },

});
