import { supabase } from "@/lib/supabase";
import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const promptGoogleSignIn = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "expensetracker://auth/callback",
        },
      });

      if (error) throw error;

      if (data.url) {
        console.log("Redirecting to Google OAuth:", data.url);
      }
    } catch (err: any) {
      console.error("Google sign-in error:", err.message);
    }
  }, []);

  return { promptGoogleSignIn };
};
