import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { useNavigation } from "expo-router";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ThemedText } from "../ThemedComponents";

interface HeaderProps {
  title: string;
  onBack?: boolean;
  rightIcon?: keyof typeof LucideIcons;
  onRightPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  rightIcon,
  onRightPress,
}) => {
  const theme = useAppTheme();
  const RightIcon = rightIcon ? (LucideIcons as any)[rightIcon] : null;
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {onBack ? (
        <Pressable onPress={() => navigation.goBack()} style={styles.left}>
          <LucideIcons.ArrowLeft color={theme.text} size={24} />
        </Pressable>
      ) : (
        <View style={styles.left} />
      )}

      <ThemedText style={styles.title}>{title}</ThemedText>

      {RightIcon ? (
        <Pressable onPress={onRightPress} style={styles.right}>
          <RightIcon color={theme.text} size={24} />
        </Pressable>
      ) : (
        <View style={styles.right} /> // placeholder
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  left: {
    width: 40,
    alignItems: "flex-start",
  },
  right: {
    width: 40,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    flex: 1,
  },
});
