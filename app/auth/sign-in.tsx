import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../assets/colors';
import { supabase } from '../../lib/supabase';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setMsg(error.message);
    } else {
      // ✅ if login succeeds, send them to dashboard
      router.replace('/dashboard');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.viewName}>Sign In</Text>
        <Text>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} />
        <Text>Password</Text>
        <TextInput value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <Text>{msg}</Text>
      </View>
      {/* ✅ Expo Router navigation */}
      <View style={styles.bottomContent}>
              <Text style={styles.bottomText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/auth/sign-up')}>
                <Text style={[styles.bottomTextLink, { color: colors.secondary, marginLeft: 5 }]}>Sign Up</Text>
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
    fontSize: 16,
    fontWeight: '700',         // '400' is equivalent to normal
    fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
  },
  bottomText: {
    fontSize: 15,
    fontWeight: '400',
  },
  bottomTextLink: {fontWeight: 'bold', fontSize: 15 }
});