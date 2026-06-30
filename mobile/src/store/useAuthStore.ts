import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as authService from "../api/authService";
import { RegisterPayload } from "../types";

interface AuthState {
  token: string | null;
  hasCompletedOnboarding: boolean;
  isLoading: boolean; // hydrate awal saat app dibuka
  isSubmitting: boolean; // loading saat proses login/register
  authError: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  hydrate: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  hasCompletedOnboarding: false,
  isLoading: true,
  isSubmitting: false,
  authError: null,

  login: async (email: string, password: string) => {
    set({ isSubmitting: true, authError: null });
    try {
      const { access_token } = await authService.login(email, password);
      await AsyncStorage.setItem("auth_token", access_token);
      set({ token: access_token, isSubmitting: false });
    } catch (err: any) {
      const message =
        err?.response?.status === 401
          ? "Email atau password salah."
          : "Gagal masuk. Cek koneksi internet kamu.";
      set({ isSubmitting: false, authError: message });
      throw err;
    }
  },

  register: async (payload: RegisterPayload) => {
  set({ isSubmitting: true, authError: null });
  try {
    const { access_token } = await authService.register(payload);
    await AsyncStorage.setItem("auth_token", access_token);
    set({ token: access_token, isSubmitting: false });
    // NOTE: backend SEKARANG auto-login setelah register (return token).
    // RootNavigator otomatis switch ke ProfileSetup begitu token ke-set.
  } catch (err: any) {
    const status = err?.response?.status;
    const message =
      status === 409
        ? "Email sudah terdaftar. Coba login langsung."
        : status === 422
        ? "Data yang dimasukkan tidak valid."
        : "Gagal mendaftar. Cek koneksi internet kamu.";
        set({ isSubmitting: false, authError: message });
        throw err;
      }
},

  logout: async () => {
    await AsyncStorage.removeItem("auth_token");
    set({ token: null, hasCompletedOnboarding: false });
  },

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),

  clearError: () => set({ authError: null }),

  hydrate: async () => {
    const token = await AsyncStorage.getItem("auth_token");
    set({ token, isLoading: false });
    // TODO: begitu integrasi Profile jalan, cek GET /profile/me di sini juga —
    // kalau profil udah ada, set hasCompletedOnboarding: true otomatis,
    // jangan andelin state lokal yang reset tiap reload.
  },
}));
