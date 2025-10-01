import React, { useState, useRef } from "react";
import { View, StyleSheet, Appearance, Pressable } from "react-native";
import { ThemedSafeArea, ThemedText } from "@/component/ThemedComponents";
import { useAuthStore } from "@/store/useAuthStore";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useThemeStore } from "@/store/useThemeStore";
import { useRouter } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { SetBudgetBottomSheet } from "@/bottomsheets/BudgetSheet";
import { Header } from "@/component/layout/Header";
import { ThemeModal } from "@/modal/ThemeModal";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Avatar } from "@/component/ui/Avatar";

const ProfileScreen = () => {
  const theme = useAppTheme();
  const router = useRouter();

  const { fullName, profilePicture, updateProfilePicture, logout } =
    useAuthStore();
  const { budget } = useExpenseStore();
  const { isDarkMode, setTheme } = useThemeStore();

  const budgetSheetRef = useRef<BottomSheet>(null);
  const [themeModalVisible, setThemeModalVisible] = useState(false);

  /** Logout */
  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)");
  };

  /** Theme selection */
  const handleThemeSelect = (selected: "light" | "dark" | "system") => {
    if (selected === "light") setTheme(false);
    else if (selected === "dark") setTheme(true);
    else setTheme(Appearance.getColorScheme() === "dark");
    setThemeModalVisible(false);
  };

  return (
    <ThemedSafeArea>
      <Header onBack title="Profile" />
      <View style={styles.container}>
        {/* Universal Avatar */}
        <Avatar size={200} editable onPress={() => {}} />

        <ThemedText style={styles.name}>{fullName}</ThemedText>

        {/* Profile Options */}
        <View style={[styles.menu, { backgroundColor: theme.cardBg }]}>
          <ProfileOption
            title="Set Monthly Budget"
            onPress={() => budgetSheetRef.current?.expand()}
          />
          <ProfileOption
            title="Manage Categories"
            onPress={() => router.push("/(tabs)/category")}
          />
          <ProfileOption title="Change Password" onPress={() => {}} />
          <ProfileOption title="Notifications" onPress={() => {}} />
          <ProfileOption
            title="Theme"
            onPress={() => setThemeModalVisible(true)}
            subText={isDarkMode ? "Dark" : "Light"}
          />
          <ProfileOption title="Logout" onPress={handleLogout} />
        </View>

        {/* Budget Bottom Sheet */}
        <SetBudgetBottomSheet ref={budgetSheetRef} />

        {/* Theme Modal */}
        <ThemeModal
          visible={themeModalVisible}
          onClose={() => setThemeModalVisible(false)}
          onSelect={handleThemeSelect}
        />
      </View>
    </ThemedSafeArea>
  );
};

const ProfileOption = ({
  title,
  onPress,
  subText,
}: {
  title: string;
  onPress: () => void;
  subText?: string;
}) => {
  const theme = useAppTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        { backgroundColor: pressed ? "#3f404138" : "transparent" },
      ]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText style={[styles.optionText, { color: theme.text }]}>
          {title}
        </ThemedText>
        {subText && (
          <ThemedText style={{ color: "#6b7280", fontSize: 14 }}>
            {subText}
          </ThemedText>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", flex: 1 },
  name: { fontSize: 32, marginBottom: 30 },
  menu: {
    width: "100%",
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomColor: "#e5e7eb09",
    borderBottomWidth: 0.5,
  },
  optionText: { fontSize: 16 },
});

export default ProfileScreen;
