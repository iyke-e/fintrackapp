import React, { forwardRef, useMemo, useCallback, useEffect } from "react";
import { StyleSheet, Keyboard } from "react-native";
import BottomSheet, {
  BottomSheetTextInput,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/component/ui/Button";
import { ThemedText } from "@/component/ThemedComponents";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useExpenseStore } from "@/store/useExpenseStore";

const expenseSchema = z.object({
  title: z.string().min(2, "Title is required"),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Enter valid amount"),
  note: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

interface EditExpenseSheetProps {
  expenseId: string | null;
}

type RefProp = BottomSheet;

export const EditExpenseSheet = forwardRef<RefProp, EditExpenseSheetProps>(
  ({ expenseId }, ref) => {
    const theme = useAppTheme();
    const { expenses, editExpense } = useExpenseStore();
    const snapPoints = useMemo(() => ["50%"], []);

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors, isSubmitting },
    } = useForm<ExpenseFormData>({
      resolver: zodResolver(expenseSchema),
      defaultValues: { title: "", amount: "", note: "" },
    });

    useEffect(() => {
      if (expenseId) {
        const exp = expenses.find((e) => e.id === expenseId);
        if (exp) {
          reset({
            title: exp.title,
            amount: String(exp.amount),
            note: exp.note || "",
          });
        }
      }
    }, [expenseId, expenses, reset]);

    const onSubmit = useCallback(
      (data: ExpenseFormData) => {
        Keyboard.dismiss();
        if (!expenseId) return;

        const success = editExpense(expenseId, {
          title: data.title.trim(),
          amount: parseFloat(data.amount),
          note: data.note,
        });

        if (success) {
          reset();
          (ref as any)?.current?.close();
        }
      },
      [editExpense, expenseId, ref, reset]
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
          <ThemedText style={styles.header}>Edit Transaction</ThemedText>

          {/* Title */}
          <Controller
            control={control}
            name="title"
            render={({ field: { value, onChange, onBlur } }) => (
              <BottomSheetTextInput
                placeholder="Title"
                placeholderTextColor={theme.subText}
                style={[
                  styles.input,
                  {
                    borderColor: errors.title ? "red" : theme.border,
                    color: theme.text,
                  },
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.title && (
            <ThemedText style={styles.error}>{errors.title.message}</ThemedText>
          )}

          {/* Amount */}
          <Controller
            control={control}
            name="amount"
            render={({ field: { value, onChange, onBlur } }) => (
              <BottomSheetTextInput
                placeholder="Amount"
                keyboardType="numeric"
                placeholderTextColor={theme.subText}
                style={[
                  styles.input,
                  {
                    borderColor: errors.amount ? "red" : theme.border,
                    color: theme.text,
                  },
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />
          {errors.amount && (
            <ThemedText style={styles.error}>
              {errors.amount.message}
            </ThemedText>
          )}

          {/* Note */}
          <Controller
            control={control}
            name="note"
            render={({ field: { value, onChange, onBlur } }) => (
              <BottomSheetTextInput
                placeholder="Note (optional)"
                placeholderTextColor={theme.subText}
                style={[
                  styles.input,
                  { borderColor: theme.border, color: theme.text },
                ]}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

          <Button
            style={styles.saveBtn}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
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
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 10,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginBottom: 8,
  },
  saveBtn: {
    marginTop: 16,
  },
});
