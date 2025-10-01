import { AddExpenseBottomSheet } from "@/bottomsheets/ExpenseSheet";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Tabs } from "expo-router";
import {
  CircleUserRound,
  History,
  LayoutDashboard,
  Plus,
  Tag,
} from "lucide-react-native";
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import BottomSheet from "@gorhom/bottom-sheet";

export default function AppLayout() {
  const theme = useAppTheme();
  const sheetRef = useRef<BottomSheet>(null);

  const openSheet = () => {
    sheetRef.current?.expand(); // open bottom sheet
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#00BEC4",
          tabBarStyle: {
            height: 70,
            backgroundColor: theme.background,
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ focused }) => (
              <LayoutDashboard color={focused ? "#00BEC4" : "gray"} />
            ),
          }}
        />

        <Tabs.Screen
          name="history"
          options={{
            title: "Transaction",
            tabBarIcon: ({ focused }) => (
              <History color={focused ? "#00BEC4" : "gray"} />
            ),
          }}
        />

        {/* Center Add Button */}
        <Tabs.Screen
          name="add"
          options={{
            tabBarIcon: () => (
              <View style={styles.addButton}>
                <Plus color="white" size={28} />
              </View>
            ),
            tabBarLabel: () => null,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault(); // stop navigation
              openSheet(); // open bottom sheet
            },
          }}
        />

        <Tabs.Screen
          name="category"
          options={{
            title: "Category",
            tabBarIcon: ({ focused }) => (
              <Tag color={focused ? "#00BEC4" : "gray"} />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <CircleUserRound color={focused ? "#00BEC4" : "gray"} />
            ),
          }}
        />
      </Tabs>

      {/* Bottom sheet modal */}
      <AddExpenseBottomSheet
        ref={sheetRef}
        onClose={() => sheetRef.current?.close()}
      />
    </>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "#00BEC4",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 32,
    height: 64,
    width: 64,
    marginBottom: 16,
  },
});
