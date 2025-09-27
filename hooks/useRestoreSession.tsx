import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/store/useAuthStore";

const useRestoreSession = () => {
  useEffect(() => {
    const restore = async () => {
      const saved = await AsyncStorage.getItem("rememberMeUser");
      if (saved) {
        const { user, fullName } = JSON.parse(saved);

        useAuthStore.setState({ isLoggedIn: true, user, fullName });
      }
    };

    restore();
  }, []);
};

export default useRestoreSession;
