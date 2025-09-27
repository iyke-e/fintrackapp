import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";

export interface AuthState {
  isLoggedIn: boolean;
  user?: any;
  fullName?: string;
  remember: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  setAuthState: (
    state: Partial<{
      isLoggedIn: boolean;
      user: any;
      fullName: string;
      remember: boolean;
    }>
  ) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: undefined,
      fullName: "",
      remember: false,

      login: async (email, password, remember = false) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;

          const fullName = data.user?.user_metadata?.full_name || "";

          set({
            isLoggedIn: true,
            user: data.user,
            fullName,
            remember,
          });
        } catch (err) {
          console.error("Login error:", err);
          throw err;
        }
      },

      signup: async (fullName, email, password) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
          });
          if (error) throw error;

          // handle case where user requires email confirmation
          set({
            isLoggedIn: !!data.session,
            user: data.user,
            fullName,
            remember: true,
          });
        } catch (err) {
          console.error("Signup error:", err);
          throw err;
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.error("Logout error:", err);
        } finally {
          set({
            isLoggedIn: false,
            user: undefined,
            fullName: "",
            remember: false,
          });
        }
      },

      forgotPassword: async (email) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "yourapp://auth/callback",
          });
          if (error) throw error;
        } catch (err) {
          console.error("Forgot password error:", err);
          throw err;
        }
      },

      setAuthState: (state) => set((prev) => ({ ...prev, ...state })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist when remember is true
      partialize: (state) =>
        state.remember
          ? {
              isLoggedIn: state.isLoggedIn,
              user: state.user,
              fullName: state.fullName,
              remember: state.remember,
            }
          : { remember: false }, // nothing sensitive saved
    }
  )
);
