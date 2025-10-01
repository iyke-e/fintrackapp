// bottomsheets/CategorySheet.tsx
import React, { forwardRef, useMemo, useCallback } from "react";
import { View, StyleSheet, Keyboard } from "react-native";
import BottomSheet, {
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/component/ui/Button";
import { ThemedText } from "@/component/ThemedComponents";
import { useCategoryStore, defaultCategories } from "@/store/useCategory";
import { useAppTheme } from "@/hooks/useAppTheme";

const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategorySheetProps {
  mode: "add" | "edit";
  categoryId?: string;
  initialName?: string;
}

type RefProp = BottomSheet;

export const CategorySheet = forwardRef<RefProp, CategorySheetProps>(
  ({ mode, categoryId, initialName = "" }, ref) => {
    const { addCategory, editCategory } = useCategoryStore();
    const snapPoints = useMemo(() => ["30%"], []);
    const theme = useAppTheme();

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<CategoryFormData>({
      resolver: zodResolver(categorySchema),
      defaultValues: { name: initialName },
    });

    const getRandomAttribute = <T extends keyof (typeof defaultCategories)[0]>(
      key: T
    ) =>
      defaultCategories[Math.floor(Math.random() * defaultCategories.length)][
        key
      ];

    const onSubmit = useCallback(
      (data: CategoryFormData) => {
        Keyboard.dismiss();

        const name = data.name.trim();
        if (!name) return;

        let success = false;
        if (mode === "add") {
          success = addCategory({
            id: uuidv4(),
            name,
            color: getRandomAttribute("color"),
            icon: getRandomAttribute("icon"),
            isDefault: false,
          });
        } else if (mode === "edit" && categoryId) {
          success = editCategory(categoryId, { name });
        }

        if (success) {
          reset();
          (ref as any)?.current?.close();
        } else {
          alert(`Category "${name}" already exists`);
        }
      },
      [addCategory, editCategory, categoryId, mode, ref, reset]
    );

    return (
      <BottomSheet
        backgroundStyle={{ backgroundColor: theme.cardBg }}
        handleIndicatorStyle={{ backgroundColor: theme.primary }}
        enablePanDownToClose
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
      >
        <BottomSheetView style={styles.container}>
          <ThemedText style={styles.header}>
            {mode === "add" ? "Add New Category" : "Edit Category"}
          </ThemedText>
          <Controller
            control={control}
            name="name"
            render={({ field: { value, onChange, onBlur } }) => (
              <BottomSheetTextInput
                placeholder="Category Name"
                placeholderTextColor={theme.subText}
                style={{
                  borderWidth: 1,
                  borderColor: errors.name ? "red" : theme.border,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  color: theme.text,
                }}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          <Button
            style={styles.addBtn}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : mode === "add"
              ? "Add Category"
              : "Save Changes"}
          </Button>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 48,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  addBtn: {
    marginTop: 16,
  },
});
