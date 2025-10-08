import React, { useMemo, useState } from "react";
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
import { Edit3 } from "lucide-react-native";
import { useAuthStore } from "@/store/useAuthStore";
import { supabase } from "@/lib/supabase";

interface AvatarProps {
  size?: number;
  editable?: boolean;
  onPress?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  size = 80,
  editable = false,
  onPress,
}) => {
  const { user, fullName, profilePicture, updateProfilePicture } =
    useAuthStore();
  const [uploading, setUploading] = useState(false);

  const initials = useMemo(() => {
    if (!fullName) return "?";
    const parts = fullName.trim().split(" ");
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  }, [fullName]);

  const pickImage = async () => {
    if (!editable) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled) return;

    try {
      setUploading(true);

      const asset = result.assets[0];
      const uri = asset.uri;

      // ✅ Read file as base64, then convert to bytes
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileBytes = new Uint8Array(
        atob(base64)
          .split("")
          .map((c) => c.charCodeAt(0))
      );

      const fileExt = (uri.split(".").pop() || "jpg").toLowerCase();
      const fileName = `${user?.id ?? "anon"}_${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const contentType = `image/${fileExt === "jpg" ? "jpeg" : fileExt}`;

      // ✅ Upload to Supabase Storage
      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, fileBytes, {
          contentType,
          upsert: true,
        });

      if (error) throw error;

      // ✅ Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      if (data?.publicUrl) {
        await updateProfilePicture(data.publicUrl);
        console.log("Avatar uploaded ->", data.publicUrl);
      }
    } catch (e) {
      console.error("Upload error:", e);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <TouchableOpacity
        onPress={onPress || pickImage}
        disabled={!editable && !onPress}
        style={[
          styles.container,
          { width: size, height: size, borderRadius: size / 2 },
        ]}
      >
        {profilePicture ? (
          <Image
            source={{ uri: profilePicture }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
            onError={(e) =>
              console.warn("Avatar image load error:", e.nativeEvent)
            }
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
      </TouchableOpacity>

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
    backgroundColor: "#e5e7eb",
    justifyContent: "center",
    alignItems: "center",
  },
  fallback: {
    backgroundColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  initials: {
    color: "#111827",
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
