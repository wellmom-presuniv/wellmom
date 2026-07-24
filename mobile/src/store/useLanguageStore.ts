import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Language } from "../il8n/translations";

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "id",

  setLanguage: async (lang: Language) => {
    await AsyncStorage.setItem("app_language", lang);
    set({ language: lang });
  },

  hydrate: async () => {
    const saved = await AsyncStorage.getItem("app_language");
    if (saved === "id" || saved === "en") {
      set({ language: saved });
    }
  },
}));