/**
 * Design tokens — WellMom
 * Sumber warna tunggal untuk dipakai di tempat yang butuh JS value langsung
 * (mis. style prop dinamis, icon color, LinearGradient).
 * Untuk styling lewat className, pakai token yang sama di tailwind.config.js.
 */
/**
 * Design tokens — WellMom ("Serene Glow")
 * Sumber: Stitch AI design system (DESIGN.md), dengan beberapa fix konsistensi:
 * - DESIGN.md dijadikan single source of truth (code.html dashboard & onboarding
 *   punya beberapa token yang sedikit beda satu sama lain — dianggap kesalahan generate)
 * - Medium-risk tetap pakai amber (bukan pink/rose seperti di screenshot Riwayat),
 *   demi konsistensi konvensi traffic-light hijau/kuning/merah yang lebih universal
 *   dipahami untuk sinyal risiko kesehatan.
 */
export const colors = {
  primary: "#B10E6B",
  primaryContainer: "#D23284", // dipakai untuk gradient end / aksen lebih terang
  onPrimary: "#FFFFFF",
  secondary: "#712AE2",
  secondaryContainer: "#8A4CFC",
  onSecondary: "#FFFFFF",
  background: "#FFF8F8",
  surface: "#FFFFFF",
  surfaceContainer: "#FFE8EE", // bg lembut untuk tile menu, dsb
  surfaceContainerLow: "#FFF0F3",
  outline: "#8B7079",
  outlineVariant: "#DEBEC8", // border halus di atas surface
  textPrimary: "#25181D",
  textSecondary: "#574048",

  // Risk categories — tetap traffic-light hijau/kuning/merah untuk kejelasan & aksesibilitas
  riskLow: "#136B00",
  riskLowBg: "rgba(19, 107, 0, 0.1)",
  riskMedium: "#B45309", // amber, BUKAN pink seperti contoh Stitch — sengaja diubah
  riskMediumBg: "rgba(180, 83, 9, 0.1)",
  riskHigh: "#BA1A1A",
  riskHighBg: "rgba(186, 26, 26, 0.1)",
};

export type RiskCategory = "LOW" | "MEDIUM" | "HIGH";

export const riskCategoryStyle: Record<RiskCategory, { color: string; bg: string; label: string }> = {
  LOW: { color: colors.riskLow, bg: colors.riskLowBg, label: "Risiko Rendah" },
  MEDIUM: { color: colors.riskMedium, bg: colors.riskMediumBg, label: "Risiko Sedang" },
  HIGH: { color: colors.riskHigh, bg: colors.riskHighBg, label: "Risiko Tinggi" },
};

