// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// ✅ Load from Expo's public env vars
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

// Optional debug logs (safe: only shows first part of key)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Missing Supabase environment variables!");
} else {
  console.log("✅ Supabase URL loaded:", supabaseUrl);
  console.log("✅ Supabase Key prefix:", supabaseAnonKey.slice(0, 6));
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
