import colors from '@/assets/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function CompleteProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const userEmail = params.email as string;

  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [msg, setMsg] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);

  // ✅ Polling to check email verification
  useEffect(() => {
    let interval: number;

    const checkEmailVerified = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setMsg('Error fetching user session.');
        return;
      }

      if (data.session) {
        const user = data.session.user;
        if (user.email_confirmed_at) {
          setEmailVerified(true);
          setMsg('Email verified! You can now complete your profile.');
          clearInterval(interval);
        }
      }
    };

    interval = setInterval(checkEmailVerified, 5000); // every 5 seconds
    checkEmailVerified(); // initial check

    return () => clearInterval(interval); // cleanup
  }, []);

  // ✅ Navigate to dashboard after profile update
  useEffect(() => {
    if (profileUpdated) {
      router.push('/dashboard');
    }
  }, [profileUpdated]);

  const handleCompleteProfile = async () => {
    setMsg('');

    if (!emailVerified) {
      setMsg('Please verify your email first.');
      return;
    }

    if (!fullName.trim() || !street.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      setMsg('Please fill out all fields.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
      })
      .eq('id', userId);

    if (error) {
      setMsg(error.message);
    } else {
      setProfileUpdated(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.viewName}>Complete Your Profile</Text>

        {!emailVerified && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: colors.error, marginBottom: 10 }}>
              Check your inbox and verify your email before completing your profile.
            </Text>
          </View>
        )}

        <Text>Full Name</Text>
        <TextInput value={fullName} onChangeText={setFullName} style={styles.input} editable={emailVerified} />

        <Text>Street Address</Text>
        <TextInput value={street} onChangeText={setStreet} style={styles.input} editable={emailVerified} />

        <Text>City</Text>
        <TextInput value={city} onChangeText={setCity} style={styles.input} editable={emailVerified} />

        <Text>State</Text>
        <TextInput value={state} onChangeText={setState} style={styles.input} editable={emailVerified} />

        <Text>Zip Code</Text>
        <TextInput value={zip} onChangeText={setZip} style={styles.input} editable={emailVerified} keyboardType="numeric" />

        <TouchableOpacity
          style={[styles.buttonPrimary, { opacity: emailVerified ? 1 : 0.5 }]}
          onPress={handleCompleteProfile}
          disabled={!emailVerified}
        >
          <Text style={styles.buttonText}>Complete Profile</Text>
        </TouchableOpacity>

        {msg ? <Text style={{ color: colors.error, marginTop: 10 }}>{msg}</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  viewName: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10, height: 44 },
  buttonPrimary: { backgroundColor: colors.buttonPrimary, paddingVertical: 12, paddingHorizontal: 30, borderRadius: 7, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '400', fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' },
});