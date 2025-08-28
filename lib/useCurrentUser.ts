// lib/useCurrentUser.ts
import { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function useCurrentUser() {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
      if (data.user) {
        setUser({ id: data.user.id, email: data.user.email ?? "" });
      }
      setLoading(false);
    };

    fetchUser();

    // Optionally subscribe to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      fetchUser();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
}