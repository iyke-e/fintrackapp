import React, { useMemo } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useAllCategories } from "@/store/useCategory";
import { TransactionItem } from "@/component/history/TranscationItem";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ThemedText } from "../ThemedComponents";
import { useRouter } from "expo-router";

interface RecentTransactionsProps {
  count?: number;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  count = 5,
}) => {
  const theme = useAppTheme();
  const expenses = useExpenseStore((state) => state.expenses);
  const categories = useAllCategories();
  const router = useRouter();

  // derive recent transactions
  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, count);
  }, [expenses, count]);

  if (recentExpenses.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={[styles.emptyText, { color: theme.text }]}>
          No recent transactions.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ marginTop: 20 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ThemedText style={{ fontSize: 18, fontWeight: "600" }}>
          Recent Transactions
        </ThemedText>
        <Pressable onPress={() => router.push("/(tabs)/history")} hitSlop={10}>
          <Text style={{ color: theme.primary }}>View all</Text>
        </Pressable>
      </View>

      <View style={{ marginTop: 20 }}>
        {recentExpenses.map((item) => {
          const category = categories.find((c) => c.id === item.categoryId);
          if (!category) return null;

          return (
            <TransactionItem
              key={item.id}
              id={item.id}
              category={category}
              amount={item.amount}
              title={item.title}
              note={item.note}
              date={new Date(item.date).toDateString()}
            />
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
