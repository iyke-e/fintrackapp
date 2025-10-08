import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";

export interface AuthState {
  isLoggedIn: boolean;
  user?: any;
  fullName?: string;
  profilePicture?: string;
  remember: boolean;

  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  updateProfilePicture: (url: string) => Promise<void>;
  setAuthState: (state: Partial<AuthState>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: undefined,
      fullName: "",
      profilePicture: undefined,
      remember: false,

      login: async (email, password, remember = false) => {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;

          // Always fetch fresh user metadata
          const { data: freshUser, error: userError } =
            await supabase.auth.getUser();
          if (userError) throw userError;

          const user = freshUser.user;
          const fullName = user?.user_metadata?.full_name || "";
          const profilePicture = user?.user_metadata?.profile_picture;

          set({
            isLoggedIn: true,
            user,
            fullName,
            profilePicture,
            remember,
          });
        } catch (err: any) {
          console.error("Login error:", err.message || err);
          throw err;
        }
      },

      signup: async (fullName, email, password) => {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName },
            },
          });
          if (error) throw error;

          // Get fresh user after signup
          const { data: freshUser, error: userError } =
            await supabase.auth.getUser();
          if (userError) throw userError;

          const user = freshUser.user;
          const profilePicture = user?.user_metadata?.profile_picture;

          set({
            isLoggedIn: !!data.session,
            user,
            fullName,
            profilePicture,
            remember: true,
          });
        } catch (err: any) {
          console.error("Signup error:", err.message || err);
          throw err;
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
        } catch (err: any) {
          console.error("Logout error:", err.message || err);
        } finally {
          set({
            isLoggedIn: false,
            user: undefined,
            fullName: "",
            profilePicture: undefined,
            remember: false,
          });
        }
      },

      forgotPassword: async (email) => {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: "yourapp://auth/callback", // ✅ make sure deep link is configured
          });
          if (error) throw error;
        } catch (err: any) {
          console.error("Forgot password error:", err.message || err);
          throw err;
        }
      },

      updateProfilePicture: async (url: string) => {
        const prev = get().profilePicture;

        // Optimistic update
        set({ profilePicture: url });

        try {
          const { error } = await supabase.auth.updateUser({
            data: { profile_picture: url },
          });
          if (error) throw error;

          // Fetch latest user after update
          const { data: freshUser, error: userError } =
            await supabase.auth.getUser();
          if (userError) throw userError;

          const user = freshUser.user;
          set({
            user,
            profilePicture: user?.user_metadata?.profile_picture || url,
          });
        } catch (err: any) {
          console.error("Profile picture update failed:", err.message || err);
          set({ profilePicture: prev });
        }
      },

      setAuthState: (state) => set((prev) => ({ ...prev, ...state })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) =>
        state.remember
          ? {
              isLoggedIn: state.isLoggedIn,
              user: state.user,
              fullName: state.fullName,
              profilePicture: state.profilePicture,
              remember: state.remember,
            }
          : { remember: false },
    }
  )
);
