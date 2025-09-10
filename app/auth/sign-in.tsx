import { useTheme } from '@/components/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const { theme } = useTheme();

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
    <LinearGradient
      colors={[theme.primary, theme.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <View style={{ paddingVertical: 24, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.viewName, { color: theme.white }]}>
            Sign In
          </Text>
        </View>
        <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
          <View>
            <Text style={{ color: theme.text }}>Email</Text>
            <TextInput value={email} onChangeText={setEmail} style={[styles.input, { color: theme.text }]} />
          </View>
          <View>
            <Text style={{ color: theme.text }}>Password</Text>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry style={[styles.input, { color: theme.text }]} />
          </View>
          <TouchableOpacity style={[styles.buttonPrimary, { backgroundColor: theme.primary }]} onPress={handleSignIn}>
            <Text style={[styles.buttonText, { color: theme.buttonText }]}>Sign In</Text>
          </TouchableOpacity>
          <Text style={{ color: theme.error, marginTop: 20 }}>{msg}</Text>

          {/* ✅ Expo Router navigation */}
          <View style={styles.bottomContent}>
            <Text style={[styles.bottomText, { color: theme.text }]}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/sign-up')}>
              <Text style={[styles.bottomTextLink, { color: theme.secondary, marginLeft: 5 }]}>Sign Up</Text>
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
  buttonText: { fontSize: 16, fontWeight: '600'},
  bottomText: { fontSize: 15, fontWeight: '500' },
  bottomTextLink: { fontWeight: 'bold', fontSize: 15 },
  introText: {
    fontSize: 16,
    marginBottom: 32,
    textAlign: "left",
    lineHeight: 24,
  },

});