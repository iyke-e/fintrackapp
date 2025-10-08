import { supabase } from "@/lib/supabase";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { useCallback } from "react";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const promptGoogleSignIn = useCallback(async () => {
    try {
      const redirectTo = AuthSession.makeRedirectUri({
        scheme: "expensetracker", // must match app.json -> expo.scheme
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });

      if (error) throw error;

      if (data?.url) {
        // actually open the Google sign-in flow
        const res = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

        if (res.type === "success" && res.url) {
          const { data: sessionData, error: sessionError } =
            await supabase.auth.exchangeCodeForSession(res.url);

          if (sessionError) throw sessionError;
          console.log("Google login success:", sessionData);
        }
      }
    } catch (err: any) {
      console.error("Google sign-in error:", err.message);
    }
  }, []);

  return { promptGoogleSignIn };
};
