// app/_layout.tsx
import * as Font from "expo-font";
import { Redirect, Stack } from "expo-router";
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

  // Show loading indicator until ready
  if (loading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // 🚀 Use Redirect instead of conditional Stack children
  if (!session) {
    return <Redirect href="/" />;
  }
  if (needsProfile) {
    return <Redirect href="/auth/complete-profile" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" /> 
      <Stack.Screen name="auth" options={{ headerShown: false }} />
    </Stack>
  );
}