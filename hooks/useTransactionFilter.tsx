import { useMemo, useState } from "react";
import { Expense } from "@/store/useExpenseStore"; // adjust path/type

export type Filters = {
  categoryId?: string;
  startDate?: Date;
  endDate?: Date;
  month?: number;
};

export function useTransactionFilters(expenses: Expense[]) {
  const [filters, setFilters] = useState<Filters>({});

  // Apply category filter
  const handleApplyCategory = (categoryId?: string) => {
    setFilters((prev) => ({ ...prev, categoryId }));
  };

  // Apply date filter (either month or start/end)
  const handleApplyDate = (filter: {
    month?: number;
    startDate?: Date;
    endDate?: Date;
  }) => {
    if (filter.month !== undefined) {
      // month selected → reset start/end dates
      setFilters((prev) => ({
        ...prev,
        month: filter.month,
        startDate: undefined,
        endDate: undefined,
      }));
    } else {
      // start/end selected → reset month
      setFilters((prev) => ({
        ...prev,
        month: undefined,
        startDate: filter.startDate,
        endDate: filter.endDate,
      }));
    }
  };

  // Clear all filters
  const clearFilters = () => setFilters({});

  // Filtered expenses with proper date handling
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const expenseDate = new Date(e.date);

      // Normalize start date to 00:00:00
      const start = filters.startDate
        ? new Date(
            filters.startDate.getFullYear(),
            filters.startDate.getMonth(),
            filters.startDate.getDate()
          )
        : undefined;

      // Normalize end date to 23:59:59.999
      const end = filters.endDate
        ? new Date(
            filters.endDate.getFullYear(),
            filters.endDate.getMonth(),
            filters.endDate.getDate(),
            23,
            59,
            59,
            999
          )
        : undefined;

      if (filters.categoryId && e.categoryId !== filters.categoryId)
        return false;
      if (start && expenseDate < start) return false;
      if (end && expenseDate > end) return false;
      if (
        filters.month !== undefined &&
        expenseDate.getMonth() !== filters.month
      )
        return false;

      return true;
    });
  }, [expenses, filters]);

  return {
    filters,
    setFilters,
    handleApplyCategory,
    handleApplyDate,
    clearFilters,
    filteredExpenses,
  };
}
