import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as authService from "../api/authService";
import { RegisterPayload } from "../types";

interface AuthState {
  userName: string | null;
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
  userName: null,
  token: null,
  hasCompletedOnboarding: false,
  isLoading: true,
  isSubmitting: false,
  authError: null,

  login: async (email: string, password: string) => {
    set({ isSubmitting: true, authError: null });
    try {
      const { access_token, full_name } = await authService.login(email, password);
      await AsyncStorage.setItem("auth_token", access_token);
      await AsyncStorage.setItem("user_name", full_name ?? "");
      
      // Cek profil setelah login — tentuin apakah perlu Onboarding atau langsung Home
      let hasProfile = false;
      try {
        const { getMyProfile } = await import("../api/profileService");
        await getMyProfile();
        hasProfile = true;
      } catch {
        hasProfile = false;
      }

      set({ token: access_token, userName: full_name ?? null, hasCompletedOnboarding: hasProfile, isSubmitting: false });
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
      const { access_token, full_name } = await authService.register(payload);
      await AsyncStorage.setItem("auth_token", access_token);
      await AsyncStorage.setItem("user_name", full_name ?? "");
      
      let hasProfile = false;
      try {
        const { getMyProfile } = await import("../api/profileService");
        await getMyProfile();
        hasProfile = true;
      } catch {
        hasProfile = false;
      }
   
      set({ token: access_token, userName: full_name ?? null, hasCompletedOnboarding: hasProfile, isSubmitting: false });      // NOTE: backend SEKARANG auto-login setelah register (return token).
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
    await AsyncStorage.removeItem("user_name");
    set({ token: null, hasCompletedOnboarding: false, userName: null });
  },

  completeOnboarding: () => set({ hasCompletedOnboarding: true }),

  clearError: () => set({ authError: null }),

  hydrate: async () => {
    const [token, userName] = await Promise.all([
      AsyncStorage.getItem("auth_token"),
      AsyncStorage.getItem("user_name"),
    ]);

    if (!token) {
      set({ token: null, isLoading: false });
      return;
    }

    try {
      const { getMyProfile } = await import("../api/profileService");
      await getMyProfile();
      set({ token, userName: userName || null, hasCompletedOnboarding: true, isLoading: false });
    } catch (err: any) {
      // SEBELUM: set token expired ke store → bypass login
      // SESUDAH: kalau 401, hapus token → paksa login ulang
      if (err?.response?.status === 401) {
        await AsyncStorage.removeItem("auth_token");
        await AsyncStorage.removeItem("user_name");
        set({ token: null, userName: null, hasCompletedOnboarding: false, isLoading: false });
      } else {
        // Error lain (network, dll) — tetap masuk tapi ke ProfileSetup
        set({ token, userName: userName || null, hasCompletedOnboarding: false, isLoading: false });
      }
    }
  },
}));
