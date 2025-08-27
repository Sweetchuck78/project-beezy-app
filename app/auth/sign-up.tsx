import colors from '@/assets/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function SignUpScreen() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSignUp = async () => {
    setMsg(''); // clear previous message

    // 1️ Sign up user
    const { data: userData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setMsg(signUpError.message);
      return;
    }

    // 2️ Insert profile data
    const { error: profileError } = await supabase.from('profiles').insert([
      {
        id: userData.user.id, // link profile to auth user
        first_name: firstName,
        last_name: lastName,
        email,
      },
    ]);

    if (profileError) {
      setMsg(profileError.message);
    } else {
      setMsg('Check your email for confirmation!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.viewName}>Sign Up</Text>

        <Text>First Name</Text>
        <TextInput value={firstName} onChangeText={setFirstName} style={styles.input} />

        <Text>Last Name</Text>
        <TextInput value={lastName} onChangeText={setLastName} style={styles.input} />

        <Text>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} />

        <Text>Password</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={{ color: colors.error, marginTop: 10 }}>{msg}</Text>
      </View>

      {/* ✅ Bottom navigation */}
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
  container: { flex: 1, padding: 20, justifyContent: 'space-between' },
  viewName: { fontSize: 32, marginBottom: 20, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', marginBottom: 10, padding: 10, borderRadius: 6, marginTop: 10, height: 44 },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // centers horizontally
    gap: 5, // spacing between text and button (requires React Native 0.71+)
  },
  bottomText: {
    fontSize: 16,
    fontWeight: '700',
  },
  buttonPrimary: {
    backgroundColor: colors.buttonPrimary,
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingStart: 30,
    paddingEnd: 30,
    paddingTop: 11,
    paddingBottom: 11,
    fontWeight: 'bold'
  },
  buttonText: {
    color: '#fff',               // text color
    fontSize: 14,
    fontWeight: '400',         // '400' is equivalent to normal
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  bottomTextLink: {fontWeight: '700', fontSize: 14 }
});
