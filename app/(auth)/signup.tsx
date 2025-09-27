import React from "react";
import {
  ScrollView,
  View,
  Pressable,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

import Logo from "@/assets/svgs/logo.svg";
import Google from "@/assets/svgs/google.svg";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAuthStore } from "@/store/useAuthStore";
import { ThemedSafeArea, ThemedText } from "@/component/ThemedComponents";
import { Button } from "@/component/ui/Button";
import { ThemedInput } from "@/component/ThemedInput";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

const signupSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type SignupFormData = z.infer<typeof signupSchema>;

const SignupScreen = () => {
  const router = useRouter();
  const signup = useAuthStore((state) => state.signup);
  const { promptGoogleSignIn } = useGoogleAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: "", email: "", password: "" },
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data.fullName, data.email, data.password);
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert("Signup Error", err.message || "Something went wrong");
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await promptGoogleSignIn();
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert(
        "Google Sign-up Error",
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
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.innerContainer}>
            <View style={styles.logoWrapper}>
              <Logo width={80} height={80} />
            </View>

            <View style={styles.headerWrapper}>
              <ThemedText style={styles.headerText}>
                Create an Account
              </ThemedText>
            </View>

            <Button
              variant="outline"
              icon={<Google width={20} height={20} />}
              onPress={handleGoogleSignUp}
            >
              Sign up with Google
            </Button>

            <View style={styles.orDividerWrapper}>
              <View style={styles.divider} />
              <ThemedText style={styles.orText}>or continue with</ThemedText>
              <View style={styles.divider} />
            </View>

            <View style={styles.formWrapper}>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { value, onChange, onBlur } }) => (
                  <ThemedInput
                    type="text"
                    label="Full Name"
                    placeholder="Enter your full name"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.fullName?.message}
                  />
                )}
              />
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

              <ThemedText style={styles.termsText}>
                By selecting Register below, I agree to{" "}
                <ThemedText style={styles.linkText}>
                  Terms of Services and Privacy Policy
                </ThemedText>
              </ThemedText>

              <Button
                style={styles.registerBtn}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </Button>
            </View>
          </View>

          <View style={styles.loginWrapper}>
            <ThemedText>Already have an account? </ThemedText>
            <Pressable onPress={() => router.push("/(auth)")}>
              <ThemedText style={styles.loginText}>Log in</ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedSafeArea>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingVertical: 32 },
  scrollContent: { flexGrow: 1 },
  innerContainer: { flex: 1 },
  logoWrapper: { marginBottom: 16, alignItems: "center" },
  headerWrapper: { marginBottom: 40 },
  headerText: { fontSize: 28, textAlign: "center", fontWeight: "600" },
  orDividerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 40,
  },
  divider: { flex: 1, height: 0.5, backgroundColor: "rgba(128,128,128,0.4)" },
  orText: { paddingHorizontal: 24 },
  formWrapper: { gap: 16 },
  termsText: { fontSize: 12, lineHeight: 18 },
  linkText: { color: "#00BEC4" },
  registerBtn: { marginTop: 16 },
  loginWrapper: {
    marginVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: { color: "#00BEC4" },
});
