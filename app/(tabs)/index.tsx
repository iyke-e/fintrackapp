import { ScrollView, StyleSheet, View } from "react-native";
import React, { useMemo } from "react";
import { ThemedSafeArea, ThemedText } from "@/component/ThemedComponents";
import { Avatar } from "@/component/ui/Avatar";
import { useAuthStore } from "@/store/useAuthStore";
import { Bell } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";
import BalanceCard from "@/component/dashboard/BalanceCard";
import { RecentTransactions } from "@/component/dashboard/Recentranx";
import { BudgetProgressBar } from "@/component/dashboard/BudgetProgressBar";
import { useExpenseStore } from "@/store/useExpenseStore";

export default function Dashboard() {
  const { fullName } = useAuthStore();
  const theme = useAppTheme();
  const { budget, expenses } = useExpenseStore();

  // total expenses for current month
  const totalExpensesThisMonth = useMemo(() => {
    const now = new Date();
    return expenses
      .filter((e) => {
        const date = new Date(e.date);
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  return (
    <ThemedSafeArea>
      <ScrollView style={styles.container}>
        {/* Top bar */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.welcome}>
            <Avatar size={40} />
            <ThemedText>
              Hello!{"\n"}
              {fullName?.split(" ")[1]}
            </ThemedText>
          </View>
          <Bell color={theme.primary} />
        </View>

        {/* Balance & Transactions */}
        <BalanceCard />
        <RecentTransactions />

        {/* Budget progress bar */}
        {budget > 0 && (
          <BudgetProgressBar
            budget={budget}
            expenses={totalExpensesThisMonth}
          />
        )}
      </ScrollView>
    </ThemedSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  welcome: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
