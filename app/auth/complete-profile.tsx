import { useTheme } from '@/components/ThemeContext';
import { Picker } from '@react-native-picker/picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

const US_STATES = [
  { label: 'Alabama', value: 'AL' },
  { label: 'Alaska', value: 'AK' },
  { label: 'Arizona', value: 'AZ' },
  { label: 'Arkansas', value: 'AR' },
  { label: 'California', value: 'CA' },
  { label: 'Colorado', value: 'CO' },
  { label: 'Connecticut', value: 'CT' },
  { label: 'Delaware', value: 'DE' },
  { label: 'Florida', value: 'FL' },
  { label: 'Georgia', value: 'GA' },
  { label: 'Hawaii', value: 'HI' },
  { label: 'Idaho', value: 'ID' },
  { label: 'Illinois', value: 'IL' },
  { label: 'Indiana', value: 'IN' },
  { label: 'Iowa', value: 'IA' },
  { label: 'Kansas', value: 'KS' },
  { label: 'Kentucky', value: 'KY' },
  { label: 'Louisiana', value: 'LA' },
  { label: 'Maine', value: 'ME' },
  { label: 'Maryland', value: 'MD' },
  { label: 'Massachusetts', value: 'MA' },
  { label: 'Michigan', value: 'MI' },
  { label: 'Minnesota', value: 'MN' },
  { label: 'Mississippi', value: 'MS' },
  { label: 'Missouri', value: 'MO' },
  { label: 'Montana', value: 'MT' },
  { label: 'Nebraska', value: 'NE' },
  { label: 'Nevada', value: 'NV' },
  { label: 'New Hampshire', value: 'NH' },
  { label: 'New Jersey', value: 'NJ' },
  { label: 'New Mexico', value: 'NM' },
  { label: 'New York', value: 'NY' },
  { label: 'North Carolina', value: 'NC' },
  { label: 'North Dakota', value: 'ND' },
  { label: 'Ohio', value: 'OH' },
  { label: 'Oklahoma', value: 'OK' },
  { label: 'Oregon', value: 'OR' },
  { label: 'Pennsylvania', value: 'PA' },
  { label: 'Rhode Island', value: 'RI' },
  { label: 'South Carolina', value: 'SC' },
  { label: 'South Dakota', value: 'SD' },
  { label: 'Tennessee', value: 'TN' },
  { label: 'Texas', value: 'TX' },
  { label: 'Utah', value: 'UT' },
  { label: 'Vermont', value: 'VT' },
  { label: 'Virginia', value: 'VA' },
  { label: 'Washington', value: 'WA' },
  { label: 'West Virginia', value: 'WV' },
  { label: 'Wisconsin', value: 'WI' },
  { label: 'Wyoming', value: 'WY' },
];


export default function CompleteProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const { theme } = useTheme();

  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState('');
  const [profileUpdated, setProfileUpdated] = useState(false);

  // ✅ Navigate to dashboard after profile update
  useEffect(() => {
    if (profileUpdated) {
      router.push('/dashboard');
    }
  }, [profileUpdated]);

  const handleCompleteProfile = async () => {
    setMsg('');

    if (!fullName.trim() || !phone.trim() || !street.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      setMsg('Please fill out all fields.');
      return;
    }

    // Get the current user ID
    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user?.id;
    if (!userId) {
      setMsg('User not found. Please log in again.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
      })
      .eq('id', userId); // now this is a valid UUID

    if (error) {
      setMsg(error.message);
    } else {
      setProfileUpdated(true);
    }
  };


  return (
    <LinearGradient
      colors={[theme.primary, theme.secondary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <View style={{ paddingVertical: 24, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[styles.viewName, { color: theme.white }]}>
              Complete Your Profile
            </Text>
          </View>

          <View style={[styles.container, { backgroundColor: theme.appBackground, rowGap: 4 }]}>

            <Text style={styles.introText}>Welcome! 🎉 Let’s finish your profile so you can start getting things done around your home.</Text>

            <Text style={styles.label}>Full Name</Text>
            <TextInput value={fullName} onChangeText={setFullName} style={styles.input} placeholder='Your Full Name' placeholderTextColor={theme.muted} />

            <Text style={styles.label}>Phone Number</Text>
            <TextInput value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" placeholder='Your 10 digit phone number' placeholderTextColor={theme.muted} />

            <Text style={styles.label}>Street Address</Text>
            <TextInput value={street} onChangeText={setStreet} style={styles.input} placeholder='Your Address' placeholderTextColor={theme.muted}/>

            <Text style={styles.label}>City</Text>
            <TextInput value={city} onChangeText={setCity} style={styles.input} placeholder='Your City' placeholderTextColor={theme.muted}/>

            <Text style={styles.label}>State</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={state}
                onValueChange={(itemValue) => setState(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select your state..." value="" />
                {US_STATES.map((s) => (
                  <Picker.Item key={s.value} label={s.label} value={s.value} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Zip Code</Text>
            <TextInput value={zip} onChangeText={setZip} style={styles.input} keyboardType="numeric" placeholder='Your 5 digit zipcode' placeholderTextColor={theme.muted}/>

            <TouchableOpacity style={[styles.buttonPrimary, { backgroundColor: theme.primary }]} onPress={handleCompleteProfile}>
              <Text style={styles.buttonText}>Complete Profile</Text>
            </TouchableOpacity>

            {msg ? (
              <Text style={{ color: theme.secondary, marginTop: 10, textAlign: 'center', fontWeight: 'bold' }}>
                {msg}
              </Text>
            ) : null}

          </View>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'flex-start', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  viewName: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, },
  introText: { marginVertical: 24, fontSize: 16, fontWeight: '500', lineHeight:24 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10, height: 44, },
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 10, overflow: 'hidden' },
  buttonPrimary: { paddingVertical: 12, borderRadius: 7, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600', },
  label: { fontSize: 14, fontWeight: '600' },
  picker: {
    height: 44
  }
});
