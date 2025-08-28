import colors from '@/assets/colors';
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
  setMsg('Check your inbox and verify your email before completing your profile.');

  // 2️⃣ Navigate to Complete Profile screen anyway (optional)
  router.push({
    pathname: '/auth/verify-email',
    params: { userId: user.id, email },
  });
};

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.viewName}>Sign Up</Text>

        <Text style={styles.introText}>Creating an account is simple and quick. Let's start with just your email.</Text>

        <Text>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />

        <Text>Password</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={{ color: colors.error, marginTop: 10 }}>{msg}</Text>
      </View>

      <View style={styles.bottomContent}>
        <Text style={styles.bottomText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/auth/sign-in')}>
          <Text style={[styles.bottomTextLink, { color: colors.secondary, marginLeft: 5 }]}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'space-between', backgroundColor: colors.background },
  viewName: { fontSize: 32, marginBottom: 20, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10, borderRadius: 6, marginTop: 10, height: 44 },
  bottomContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5 },
  buttonPrimary: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' },
  bottomText: { fontSize: 15, fontWeight: '400' },
  bottomTextLink: { fontWeight: 'bold', fontSize: 15 },
  introText: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "left",
    lineHeight: 24,
  }
});
