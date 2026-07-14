import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RISK_LEVEL_CONFIG } from "@/lib/riskLevel";
import type {
  ReferralMapping,
  UpdateReferralMappingPayload,
} from "@/types";

const referralSchema = z.object({
  facility_type: z.string().min(1, "Facility type must be filled in"),
  recommendation: z.string().min(1, "Recommendation must be filled in"),
  urgency_label: z.string().min(1, "Urgency label must be filled in"),
});

type FormValues = z.infer<typeof referralSchema>;

interface ReferralFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateReferralMappingPayload) => Promise<void>;
  initialData: ReferralMapping | null; // selalu ada data — hanya edit
  isSubmitting: boolean;
}

export function ReferralFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: ReferralFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      facility_type: "",
      recommendation: "",
      urgency_label: "",
    },
  });

  // Pre-fill form dengan data existing saat dialog dibuka
  useEffect(() => {
    if (initialData) {
      reset({
        facility_type: initialData.facility_type,
        recommendation: initialData.recommendation,
        urgency_label: initialData.urgency_label,
      });
    }
  }, [initialData, reset]);

  async function handleFormSubmit(values: FormValues) {
    await onSubmit(values);
  }

  // Tampilkan badge risk level sebagai context — tidak bisa diubah
  const riskConfig = initialData
    ? RISK_LEVEL_CONFIG[initialData.risk_level]
    : null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>Edit Referral Mapping</DialogTitle>
            {riskConfig && (
              <Badge className={riskConfig.badgeClass}>
                {riskConfig.label}
              </Badge>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Risk level cannot be changed
          </p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Tipe Fasilitas */}
          <div className="space-y-1">
            <Label>Facility Type</Label>
            <Input
              {...register("facility_type")}
              placeholder="Example: Clinic / Hospital / Medical Center"
            />
            {errors.facility_type && (
              <p className="text-xs text-rose-500">
                {errors.facility_type.message}
              </p>
            )}
          </div>

          {/* Rekomendasi */}
          <div className="space-y-1">
            <Label>Recommendation</Label>
            <Textarea
              {...register("recommendation")}
              placeholder="Example: Consult immediately with a healthcare professional and have the next ANC examination earlier."
              className="resize-y"
              rows={3}
            />
            {errors.recommendation && (
              <p className="text-xs text-rose-500">
                {errors.recommendation.message}
              </p>
            )}
          </div>

          {/* Urgency Label */}
          <div className="space-y-1">
            <Label>Urgency Label</Label>
            <Input
              {...register("urgency_label")}
              placeholder="Example: Immediately / Within 24 hours / During routine ANC"
            />
            {errors.urgency_label && (
              <p className="text-xs text-rose-500">
                {errors.urgency_label.message}
              </p>
            )}
            <p className="text-xs text-slate-400">
              A short label that displays on the mobile app.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
            <p className="text-xs text-slate-500">
              <strong>Active status</strong> cannot be edited here yet.
              It will be added after the backend schema is updated.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}