import { useLanguageStore } from "../store/useLanguageStore";
import { translations, TranslationKey } from "../i18n/translations";

export function useTranslation() {
  const language = useLanguageStore((s) => s.language);
  const t = translations[language];

  // Helper buat replace placeholder {n}, {name}, dll
  const translate = (key: TranslationKey, params?: Record<string, string | number>): string => {
    let text = t[key] as string;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  return { t, translate, language };
}