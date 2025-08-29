import colors from "@/assets/colors";
import BotChatBubble from "@/components/ui/BotChatBubble";
import { Colors } from "@/constants/Colors";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function CreateJobScreen() {
  const colorScheme = useColorScheme() || 'light'; 
  const theme = Colors[colorScheme];

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error.message);
      }
      setUser(session?.user ?? null);
      setLoading(false);
    }
    loadUser();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {user ? (
        <>
          <ScrollView style={styles.chatWindow}>

            {/* Initial bot message */}
            <BotChatBubble message="Hi there! I’m Bizzy Bot 👋 I’m here to help you find the right pro to help with your project. To get started, describe your project for me." />

            {/* <Text style={styles.heading}>Create Job Screen</Text>
            <Text style={styles.subtext}>Welcome, {user.email}</Text> */}
          </ScrollView>
          <View style={[styles.chatInput, {backgroundColor: theme.surface}]}>
            <TextInput
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor="#888"
            />
            <TouchableOpacity style={[styles.sendButton, { backgroundColor: theme.primary}]}>
              <Image
                source={require("@/assets/images/icons/send-icon.png")} // replace with send icon if you have one
                style={styles.sendIcon}
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text style={styles.subtext}>No user found. Please sign in.</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  subtext: {
    fontSize: 16,
    color: "#555",
  },
  chatWindow: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  chatInput: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.light.tileBackground,
    flexDirection: "row",
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 24,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.primary,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  sendIcon: {
    width: 20,
    height: 20,
    tintColor: "#fff",
  },
});