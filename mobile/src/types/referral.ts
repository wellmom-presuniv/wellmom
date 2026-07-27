export interface ReferralResponse {
  mapping_id: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  facility_type: string;
  recommendation: string;
  urgency_label: string;
  is_active: boolean;
}
