import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NotificationState {
  notificationsEnabled: boolean;
  isHydrated: boolean;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  hydrate: () => Promise<void>;
}

const STORAGE_KEY = "notifications_enabled";

export const useNotificationStore = create<NotificationState>((set) => ({
  notificationsEnabled: true,
  isHydrated: false,

  setNotificationsEnabled: async (enabled) => {
    await AsyncStorage.setItem(STORAGE_KEY, enabled ? "1" : "0");
    set({ notificationsEnabled: enabled });
  },

  hydrate: async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    set({ notificationsEnabled: saved !== "0", isHydrated: true });
  },
}));
