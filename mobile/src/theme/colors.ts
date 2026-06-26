/**
 * Design tokens — WellMom
 * Sumber warna tunggal untuk dipakai di tempat yang butuh JS value langsung
 * (mis. style prop dinamis, icon color, LinearGradient).
 * Untuk styling lewat className, pakai token yang sama di tailwind.config.js.
 */
export const colors = {
  primary: "#EC4899",
  primaryDark: "#BE185D",
  primaryLight: "#FBCFE8",
  secondary: "#7C3AED",
  secondaryLight: "#EDE9FE",
  background: "#FFF5F9",
  surface: "#FFFFFF",
  border: "#F3D4E3",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  riskLow: "#16A34A",
  riskLowBg: "#DCFCE7",
  riskMedium: "#F59E0B",
  riskMediumBg: "#FEF3C7",
  riskHigh: "#DC2626",
  riskHighBg: "#FEE2E2",
};

export type RiskCategory = "LOW" | "MEDIUM" | "HIGH";

export const riskCategoryStyle: Record<RiskCategory, { color: string; bg: string; label: string }> = {
  LOW: { color: colors.riskLow, bg: colors.riskLowBg, label: "Risiko Rendah" },
  MEDIUM: { color: colors.riskMedium, bg: colors.riskMediumBg, label: "Risiko Sedang" },
  HIGH: { color: colors.riskHigh, bg: colors.riskHighBg, label: "Risiko Tinggi" },
};
