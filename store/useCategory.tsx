// store/useCategory.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/lib/supabase";

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: keyof typeof import("lucide-react-native");
  isDefault: boolean;
}

export const defaultCategories: Category[] = [
  {
    id: "food",
    name: "Food",
    color: "#FFAB91",
    icon: "Utensils",
    isDefault: true,
  },
  {
    id: "snacks",
    name: "Snacks & Drinks",
    color: "#FFD54F",
    icon: "Coffee",
    isDefault: true,
  },
  {
    id: "groceries",
    name: "Groceries",
    color: "#81C784",
    icon: "ShoppingCart",
    isDefault: true,
  },
  { id: "rent", name: "Rent", color: "#B39DDB", icon: "Home", isDefault: true },
  {
    id: "utilities",
    name: "Bills (Water, Power)",
    color: "#90CAF9",
    icon: "Receipt",
    isDefault: true,
  },
  {
    id: "internet",
    name: "Internet & Phone",
    color: "#4DB6AC",
    icon: "Wifi",
    isDefault: true,
  },
  {
    id: "transport",
    name: "Transport",
    color: "#64B5F6",
    icon: "Car",
    isDefault: true,
  },
  {
    id: "fuel",
    name: "Fuel",
    color: "#4FC3F7",
    icon: "Droplet",
    isDefault: true,
  },
  {
    id: "health",
    name: "Health",
    color: "#F48FB1",
    icon: "HeartPulse",
    isDefault: true,
  },
  {
    id: "personalcare",
    name: "Personal Care",
    color: "#FFF59D",
    icon: "Scissors",
    isDefault: true,
  },
  {
    id: "insurance",
    name: "Insurance",
    color: "#CE93D8",
    icon: "Shield",
    isDefault: true,
  },
  {
    id: "shopping",
    name: "Shopping",
    color: "#FFCC80",
    icon: "ShoppingBag",
    isDefault: true,
  },
  {
    id: "entertainment",
    name: "Entertainment",
    color: "#BA68C8",
    icon: "Music",
    isDefault: true,
  },
  {
    id: "subscriptions",
    name: "Subscriptions",
    color: "#80CBC4",
    icon: "Tv",
    isDefault: true,
  },
  {
    id: "childcare",
    name: "Childcare",
    color: "#FFCDD2",
    icon: "User",
    isDefault: true,
  },
  { id: "pets", name: "Pets", color: "#E1BEE7", icon: "Dog", isDefault: true },
  {
    id: "gifts",
    name: "Gifts & Donations",
    color: "#F8BBD0",
    icon: "Gift",
    isDefault: true,
  },
  {
    id: "education",
    name: "Education",
    color: "#AED581",
    icon: "BookOpen",
    isDefault: true,
  },
  {
    id: "work",
    name: "Work Expenses",
    color: "#9FA8DA",
    icon: "Briefcase",
    isDefault: true,
  },
  {
    id: "others",
    name: "Others",
    color: "#E0E0E0",
    icon: "CircleEllipsis",
    isDefault: true,
  },
];

interface CategoryState {
  userCategories: Category[];
  addCategory: (c: Category) => boolean;
  editCategory: (id: string, updates: Partial<Category>) => boolean;
  deleteCategory: (id: string) => void;
  syncCategories: (userId: string) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>()(
  persist(
    (set, get) => ({
      userCategories: [],

      addCategory: (c) => {
        const allCategories = [...defaultCategories, ...get().userCategories];
        if (
          allCategories.some(
            (cat) => cat.name.toLowerCase() === c.name.toLowerCase()
          )
        ) {
          return false; // duplicate, don't add
        }
        set((state) => ({ userCategories: [...state.userCategories, c] }));
        return true;
      },

      editCategory: (id, updates) => {
        if (updates.name) {
          const allCategories = [...defaultCategories, ...get().userCategories];
          if (
            allCategories.some(
              (cat) =>
                cat.id !== id &&
                cat.name.toLowerCase() === updates.name!.toLowerCase()
            )
          ) {
            return false; // duplicate, don't update
          }
        }
        set((state) => ({
          userCategories: state.userCategories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
        return true;
      },

      deleteCategory: (id) => {
        set((state) => ({
          userCategories: state.userCategories.filter((c) => c.id !== id),
        }));
      },

      syncCategories: async (userId) => {
        const { userCategories } = get();
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .eq("user_id", userId);
        if (error) return console.log("Supabase sync error:", error.message);

        const merged = [
          ...userCategories,
          ...data.map((d) => ({
            id: d.id,
            name: d.name,
            color: d.color,
            icon: d.icon,
            isDefault: false,
          })),
        ].reduce((acc, item) => {
          if (!acc.find((c) => c.id === item.id)) acc.push(item);
          return acc;
        }, [] as Category[]);

        set({ userCategories: merged });

        const localOnly = userCategories.filter(
          (c) => !data.find((d) => d.id === c.id)
        );
        if (localOnly.length > 0) {
          await supabase.from("categories").upsert(
            localOnly.map((c) => ({
              id: c.id,
              user_id: userId,
              name: c.name,
              color: c.color,
              icon: c.icon,
            }))
          );
        }
      },
    }),
    {
      name: "categories-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function useAllCategories() {
  const userCategories = useCategoryStore((s) => s.userCategories);
  return [...defaultCategories, ...userCategories];
}
