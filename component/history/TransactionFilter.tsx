import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Tag, Calendar, X } from "lucide-react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

interface Props {
  onCategoryPress: () => void;
  onDatePress: () => void;
  onClearFilters: () => void;
}

export function FilterTabs({
  onCategoryPress,
  onDatePress,
  onClearFilters,
}: Props) {
  const theme = useAppTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.tab, { borderColor: theme.border }]}
        onPress={onCategoryPress}
      >
        <Tag size={16} color={theme.text} />
        <Text style={[styles.tabText, { color: theme.text }]}>Category</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, { borderColor: theme.border }]}
        onPress={onDatePress}
      >
        <Calendar size={16} color={theme.text} />
        <Text style={[styles.tabText, { color: theme.text }]}>Date</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, { borderColor: theme.border }]}
        onPress={onClearFilters}
      >
        <X size={16} color={theme.text} />
        <Text style={[styles.tabText, { color: theme.text }]}>
          Clear Filter
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    marginBottom: 24,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
