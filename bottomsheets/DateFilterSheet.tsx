import React, { useMemo, useState, forwardRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAppTheme } from "@/hooks/useAppTheme";
import { Button } from "@/component/ui/Button";

type DateFilterSheetProps = {
  onApply: (filter: {
    month?: number;
    startDate?: Date;
    endDate?: Date;
  }) => void;
};

export const DateFilterSheet = forwardRef<BottomSheet, DateFilterSheetProps>(
  ({ onApply }, ref) => {
    const theme = useAppTheme();
    const snapPoints = useMemo(() => ["60%"], []);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const [selectedMonth, setSelectedMonth] = useState<number | undefined>();
    const [startDate, setStartDate] = useState<Date | undefined>();
    const [endDate, setEndDate] = useState<Date | undefined>();
    const [pickerVisible, setPickerVisible] = useState<{
      type: "start" | "end" | null;
    }>({ type: null });

    const handleConfirm = (date: Date) => {
      // reset month selection if picking a specific date
      setSelectedMonth(undefined);

      if (pickerVisible.type === "start") setStartDate(date);
      if (pickerVisible.type === "end") setEndDate(date);
      setPickerVisible({ type: null });
    };

    const handleMonthPress = (index: number) => {
      setSelectedMonth(selectedMonth === index ? undefined : index);
      // clear specific dates if a month is chosen
      setStartDate(undefined);
      setEndDate(undefined);
    };

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
          <Text style={[styles.header, { color: theme.text }]}>
            Filter by Date
          </Text>

          {/* Months flex wrap */}
          <View style={styles.monthsWrapper}>
            {months.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.monthBtn,
                  {
                    backgroundColor:
                      selectedMonth === index ? theme.primary : theme.cardBg,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => handleMonthPress(index)}
              >
                <Text
                  style={{
                    color: selectedMonth === index ? "#fff" : theme.text,
                    fontSize: 13,
                  }}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Start & End Date */}
          <View style={styles.datesWrapper}>
            <TouchableOpacity
              style={[styles.dateBtn, { borderColor: theme.border }]}
              onPress={() => setPickerVisible({ type: "start" })}
            >
              <Text style={{ color: theme.text }}>
                {startDate ? startDate.toDateString() : "Select Start Date"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.dateBtn, { borderColor: theme.border }]}
              onPress={() => setPickerVisible({ type: "end" })}
            >
              <Text style={{ color: theme.text }}>
                {endDate ? endDate.toDateString() : "Select End Date"}
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            style={styles.applyBtn}
            onPress={() => {
              onApply({ month: selectedMonth, startDate, endDate });
              (ref as any)?.current?.close();
            }}
          >
            Apply
          </Button>
        </BottomSheetView>

        <DateTimePickerModal
          isVisible={pickerVisible.type !== null}
          mode="date"
          date={
            pickerVisible.type === "start"
              ? startDate || new Date()
              : endDate || new Date()
          }
          onConfirm={handleConfirm}
          onCancel={() => setPickerVisible({ type: null })}
        />
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 20 },
  header: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  monthsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  monthBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    margin: 4,
  },
  datesWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  dateBtn: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
  },
  applyBtn: { marginTop: 20 },
});
