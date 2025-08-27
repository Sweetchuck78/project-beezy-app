// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Layout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) return null; // optional splash/loading screen

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Only the first screen is defined; Expo Router handles the rest */}
      {session ? <Stack.Screen name="dashboard" /> : <Stack.Screen name="auth/sign-in" />}
    </Stack>
  );
}
