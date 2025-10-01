import React, { useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { Edit3 } from "lucide-react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";

interface AvatarProps {
  size?: number;
  editable?: boolean; // if true, show edit icon
  onPress?: () => void; // can also be used for menus
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 80,
  editable = false,
  onPress,
}) => {
  const { user, fullName, profilePicture, updateProfilePicture } =
    useAuthStore();
  const [uploading, setUploading] = React.useState(false);

  const initials = useMemo(() => {
    if (!fullName) return "?";
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [fullName]);

  const pickImage = async () => {
    if (!editable) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      try {
        setUploading(true);
        const uri = result.assets[0].uri;
        const fileExt = uri.split(".").pop() || "jpg";
        const fileName = `${user?.id}_${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // ✅ Read file as base64
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: "base64",
        });

        // ✅ Upload to Supabase as binary
        const { error } = await supabase.storage
          .from("avatars")
          .upload(filePath, decode(base64), {
            contentType: `image/${fileExt}`,
            upsert: true,
          });

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        // ✅ Update local + Supabase profile
        await updateProfilePicture(publicUrl);
      } catch (e) {
        console.error("Upload error:", e);
      } finally {
        setUploading(false);
      }
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Container
        onPress={onPress || pickImage}
        style={[
          styles.container,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
          />
        ) : (
          <View
            style={[
              styles.fallback,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          >
            <Text style={[styles.initials, { fontSize: size / 2 }]}>
              {initials}
            </Text>
          </View>
        )}

        {uploading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color="#fff" />
          </View>
        )}
      </Container>

      {editable && (
        <TouchableOpacity
          style={[
            styles.editIcon,
            {
              bottom: size * 0.05,
              right: size * 0.07,
            },
          ]}
          onPress={pickImage}
        >
          <Edit3 size={18} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "#e5e7eb", // gray-200 fallback
    justifyContent: "center",
    alignItems: "center",
  },
  fallback: {
    backgroundColor: "#d1d5db", // gray-300
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "#111827", // gray-900
    fontWeight: "600",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    position: "absolute",
    backgroundColor: "#00BEC4",
    borderRadius: 20,
    padding: 8,
  },
});
