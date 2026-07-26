import AsyncStorage from "@react-native-async-storage/async-storage";
import { MonitoringHistoryEntry, MonitoringHistoryType } from "../types/monitoring";

// Fallback lokal buat monitoring janin (berat, lingkar kepala, BB/TB ibu) di trimester 1 & 2.
// Backend (app/services/monitoring_service.py::_require_trimester_three_profile) masih hard-block
// endpoint-endpoint itu buat non-T3 (throw 422) — belum di-update Alek. Karena diminta gak boleh
// ubah backend, entry non-T3 disimpan di sini dulu supaya tetap "tersimpan sebagai riwayat" di UI.
//
// Catatan penting: entry di sini TIDAK pernah ke-sync ke server. Begitu backend beneran support
// semua trimester, kode ini harus dicabut dan data lama di sini idealnya di-migrasi manual.

const STORAGE_PREFIX = "monitoring_local_v1_";

function generateLocalId() {
  return `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export async function saveLocalMonitoringEntry(
  type: MonitoringHistoryType,
  fields: Partial<MonitoringHistoryEntry>
): Promise<MonitoringHistoryEntry> {
  const entry: MonitoringHistoryEntry = {
    record_id: generateLocalId(),
    date: todayIso(),
    type,
    ...fields,
  };

  const existing = await getLocalMonitoringHistory(type);
  const updated = [entry, ...existing].slice(0, 30);

  try {
    await AsyncStorage.setItem(STORAGE_PREFIX + type, JSON.stringify(updated));
  } catch (err) {
    console.warn(`Gagal simpan riwayat lokal ${type}:`, err);
  }

  return entry;
}

export async function getLocalMonitoringHistory(type: MonitoringHistoryType): Promise<MonitoringHistoryEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_PREFIX + type);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn(`Gagal ambil riwayat lokal ${type}:`, err);
    return [];
  }
}

export function isLocalMonitoringId(id: string): boolean {
  return id.startsWith("local-");
}

export async function removeLocalMonitoringEntry(type: MonitoringHistoryType, recordId: string): Promise<void> {
  const existing = await getLocalMonitoringHistory(type);
  const updated = existing.filter((entry) => entry.record_id !== recordId);
  try {
    await AsyncStorage.setItem(STORAGE_PREFIX + type, JSON.stringify(updated));
  } catch (err) {
    console.warn(`Gagal hapus riwayat lokal ${type}:`, err);
  }
}
