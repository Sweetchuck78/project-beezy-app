import colors from '@/assets/colors';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';

export default function DashboardScreen() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView style={styles.parentContainer}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View>
          <Text>Welcome to your Dashboard!</Text>
          {/* <Button title="Sign Out" onPress={handleSignOut} /> */}
        </View>
      </ScrollView>

      {/* Floating Plus Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => { /* navigate */ }}>
        <Text style={styles.plus}>+</Text>
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
  },
});
