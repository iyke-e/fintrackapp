import React, { useMemo } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

interface BudgetProgressBarProps {
  budget: number;
  expenses: number;
}

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  budget,
  expenses,
}) => {
  const theme = useAppTheme();

  const progress = useMemo(() => {
    if (!budget || budget <= 0) return 0;
    return Math.min(expenses / budget, 1); // clamp to 100%
  }, [budget, expenses]);

  const remaining = Math.max(budget - expenses, 0);

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
      <View style={styles.header}>
        <Text style={[styles.label, { color: theme.text }]}>
          Monthly Budget
        </Text>
        <Text style={[styles.value, { color: theme.text }]}>
          ₦{expenses.toLocaleString()} / ₦{budget.toLocaleString()}
        </Text>
      </View>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${progress * 100}%`,
              backgroundColor:
                progress < 0.7
                  ? theme.primary
                  : progress < 1
                  ? "#facc15" // yellow if near limit
                  : "#ef4444", // red if exceeded
            },
          ]}
        />
      </View>

      <Text style={[styles.remaining, { color: theme.subText }]}>
        Remaining: ₦{remaining.toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
  },
  progressBackground: {
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e5e7eb",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  remaining: {
    marginTop: 6,
    fontSize: 14,
  },
});
