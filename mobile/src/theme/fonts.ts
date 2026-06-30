/**
 * NativeWind v2 tidak bisa otomatis map className font-bold/font-semibold ke
 * font custom per-weight di React Native — RN butuh nama font exact per berat.
 * Makanya font dipakai inline lewat style={{ fontFamily: fonts.bold }}, bukan className,
 * khusus untuk Text yang representasinya penting (heading, judul, label besar).
 * Body text biasa cukup pakai default system font, ga perlu maksa Plus Jakarta Sans semua.
 */
export const fonts = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold",
};
