// app/select-role.tsx
import { useTheme } from "@/components/ThemeContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function SelectRoleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string; // passed from signup screen
  const email = params.email as string;
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleRoleSelect = async (role: "requester" | "provider") => {
  setLoading(true);
  setMsg("");

  // Get the current authenticated user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    setMsg("Could not fetch user.");
    setLoading(false);
    return;
  }

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", user.id); // always use the supabase auth user ID

  if (error) {
    setMsg(error.message);
    setLoading(false);
    return;
  }

  // Navigate based on role
  if (role === "requester") {
    router.push({
      pathname: "/auth/complete-profile",
      params: { userId: user.id, email: user.email },
    });
  } else {
    router.push({
      pathname: "/auth/complete-provider-profile",
      params: { userId: user.id, email: user.email },
    });
  }
};


  return (
    <SafeAreaView style={styles.container}>
      <Image
                              source={require('../../assets/images/icons/bizzy-bot-icon-primary.png')}
                              style={styles.bizzy_bot}
                              resizeMode="contain"
                          />
      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={[styles.subtitle, {color: theme.text}]}>Please select how you want to use the app</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary}]}
        onPress={() => handleRoleSelect("requester")}
        disabled={loading}
      >
        <Text style={styles.buttonText}>I'm a Help Hunter</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.buttonSecondary, { borderColor: theme.primary }]}
        onPress={() => handleRoleSelect("provider")}
        disabled={loading}
      >
        <Text style={[styles.buttonTextSecondary, {color: theme.primary}]}>I'm a Service Provider</Text>
      </TouchableOpacity>

      {msg ? <Text style={{ color: theme.error }}>{msg}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10,fontFamily: "InterVariable" },
  subtitle: { fontSize: 16, color: "#555", marginBottom: 30, textAlign: "center" },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "InterVariable"
  },
    buttonSecondary: {
      borderWidth: 2,
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 7,
      width: '100%',
    },
    buttonTextSecondary: {
      fontSize: 16,
      fontWeight: "700",
      textAlign: "center",
    },
    bizzy_bot: {
      width: 92,
      height: 68,
      marginBottom: 16,
    }
});
