// store/useExpenseStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  date: string; // always ISO string
  title: string;
  note?: string;
  paymentMethod?: string;
}

interface ExpenseState {
  expenses: Expense[];
  budget: number;
  setBudget: (amount: number) => void;
  addExpense: (
    expense: Omit<Expense, "id" | "date"> & { date?: Date | string }
  ) => void;
  editExpense: (
    id: string,
    updates: Partial<Omit<Expense, "id"> & { date?: Date | string }>
  ) => boolean;
  deleteExpense: (id: string) => void;
  getExpensesByCategory: (categoryId: string) => Expense[];
  getExpensesByDateRange: (from: Date | string, to: Date | string) => Expense[];
  getBalance: () => number;
  getRecentTransactions: (count?: number) => Expense[];
  filterExpenses: (filters: Partial<Expense>) => Expense[];
}

function normalizeDate(date?: Date | string): string {
  if (!date) return new Date().toISOString();
  if (date instanceof Date) return date.toISOString();
  return new Date(date).toISOString();
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      budget: 0,

      setBudget: (amount) => set({ budget: amount }),

      addExpense: (expense) => {
        const newExpense: Expense = {
          id: uuidv4(),
          ...expense,
          date: normalizeDate(expense.date),
        };
        set((state) => ({ expenses: [...state.expenses, newExpense] }));
      },

      editExpense: (id, updates) => {
        const exists = get().expenses.find((e) => e.id === id);
        if (!exists) return false;

        const updatedDate = normalizeDate(updates.date ?? exists.date);

        set((state) => ({
          expenses: state.expenses.map((e) =>
            e.id === id ? { ...e, ...updates, date: updatedDate } : e
          ),
        }));

        return true;
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((e) => e.id !== id),
        }));
      },

      getExpensesByCategory: (categoryId) =>
        get().expenses.filter((e) => e.categoryId === categoryId),

      getExpensesByDateRange: (from, to) => {
        const fromDate = new Date(from);
        const toDate = new Date(to);
        return get().expenses.filter((e) => {
          const expenseDate = new Date(e.date);
          return expenseDate >= fromDate && expenseDate <= toDate;
        });
      },

      getBalance: () => {
        const { expenses, budget } = get();
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const monthlySpent = expenses
          .filter((e) => {
            const d = new Date(e.date);
            return d >= startOfMonth && d <= endOfMonth;
          })
          .reduce((sum, e) => sum + e.amount, 0);

        return budget - monthlySpent;
      },

      getRecentTransactions: (count = 5) =>
        [...get().expenses]
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, count),

      filterExpenses: (filters) =>
        get().expenses.filter((e) =>
          Object.entries(filters).every(
            ([key, value]) => e[key as keyof Expense] === value
          )
        ),
    }),
    {
      name: "expenses-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
