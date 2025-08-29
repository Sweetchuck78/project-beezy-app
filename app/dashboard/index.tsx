import colors from '@/assets/colors';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function DashboardScreen() {

  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) return;

      const { data, error } = await supabase
        .from('profiles') // adjust if your table name is different
        .select('full_name')
        .eq('id', user.id)
        .single();

      if (!error && data?.full_name) {
        const first = data.full_name.split(' ')[0];
        setFirstName(first);
      }
    };

    fetchUserProfile();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView style={styles.parentContainer}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100, gap: 24 }}>
        <View>
          <Text style={styles.viewName}>Hi, {firstName}</Text>

          <View style={styles.tile}>
            <Text>Welcome to your dashboard!</Text>
          </View>

          {/* <Button title="Sign Out" onPress={handleSignOut} /> */}
        </View>
      </ScrollView>

      {/* Floating Plus Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => { /* navigate */ }}>
        <Image source={require('@/assets/images/icons/plus.png')} style={styles.plus} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "flex-start",
    padding: 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30, // distance from bottom
    right: 30,  // distance from right
    width: 80,
    height: 80,
    borderRadius: 40, // makes it circular
    backgroundColor: colors.buttonPrimary, // blue, change as needed
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8, // Android shadow
  },
  plus: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
    width: 32,
    height: 32,
  },
  viewName: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  tile: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 20,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
  }
});
