import colors from '@/assets/colors';
import { Picker } from '@react-native-picker/picker';
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.viewName}>Complete Your Profile</Text>

        <Text style={styles.introText}>Welcome! 🎉 Let’s finish your profile so you can start getting things done around your home.</Text>

        <Text>Full Name</Text>
        <TextInput value={fullName} onChangeText={setFullName} style={styles.input} />

        <Text>Phone Number</Text>
        <TextInput value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />

        <Text>Street Address</Text>
        <TextInput value={street} onChangeText={setStreet} style={styles.input} />

        <Text>City</Text>
        <TextInput value={city} onChangeText={setCity} style={styles.input} />

        <Text>State</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={state}
            onValueChange={(itemValue) => setState(itemValue)}
          >
            <Picker.Item label="Select a state..." value="" />
            {US_STATES.map((s) => (
              <Picker.Item key={s.value} label={s.label} value={s.value} />
            ))}
          </Picker>
        </View>

        <Text>Zip Code</Text>
        <TextInput value={zip} onChangeText={setZip} style={styles.input} keyboardType="numeric" />

        <TouchableOpacity style={styles.buttonPrimary} onPress={handleCompleteProfile}>
          <Text style={styles.buttonText}>Complete Profile</Text>
        </TouchableOpacity>

        {msg ? (
          <Text style={{ color: colors.secondary, marginTop: 10, textAlign: 'center', fontWeight: 'bold' }}>
            {msg}
          </Text>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background, fontFamily: 'InterVariable' },
  viewName: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, fontFamily: 'InterVariable' },
  introText: {marginBottom: 32, fontFamily: 'InterVariable', fontSize: 16, fontWeight: '500'},
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginBottom: 10, height: 44, fontFamily: 'InterVariable' },
  pickerWrapper: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 10, overflow: 'hidden' },
  buttonPrimary: { backgroundColor: colors.buttonPrimary, paddingVertical: 12, borderRadius: 7, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '400', fontFamily: 'InterVariable'},
});
