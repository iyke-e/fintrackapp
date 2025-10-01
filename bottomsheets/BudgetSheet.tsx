import React, { forwardRef, useMemo, useCallback } from "react";
import { View, StyleSheet, Alert, Keyboard } from "react-native";
import BottomSheet, {
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/component/ui/Button";
import { ThemedText } from "@/component/ThemedComponents";
import { useExpenseStore } from "@/store/useExpenseStore";
import { useAppTheme } from "@/hooks/useAppTheme";

type RefProp = BottomSheet;

interface SetBudgetBottomSheetProps {
  onClose?: () => void;
}

export const SetBudgetBottomSheet = forwardRef<
  RefProp,
  SetBudgetBottomSheetProps
>(({ onClose }, ref) => {
  const { budget, setBudget } = useExpenseStore();
  const snapPoints = useMemo(() => ["30%"], []);
  const theme = useAppTheme();

  const { control, handleSubmit } = useForm({
    defaultValues: { budget: budget.toString() },
  });

  const onSubmit = useCallback(
    (data: { budget: string }) => {
      const value = parseFloat(data.budget);
      Keyboard.dismiss();
      if (isNaN(value) || value < 0) {
        Alert.alert("Invalid budget", "Please enter a valid number ≥ 0");
        return;
      }
      setBudget(value);
      (ref as any)?.current?.close();
      onClose?.();
    },
    [setBudget, ref, onClose]
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
        <ThemedText style={styles.header}>Set Monthly Budget</ThemedText>

        <View style={styles.formWrapper}>
          <Controller
            control={control}
            name="budget"
            render={({ field: { value, onChange, onBlur } }) => (
              <BottomSheetTextInput
                placeholder="Enter budget amount"
                placeholderTextColor={theme.subText}
                style={{
                  borderWidth: 1,
                  borderColor: theme.border,
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  borderRadius: 12,
                  color: theme.text,
                }}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="numeric"
              />
            )}
          />

          <Button style={styles.saveBtn} onPress={handleSubmit(onSubmit)}>
            Save
          </Button>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

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
    marginBottom: 24,
    textAlign: "center",
  },
  formWrapper: {
    gap: 16,
  },
  saveBtn: {
    marginTop: 16,
  },
});
