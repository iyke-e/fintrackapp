import React from "react";
import { Modal, View, Pressable, Text, StyleSheet } from "react-native";
import { useAppTheme } from "@/hooks/useAppTheme";

interface ThemeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (theme: "light" | "dark" | "system") => void;
}

export const ThemeModal = ({ visible, onClose, onSelect }: ThemeModalProps) => {
  const theme = useAppTheme();

  return (
    <Modal transparent visible={visible} animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.container, { backgroundColor: theme.cardBg }]}>
          {["light", "dark", "system"].map((t) => (
            <Pressable
              key={t}
              style={({ pressed }) => [
                styles.option,
                { backgroundColor: pressed ? "#3f404138" : "transparent" },
              ]}
              onPress={() => {
                onSelect(t as "light" | "dark" | "system");
                onClose();
              }}
            >
              <Text style={{ color: theme.text, fontSize: 16 }}>
                {t[0].toUpperCase() + t.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "#00000055",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 250,
    borderRadius: 12,
    paddingVertical: 16,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
