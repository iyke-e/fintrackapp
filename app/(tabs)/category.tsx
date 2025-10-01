import React, { useState, useRef } from "react";
import { ScrollView, StyleSheet, View, Text, Pressable } from "react-native";
import { ThemedSafeArea, ThemedText } from "@/component/ThemedComponents";
import { useAllCategories, useCategoryStore } from "@/store/useCategory";
import { CategoryItem } from "@/component/category/CategoryItem";
import { Header } from "@/component/layout/Header";
import { Button } from "@/component/ui/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import BottomSheet from "@gorhom/bottom-sheet";
import { CategorySheet } from "@/bottomsheets/CategorySheet";

export default function CategoryScreen() {
  const theme = useAppTheme();
  const categories = useAllCategories();
  const { deleteCategory } = useCategoryStore();

  const [showAllDefaults, setShowAllDefaults] = useState(false);
  const [sheetMode, setSheetMode] = useState<"add" | "edit">("add");
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const sheetRef = useRef<BottomSheet>(null);

  const defaultCategories = categories.filter((c) => c.isDefault);
  const customCategories = categories.filter((c) => !c.isDefault);

  const visibleDefaults = showAllDefaults
    ? defaultCategories
    : defaultCategories.slice(0, 3);

  const openSheet = (mode: "add" | "edit", category?: any) => {
    setSheetMode(mode);
    setSelectedCategory(category || null);
    sheetRef.current?.expand();
  };

  return (
    <ThemedSafeArea>
      <ScrollView contentContainerStyle={styles.container}>
        <Header
          onBack
          title="Categories"
          rightIcon="Plus"
          onRightPress={() => openSheet("add")}
        />

        <ThemedText style={styles.sectionTitle}>Default Categories</ThemedText>
        {visibleDefaults.map((item) => (
          <CategoryItem key={item.id} item={item} />
        ))}
        {defaultCategories.length > 5 && (
          <Pressable onPress={() => setShowAllDefaults((prev) => !prev)}>
            <Text style={styles.viewMore}>
              {showAllDefaults ? "View Less ↑" : "View More ↓"}
            </Text>
          </Pressable>
        )}

        <ThemedText style={styles.sectionTitle}>Your Categories</ThemedText>
        {customCategories.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: theme.text }]}>
              You haven’t added any custom categories yet.
            </Text>
            <Text style={[styles.emptySubText, { color: theme.subText }]}>
              Tap the + icon above or the button below to create one.
            </Text>
          </View>
        ) : (
          customCategories.map((item) => (
            <CategoryItem
              key={item.id}
              item={item}
              onDelete={deleteCategory}
              onEdit={() => openSheet("edit", item)}
            />
          ))
        )}

        <Button onPress={() => openSheet("add")}>
          <Text style={styles.addButtonText}>Add Category</Text>
        </Button>
      </ScrollView>

      <CategorySheet
        ref={sheetRef}
        mode={sheetMode}
        categoryId={selectedCategory?.id}
        initialName={selectedCategory?.name}
      />
    </ThemedSafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 18,
  },
  viewMore: {
    color: "#00BEC4",
    textAlign: "right",
    marginTop: 8,
    marginBottom: 20,
    fontWeight: "500",
  },
  emptyState: {
    marginTop: 8,
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
    color: "#6c757d",
    textAlign: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
