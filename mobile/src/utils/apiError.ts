// Mengubah error axios jadi pesan yang bisa ditampilkan.
// - detail string (HTTPException FastAPI) dipakai apa adanya.
// - detail array (422 validasi Pydantic) diambil dari msg tiap item.
// - networkFallback hanya dipakai kalau tidak ada response dari server.
export function getApiErrorMessage(err: any, networkFallback: string): string {
  const response = err?.response;
  if (!response) return networkFallback;

  const detail = response.data?.detail;
  if (typeof detail === "string" && detail) return detail;

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => (typeof item === "string" ? item : item?.msg))
      .filter((msg): msg is string => typeof msg === "string" && msg.length > 0);
    if (messages.length > 0) return messages.join("; ");
  }

  return networkFallback;
}
