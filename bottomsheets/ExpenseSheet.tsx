import React, {
  forwardRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  StyleSheet,
  Alert,
  View,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import BottomSheet, {
  BottomSheetTextInput,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import { useAllCategories } from "@/store/useCategory";
import { ThemedText } from "@/component/ThemedComponents";
import { Button } from "@/component/ui/Button";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useExpenseStore } from "@/store/useExpenseStore";

interface Props {
  onClose: () => void;
}

type RefProp = BottomSheet;

export const AddExpenseBottomSheet = forwardRef<RefProp, Props>(
  ({ onClose }, ref) => {
    const theme = useAppTheme();
    const categories = useAllCategories();
    const addExpense = useExpenseStore((s) => s.addExpense);

    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [categoryId, setCategoryId] = useState<string>(
      categories[0]?.id || ""
    );
    const [note, setNote] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [date, setDate] = useState<Date>(new Date());
    const [pickerVisible, setPickerVisible] = useState(false);

    useEffect(() => {
      if (!categoryId && categories.length) setCategoryId(categories[0].id);
    }, [categories, categoryId]);

    const snapPoints = useMemo(() => ["75%", "100%"], []);

    const handleSubmit = useCallback(() => {
      Keyboard.dismiss();

      const amountNum = parseFloat(amount);
      if (!title.trim()) return Alert.alert("Title required", "Enter a title.");
      if (!Number.isFinite(amountNum) || amountNum <= 0)
        return Alert.alert("Invalid amount", "Enter a valid amount > 0.");
      if (!categoryId)
        return Alert.alert("Category required", "Select a category.");

      addExpense({
        title: title.trim(),
        categoryId,
        amount: amountNum,
        note: note || undefined,
        paymentMethod: paymentMethod || undefined,
        date,
      });

      // Reset
      setTitle("");
      setAmount("");
      setNote("");
      setPaymentMethod("");
      setDate(new Date());
      onClose();
    }, [
      title,
      amount,
      categoryId,
      note,
      paymentMethod,
      addExpense,
      date,
      onClose,
    ]);

    return (
      <BottomSheet
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: theme.cardBg }}
        handleIndicatorStyle={{ backgroundColor: theme.primary }}
      >
        <BottomSheetScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
        >
          <ThemedText style={styles.header}>Add Expense</ThemedText>

          {/* Title */}
          <ThemedText style={styles.label}>Title</ThemedText>
          <BottomSheetTextInput
            style={[
              styles.input,
              { borderColor: theme.border, color: theme.text },
            ]}
            placeholder="e.g. Grocery shopping"
            placeholderTextColor={theme.subText}
            value={title}
            onChangeText={setTitle}
          />

          {/* Amount */}
          <ThemedText style={styles.label}>Amount</ThemedText>
          <BottomSheetTextInput
            style={[
              styles.input,
              { borderColor: theme.border, color: theme.text },
            ]}
            keyboardType="numeric"
            placeholder="0.00"
            placeholderTextColor={theme.subText}
            value={amount}
            onChangeText={setAmount}
          />

          {/* Category Picker */}
          <ThemedText style={styles.label}>Category</ThemedText>
          <View
            style={[styles.pickerContainer1, { borderColor: theme.border }]}
          >
            <Picker
              selectedValue={categoryId}
              onValueChange={(value) => setCategoryId(String(value))}
              style={{ color: theme.text }}
              dropdownIconColor={theme.text}
            >
              {categories.map((c) => (
                <Picker.Item key={c.id} label={c.name} value={c.id} />
              ))}
            </Picker>
          </View>

          {/* Date */}
          <ThemedText style={styles.label}>Date</ThemedText>
          <View style={[styles.pickerContainer, { borderColor: theme.border }]}>
            <TouchableOpacity
              style={{ justifyContent: "center" }}
              onPress={() => setPickerVisible(true)}
            >
              <ThemedText style={{ color: theme.text }}>
                {date.toDateString()}
              </ThemedText>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={pickerVisible}
              mode="date"
              date={date}
              onConfirm={(d) => {
                setDate(d);
                setPickerVisible(false);
              }}
              onCancel={() => setPickerVisible(false)}
            />
          </View>

          {/* Note */}
          <ThemedText style={styles.label}>Note (optional)</ThemedText>
          <BottomSheetTextInput
            style={[
              styles.input,
              { borderColor: theme.border, color: theme.text },
            ]}
            placeholder="e.g. Bought snacks for trip"
            placeholderTextColor={theme.subText}
            value={note}
            onChangeText={setNote}
          />

          {/* Payment Method */}
          <ThemedText style={styles.label}>
            Payment Method (optional)
          </ThemedText>
          <BottomSheetTextInput
            style={[
              styles.input,
              { borderColor: theme.border, color: theme.text },
            ]}
            placeholder="e.g. Cash, Card"
            placeholderTextColor={theme.subText}
            value={paymentMethod}
            onChangeText={setPaymentMethod}
          />

          <Button style={styles.addBtn} onPress={handleSubmit}>
            Add Expense
          </Button>
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 24 },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  label: { fontWeight: "500", marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  pickerContainer1: {
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  pickerContainer: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    overflow: "hidden",
  },
  addBtn: { marginTop: 16 },
});
