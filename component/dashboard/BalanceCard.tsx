import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedComponents";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useAppTheme } from "@/hooks/useAppTheme";
import { formatMoney } from "@/utils/formatMoney";

const BalanceCard = () => {
  const expenses = useExpenseStore((s) => s.expenses);
  const budget = useExpenseStore((s) => s.budget);
  const theme = useAppTheme();

  // Compute this month's spent
  const thisMonthSpent = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    return expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  // Compute remaining balance reactively
  const balance = useMemo(
    () => budget - thisMonthSpent,
    [budget, thisMonthSpent]
  );

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
      <View>
        <ThemedText style={styles.label}>Remaining Balance</ThemedText>
        <ThemedText
          style={[
            styles.subValue,
            { color: balance < 0 ? "#dc2626" : "#16a34a" },
          ]}
        >
          ₦{formatMoney(balance)}
        </ThemedText>
      </View>

      <View style={styles.row}>
        <View>
          <ThemedText style={styles.label}>Budget</ThemedText>
          <ThemedText style={styles.value}>₦{formatMoney(budget)}</ThemedText>
        </View>

        <View>
          <ThemedText style={styles.label}>This Month</ThemedText>
          <ThemedText style={styles.value}>
            ₦{formatMoney(thisMonthSpent)}
          </ThemedText>
        </View>
      </View>
    </View>
  );
};

export default BalanceCard;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  label: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 6,
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
  },
  subValue: {
    fontSize: 32,
    fontWeight: "600",
  },
});
