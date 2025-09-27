import React from "react";
import { ScrollView, View, Pressable, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

import Logo from "@/assets/svgs/logo.svg";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { useAuthStore } from "@/store/useAuthStore";
import { ThemedSafeArea, ThemedText } from "@/component/ThemedComponents";
import { ThemedInput } from "@/component/ThemedInput";
import { Button } from "@/component/ui/Button";

// Zod validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordScreen = () => {
  const router = useRouter();
  const forgotPassword = useAuthStore((state) => state.forgotPassword);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPassword(data.email);
      Alert.alert(
        "Password Reset",
        "If this email is registered, a password reset link has been sent."
      );
      router.replace("/(auth)");
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  return (
    <ThemedSafeArea style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.innerContainer}>
          <View style={styles.logoWrapper}>
            <Logo width={80} height={80} />
          </View>

          <View style={styles.headerWrapper}>
            <ThemedText style={styles.headerText}>Forgot Password</ThemedText>
            <ThemedText style={styles.subText}>
              Enter your email to receive a password reset link
            </ThemedText>
          </View>

          <View style={styles.formWrapper}>
            {/* Email Input */}
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

            {/* Reset Button */}
            <Button
              style={styles.resetBtn}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </View>

          {/* Back to Login */}
          <View style={styles.loginWrapper}>
            <ThemedText>Remembered your password? </ThemedText>
            <Pressable onPress={() => router.push("/(auth)")}>
              <ThemedText style={styles.loginText}>Log in</ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ThemedSafeArea>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingVertical: 32 },
  scrollContent: { flexGrow: 1 },
  innerContainer: { flex: 1 },
  logoWrapper: { marginBottom: 16, alignItems: "center" },
  headerWrapper: { marginBottom: 32 },
  headerText: { fontSize: 28, textAlign: "center", fontWeight: "600" },
  subText: { fontSize: 14, textAlign: "center", marginTop: 8, color: "#666" },
  formWrapper: { gap: 24 },
  resetBtn: { marginTop: 16 },
  loginWrapper: {
    marginVertical: 24,
    flexDirection: "row",
    justifyContent: "center",
  },
  loginText: { color: "#00BEC4" },
});
