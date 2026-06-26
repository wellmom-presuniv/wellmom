import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthState {
  token: string | null;
  hasCompletedOnboarding: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  hydrate: () => Promise<void>;
}

// NOTE: ini stub — belum konek ke endpoint asli Alek.
// Begitu API auth ready, isi logic login/register di sini dengan call axios client.
export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  hasCompletedOnboarding: false,
  isLoading: true,

  login: async (token: string) => {
    await AsyncStorage.setItem("auth_token", token);
    set({ token });
  },

  logout: async () => {
    await AsyncStorage.removeItem("auth_token");
    set({ token: null, hasCompletedOnboarding: false });
  },

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),

  hydrate: async () => {
    const token = await AsyncStorage.getItem("auth_token");
    set({ token, isLoading: false });
  },
}));
