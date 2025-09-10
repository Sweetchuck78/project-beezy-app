// app/_layout.tsx
import { ThemeProvider } from '@/components/ThemeContext';
import { Colors } from '@/constants/Colors';
import * as Font from "expo-font";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text as RNText, View, useColorScheme } from "react-native";
import { supabase } from "../lib/supabase";

export default function RootLayout() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const colorScheme = useColorScheme() || "light";

  const router = useRouter();

  // Load fonts
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          InterVariable: require("../assets/fonts/Inter-VariableFont_opsz,wght.ttf"),
        });

        (RNText as any).defaultProps = (RNText as any).defaultProps || {};
        (RNText as any).defaultProps.style = [
          (RNText as any).defaultProps.style,
          { fontFamily: "InterVariable" },
        ];


        setFontsLoaded(true);
      } catch {
        setFontsLoaded(true); // fail gracefully
      }
    }
    loadFonts();
  }, []);

  // Load session + profile
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session }, error }) => {
      if (error) {
        setLoading(false);
        return;
      }

      setSession(session);

      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", session.user.id)
          .single();

        if (!data?.full_name) setNeedsProfile(true);
      }

      setLoading(false);
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  // 🔑 Handle redirects only after state settles
  useEffect(() => {
    if (!loading && fontsLoaded) {
      if (!session) {
        router.replace("/");
      } else if (needsProfile) {
        router.replace("/auth/select-role");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [loading, fontsLoaded, session, needsProfile]);

  // Show spinner while loading
  if (loading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.dark.primary }}>
        <Image
          source={require('../assets/images/beezy-logo-type.png')}
          style={{ width: 150, height: 50, marginBottom: 20 }}
          tintColor={"#FFFFFF"}
          resizeMode="contain"
        />
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  // Always return a <Stack /> for Expo Router
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="dashboard" options={{ headerShown: false }} />
        {/* <Stack.Screen name="jobs" options={{ headerShown: false }} /> */}
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}