import { useRouter } from "expo-router";
import { Check } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import Google from "@/assets/svgs/google.svg";
import Logo from "@/assets/svgs/logo.svg";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useAuthStore } from "@/store/useAuthStore";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";
import { ThemedSafeArea, ThemedText } from "@/component/ThemedComponents";
import { ThemedInput } from "@/component/ThemedInput";
import { Button } from "@/component/ui/Button";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginScreen = () => {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const { promptGoogleSignIn } = useGoogleAuth(); // hook for Google login

  const [rememberMe, setRememberMe] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data.email, data.password, rememberMe);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Login Error", err.message || "Something went wrong");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await promptGoogleSignIn();
      // You may want to reload your store state after OAuth succeeds
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert(
        "Google Sign-in Error",
        err.message || "Something went wrong"
      );
    }
  };

  return (
    <ThemedSafeArea style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.innerContainer}>
            <View style={styles.logoWrapper}>
              <Logo width={80} height={80} />
            </View>

            <View style={styles.welcomeWrapper}>
              <ThemedText style={styles.welcomeText}>Welcome Back</ThemedText>
            </View>

            <Button
              variant="outline"
              icon={<Google width={20} height={20} />}
              onPress={handleGoogleSignIn}
            >
              Sign in with Google
            </Button>

            <View style={styles.orDividerWrapper}>
              <View style={styles.divider} />
              <ThemedText style={styles.orText}>or continue with</ThemedText>
              <View style={styles.divider} />
            </View>

            <View style={styles.formWrapper}>
              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange, onBlur } }) => (
                  <ThemedInput
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.email?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange, onBlur } }) => (
                  <ThemedInput
                    type="password"
                    label="Password"
                    placeholder="Enter your password"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.password?.message}
                  />
                )}
              />

              <View style={styles.cta}>
                <View style={styles.rememberWrapper}>
                  <Pressable
                    style={styles.checkbox}
                    onPress={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && <Check size={16} color="#00BEC4" />}
                  </Pressable>
                  <ThemedText style={styles.rememberText}>
                    Remember Me
                  </ThemedText>
                </View>

                <Pressable
                  onPress={() => router.push("/(auth)/forgotpassword")}
                >
                  <ThemedText style={styles.forgotText}>
                    Forgot Password?
                  </ThemedText>
                </Pressable>
              </View>

              <Button
                style={styles.loginBtn}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </View>
          </View>

          <View style={styles.signupWrapper}>
            <ThemedText>Don't have an account? </ThemedText>
            <Pressable onPress={() => router.push("/(auth)/signup")}>
              <ThemedText style={styles.signupText}>Sign up</ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedSafeArea>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingVertical: 32 },
  scrollContent: { flexGrow: 1 },
  innerContainer: { flex: 1 },
  logoWrapper: { marginBottom: 16, alignItems: "center" },
  welcomeWrapper: { marginBottom: 40 },
  welcomeText: { fontSize: 28, textAlign: "center", fontWeight: "600" },
  orDividerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 40,
  },
  divider: { flex: 1, height: 0.5, backgroundColor: "rgba(128,128,128,0.4)" },
  orText: { paddingHorizontal: 24 },
  formWrapper: { gap: 16 },
  cta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  forgotText: { color: "#00BEC4" },
  loginBtn: { marginTop: 16 },
  signupWrapper: {
    marginVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: { color: "#00BEC4" },
  rememberWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#00BEC4",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  rememberText: { fontSize: 14, color: "#00BEC4" },
});
