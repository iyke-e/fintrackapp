import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import React, { ReactNode } from "react";
import { useAppTheme } from "@/hooks/useAppTheme";

type Variant = "primary" | "outline" | "orange";

interface ButtonProps {
  children?: ReactNode;
  onPress?: () => void;
  icon?: ReactNode;
  variant?: Variant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean; // <-- added
}

export const Button = ({
  children,
  onPress,
  icon,
  variant = "primary",
  style,
  textStyle,
  disabled = false,
  loading = false,
}: ButtonProps) => {
  const theme = useAppTheme();

  const containerVariants: Record<Variant, ViewStyle> = {
    primary: { backgroundColor: theme.primary, borderWidth: 0 },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: theme.border,
    },
    orange: { backgroundColor: "#FF7F50", borderWidth: 0 },
  };

  const textVariants: Record<Variant, TextStyle> = {
    primary: { color: "#fff" },
    outline: { color: theme.primary },
    orange: { color: "#fff" },
  };

  return (
    <Pressable
      style={[
        styles.base,
        containerVariants[variant],
        style,
        (disabled || loading) && { opacity: 0.5 },
      ]}
      onPress={disabled || loading ? undefined : onPress}
    >
      {icon && !loading && <View style={styles.iconWrapper}>{icon}</View>}
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" ? theme.primary : "#fff"}
        />
      ) : (
        children && (
          <Text style={[styles.textBase, textVariants[variant], textStyle]}>
            {children}
          </Text>
        )
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 50,
    gap: 8,
  },
  textBase: {
    fontSize: 16,
    fontWeight: "600",
  },
  iconWrapper: {
    marginRight: 4,
  },
});
