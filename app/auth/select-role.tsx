// app/select-role.tsx
import colors from "@/assets/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";

export default function SelectRoleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string; // passed from signup screen
  const email = params.email as string;

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleRoleSelect = async (role: "requester" | "provider") => {
    setLoading(true);
    setMsg("");

    // Save role in Supabase profiles table
    const { error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    // Navigate based on role
    if (role === "requester") {
      router.push({
        pathname: "/auth/complete-profile",
        params: { userId, email },
      });
    } else {
      router.push({
        pathname: "/auth/complete-provider-profile",
        params: { userId, email },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Choose Your Role</Text>
      <Text style={styles.subtitle}>Please select how you want to use the app</Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.buttonPrimary }]}
        onPress={() => handleRoleSelect("requester")}
        disabled={loading}
      >
        <Text style={styles.buttonText}>I am a Service Requester</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => handleRoleSelect("provider")}
        disabled={loading}
      >
        <Text style={styles.buttonTextSecondary}>I am a Service Provider</Text>
      </TouchableOpacity>

      {msg ? <Text style={styles.error}>{msg}</Text> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
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
    fontFamily: Platform.OS === "ios" ? "System" : "sans-serif",
  },
    buttonSecondary: {
      borderWidth: 2,
      borderColor: colors.buttonPrimary,
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 7,
      width: '100%',
    },
    buttonTextSecondary: {
      color: colors.buttonPrimary,
      fontSize: 16,
      fontWeight: "700",
      textAlign: "center",
    },
  error: { marginTop: 15, color: "red" },
});
