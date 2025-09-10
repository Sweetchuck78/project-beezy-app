// lib/supabase.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// Use AsyncStorage on native, default storage (localStorage) on web
const options =
  Platform.OS === "web"
    ? {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true, // needed for magic links / OAuth in web
        },
      }
    : {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false, // no window.location in RN
        },
      };

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);


// Optional debug logs (safe: only shows first part of key)
// if (!supabaseUrl || !supabaseAnonKey) {
//   console.error("❌ Missing Supabase environment variables!");
// } else {
//   console.log("✅ Supabase URL loaded:", supabaseUrl);
//   console.log("✅ Supabase Key prefix:", supabaseAnonKey.slice(0, 6));
// }