// components/category/CategoryItem.tsx
import React from "react";
import { View, Pressable, StyleSheet } from "react-native";
import * as LucideIcons from "lucide-react-native";
import { Category } from "@/store/useCategory";
import { useAppTheme } from "@/hooks/useAppTheme";
import { ThemedText } from "../ThemedComponents";
import { adjustColor } from "@/utils/colorUtils";
import { useThemeStore } from "@/store/useThemeStore";

interface Props {
  item: Category;
  onEdit?: (c: Category) => void;
  onDelete?: (id: string) => void;
}

export function CategoryItem({ item, onEdit, onDelete }: Props) {
  const theme = useAppTheme();
  const isDark = useThemeStore((state) => state.isDarkMode);

  const Icon: React.ElementType =
    (item.icon && (LucideIcons as any)[item.icon]) || LucideIcons.Tag;

  // pass "dark" or "light" based on your theme store
  const bgColor = adjustColor(item.color, 0.8, isDark ? "dark" : "light");

  return (
    <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
      <View style={styles.left}>
        <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
          <Icon color={item.color} size={20} />
        </View>
        <ThemedText style={styles.title}>{item.name}</ThemedText>
      </View>

      {!item.isDefault && (
        <View style={styles.actions}>
          <Pressable onPress={() => onEdit?.(item)} style={styles.actionBtn}>
            <LucideIcons.Edit size={18} color={theme.subText} />
          </Pressable>
          <Pressable onPress={() => onDelete?.(item.id)}>
            <LucideIcons.Trash2 size={18} color="red" />
          </Pressable>
        </View>
      )}
    </View>
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
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionBtn: {
    marginRight: 12,
  },
});
