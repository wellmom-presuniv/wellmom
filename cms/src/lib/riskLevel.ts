import type { RiskLevel } from "@/types";

// -------------------------------------------------------
// Config visual per risk level — dipakai di form dan tabel
// Satu sumber kebenaran untuk label dan warna
// -------------------------------------------------------
export const RISK_LEVEL_CONFIG: Record<
  RiskLevel,
  {
    label: string;           // label human-readable untuk Chelsea
    badgeClass: string;      // Tailwind class untuk badge warna
    rowClass: string;        // Tailwind class untuk row background
  }
> = {
  LOW: {
    label: "Low Risk",
    badgeClass: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    rowClass: "bg-emerald-50/30",
  },
  MEDIUM: {
    label: "Medium Risk",
    badgeClass: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    rowClass: "bg-amber-50/30",
  },
  HIGH: {
    label: "High Risk",
    badgeClass: "bg-rose-100 text-rose-700 hover:bg-rose-100",
    rowClass: "bg-rose-50/30",
  },
};

// Urutan tampil di tabel — LOW dulu, MEDIUM, baru HIGH
export const RISK_LEVEL_ORDER: RiskLevel[] = ["LOW", "MEDIUM", "HIGH"];