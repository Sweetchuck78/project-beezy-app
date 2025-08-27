// app/index.tsx
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Redirect based on auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.replace("/dashboard"); // logged-in users
      } else {
        router.replace("/auth/sign-in"); // logged-out users
      }
    });
  }, []);

  return null; // or a simple splash/loading screen
}
