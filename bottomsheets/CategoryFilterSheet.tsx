import React, { forwardRef, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { ThemedText } from "@/component/ThemedComponents";
import { useAppTheme } from "@/hooks/useAppTheme";
import type { Category } from "@/store/useCategory";

interface Props {
  categories: Category[];
  onApply: (categoryId?: string) => void;
}

export const CategoryFilterSheet = forwardRef<BottomSheet, Props>(
  ({ categories, onApply }, ref) => {
    const theme = useAppTheme();
    const snapPoints = useMemo(() => ["50%"], []);

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.cardBg }}
        handleIndicatorStyle={{ backgroundColor: theme.primary }}
      >
        <BottomSheetView style={styles.container}>
          <ThemedText style={styles.header}>Select Category</ThemedText>

          <ScrollView contentContainerStyle={styles.grid}>
            <TouchableOpacity
              style={[styles.item, { borderColor: theme.border }]}
              onPress={() => {
                onApply(undefined);
                (ref as any)?.current?.close();
              }}
            >
              <ThemedText style={{ color: theme.text }}>All</ThemedText>
            </TouchableOpacity>

            {categories.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.item, { borderColor: theme.border }]}
                onPress={() => {
                  onApply(c.id);
                  (ref as any)?.current?.close();
                }}
              >
                <ThemedText style={{ color: theme.text }}>{c.name}</ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 16,
    margin: 4,
  },
});
