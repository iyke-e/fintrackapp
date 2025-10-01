import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { ThemedSafeArea } from "@/component/ThemedComponents";
import { Header } from "@/component/layout/Header";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useAllCategories } from "@/store/useCategory";
import { TransactionItem } from "@/component/history/TranscationItem";
import { FilterTabs } from "@/component/history/TransactionFilter";
import BottomSheet from "@gorhom/bottom-sheet";
import { CategoryFilterSheet } from "@/bottomsheets/CategoryFilterSheet";
import { DateFilterSheet } from "@/bottomsheets/DateFilterSheet";
import { useTransactionFilters } from "@/hooks/useTransactionFilter";
import { EditExpenseSheet } from "@/bottomsheets/EditExpenseSheet";

export default function TransactionScreen() {
  const theme = useAppTheme();
  const expenses = useExpenseStore((s) => s.expenses);
  const categories = useAllCategories();

  const categorySheetRef = useRef<BottomSheet | null>(null);
  const dateSheetRef = useRef<BottomSheet | null>(null);
  const editSheetRef = useRef<BottomSheet | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    filteredExpenses,
    handleApplyCategory,
    handleApplyDate,
    clearFilters,
  } = useTransactionFilters(expenses);

  const sortedExpenses = filteredExpenses
    .slice()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <ThemedSafeArea>
      <ScrollView contentContainerStyle={styles.container}>
        <Header onBack={true} title="Transactions" />

        <FilterTabs
          onCategoryPress={() => categorySheetRef.current?.expand()}
          onDatePress={() => dateSheetRef.current?.expand()}
          onClearFilters={clearFilters}
        />

        {sortedExpenses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              No transactions found.
            </Text>
            <Text style={[styles.emptySubText, { color: theme.subText }]}>
              Try changing the filters or add a new expense.
            </Text>
          </View>
        ) : (
          <View>
            {sortedExpenses.map((item) => {
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
                  onEditPress={(id) => {
                    setEditingId(id);
                    editSheetRef.current?.expand();
                  }}
                />
              );
            })}
          </View>
        )}
      </ScrollView>

      <CategoryFilterSheet
        ref={categorySheetRef}
        categories={categories}
        onApply={handleApplyCategory}
      />

      <DateFilterSheet ref={dateSheetRef} onApply={handleApplyDate} />

      <EditExpenseSheet ref={editSheetRef} expenseId={editingId} />
    </ThemedSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  emptyState: {
    marginTop: 24,
    marginBottom: 16,
    padding: 12,
    borderRadius: 6,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  emptySubText: {
    fontSize: 13,
    textAlign: "center",
  },
});
