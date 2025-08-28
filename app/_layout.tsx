// app/_layout.tsx
import * as Font from "expo-font";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text as RNText, View } from "react-native";
import { supabase } from "../lib/supabase";

export default function Layout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts once
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        InterVariable: require("../assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
      });

      // TypeScript-safe global default for all Text components
      (RNText as any).defaultProps = (RNText as any).defaultProps || {};
      (RNText as any).defaultProps.style = { fontFamily: "InterVariable" };

      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  // Load session and profile info
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);

      if (session?.user) {
        supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (!data?.full_name) setNeedsProfile(true);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show loading indicator until fonts and session/profile are ready
  if (loading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!session && <Stack.Screen name="index" />} {/* Get Started */}
      {session && needsProfile && <Stack.Screen name="auth/complete-profile" />}
      {session && !needsProfile && <Stack.Screen name="dashboard" />}
    </Stack>
  );
}