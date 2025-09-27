import { StyleProp, Text, TextStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { ReactNode } from "react";

import { ViewStyle } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

interface ThemedSafeAreaProp {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ThemedSafeArea = ({ children, style }: ThemedSafeAreaProp) => {
  const theme = useAppTheme();

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: theme.background }, style]}
    >
      {children}
    </SafeAreaView>
  );
};

interface ThemedTextProp {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export const ThemedText = ({ children, style }: ThemedTextProp) => {
  const theme = useAppTheme();
  return <Text style={[{ color: theme.text }, style]}>{children}</Text>;
};
