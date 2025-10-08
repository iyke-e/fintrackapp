import React from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import * as LucideIcons from "lucide-react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ThemedText } from "../ThemedComponents";
import { adjustColor } from "@/utils/colorUtils";
import { useThemeStore } from "@/store/useThemeStore";
import { Category } from "@/store/useCategory";
import { useExpenseStore } from "@/store/useExpenseStore";

interface Props {
  id: string;
  category: Category;
  amount: number;
  title: string;
  note?: string;
  date: string;
  onEditPress?: (id: string) => void;
}

export function TransactionItem({
  id,
  category,
  amount,
  title,
  note,
  date,
  onEditPress,
}: Props) {
  const theme = useAppTheme();
  const isDark = useThemeStore((state) => state.isDarkMode);
  const deleteExpense = useExpenseStore((s) => s.deleteExpense);

  const Icon: React.ElementType =
    (category.icon && (LucideIcons as any)[category.icon]) ||
    LucideIcons.ShoppingBag;

  const bgColor = adjustColor(category.color, 0.8, isDark ? "dark" : "light");

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>
  ) => (
    <Pressable style={styles.deleteBox} onPress={() => deleteExpense(id)}>
      <LucideIcons.Trash2 color="#fff" size={20} />
    </Pressable>
  );

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <Pressable
        onLongPress={() => onEditPress?.(id)}
        style={[styles.container, { backgroundColor: theme.cardBg }]}
      >
        {/* Left: Icon + Title */}
        <View style={styles.left}>
          <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
            <Icon color={category.color} size={20} />
          </View>
          <View>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText style={[styles.subText, { color: theme.subText }]}>
              {category.name}
            </ThemedText>
          </View>
        </View>

        {/* Right: Amount + Date */}
        <View style={styles.right}>
          <ThemedText style={styles.amount}>₦{amount.toFixed(2)}</ThemedText>
          <ThemedText style={[styles.date, { color: theme.subText }]}>
            {date}
          </ThemedText>
        </View>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
  },
  subText: {
    fontSize: 13,
  },
  right: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  deleteBox: {
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    marginVertical: 6,
    borderRadius: 8,
  },
});
