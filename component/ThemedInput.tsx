import { Eye, EyeOff } from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  View,
  StyleSheet,
  TextInput,
  TextInputProps,
} from "react-native";
import { ThemedText } from "./ThemedComponents";
import { useAppTheme } from "@/hooks/useAppTheme";

interface ThemedInputProps extends TextInputProps {
  label?: string;
  type?: "text" | "email" | "password" | "number";
  error?: string;
}

export function ThemedInput({
  label = "",
  type = "text",
  placeholder = "",
  error,
  ...props
}: ThemedInputProps) {
  const theme = useAppTheme();
  const [secure, setSecure] = useState(type === "password");

  return (
    <View style={styles.container}>
      {label ? (
        <ThemedText style={[styles.label, { color: theme.text }]}>
          {label}
        </ThemedText>
      ) : null}
      <View style={styles.inputWrapper}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={"gray"}
          style={[
            styles.input,
            {
              color: theme.text,
              borderColor: error ? "red" : theme.border, // highlight error
              backgroundColor: theme.cardBg,
            },
          ]}
          keyboardType={
            type === "email"
              ? "email-address"
              : type === "number"
              ? "numeric"
              : "default"
          }
          secureTextEntry={secure}
          autoCapitalize={type === "email" ? "none" : "sentences"}
          {...props}
        />

        {type === "password" && (
          <Pressable style={styles.eyeIcon} onPress={() => setSecure(!secure)}>
            {secure ? (
              <EyeOff size={20} color="#888" />
            ) : (
              <Eye size={20} color="#888" />
            )}
          </Pressable>
        )}
      </View>
      {error && <ThemedText style={styles.error}>{error}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  inputWrapper: {
    position: "relative",
    width: "100%",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 12,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
