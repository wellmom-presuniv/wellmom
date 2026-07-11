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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RISK_LEVEL_CONFIG, RISK_LEVEL_ORDER } from "@/lib/riskLevel";
import type {
  ReferralMapping,
  CreateReferralMappingPayload,
  RiskLevel,
} from "@/types";

const referralSchema = z.object({
  risk_level: z.enum(["LOW", "MEDIUM", "HIGH"]),
  facility_type: z.string().min(1, "Facility type must be filled in"),
  recommendation: z.string().min(1, "Recommendation must be filled in"),
  urgency_label: z.string().min(1, "Urgency label must be filled in"),
  is_active: z.boolean(),
});

type FormValues = z.infer<typeof referralSchema>;

interface ReferralFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateReferralMappingPayload) => Promise<void>;
  initialData?: ReferralMapping | null;
  isSubmitting: boolean;
}

export function ReferralFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: ReferralFormDialogProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(referralSchema),
    defaultValues: {
      risk_level: "LOW",
      facility_type: "",
      recommendation: "",
      urgency_label: "",
      is_active: true,
    },
  });

  const riskLevelValue = watch("risk_level");
  const isActiveValue = watch("is_active");

  useEffect(() => {
    if (initialData) {
      reset({
        risk_level: initialData.risk_level,
        facility_type: initialData.facility_type,
        recommendation: initialData.recommendation,
        urgency_label: initialData.urgency_label,
        is_active: initialData.is_active,
      });
    } else {
      reset({
        risk_level: "LOW",
        facility_type: "",
        recommendation: "",
        urgency_label: "",
        is_active: true,
      });
    }
  }, [initialData, reset]);

  async function handleFormSubmit(values: FormValues) {
    await onSubmit(values as CreateReferralMappingPayload);
  }

  const selectedConfig = RISK_LEVEL_CONFIG[riskLevelValue];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Mapping Referral" : "Add Referral Mapping"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Risk Level */}
          <div className="space-y-1">
            <Label>Risk Level</Label>
            {/*
              Select pakai onValueChange + setValue karena komponen
              shadcn kustom — tidak bisa pakai register() biasa
            */}
            <Select
              defaultValue={initialData?.risk_level ?? "LOW"}
              onValueChange={(val) =>
                setValue("risk_level", val as RiskLevel)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select risk level" />
              </SelectTrigger>
              <SelectContent>
                {RISK_LEVEL_ORDER.map((level) => (
                  <SelectItem key={level} value={level}>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={RISK_LEVEL_CONFIG[level].badgeClass}
                      >
                        {RISK_LEVEL_CONFIG[level].label}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.risk_level && (
              <p className="text-xs text-rose-500">
                {errors.risk_level.message}
              </p>
            )}
            {/* Preview badge kategori yang dipilih */}
            <div className="flex items-center gap-1 pt-1">
              <span className="text-xs text-slate-400">Selected:</span>
              <Badge className={selectedConfig.badgeClass}>
                {selectedConfig.label}
              </Badge>
            </div>
          </div>

          {/* Tipe Fasilitas */}
          <div className="space-y-1">
            <Label>Facility Type</Label>
            <Input
              {...register("facility_type")}
              placeholder="Facility type"
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
            {/*
              Textarea karena isi rekomendasi medis bisa panjang
              Chelsea perlu ruang untuk tulis instruksi lengkap
            */}
            <Textarea
              {...register("recommendation")}
              placeholder="Example: Immediately consult with a healthcare provider and have the next ANC examination earlier."
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
              placeholder="Example: Immediated / Within 24 hours / At routine ANC"
            />
            {errors.urgency_label && (
              <p className="text-xs text-rose-500">
                {errors.urgency_label.message}
              </p>
            )}
            <p className="text-xs text-slate-400">
              Short label displayed in the mobile app as an indicator of how
              quickly pregnant women should go to health facilities.
            </p>
          </div>

          {/* Status */}
          <div className="space-y-1">
            <Label>Status</Label>
            <div className="flex items-center gap-3 pt-1">
              <Switch
                checked={isActiveValue}
                onCheckedChange={(checked) =>
                  setValue("is_active", checked)
                }
              />
              <div>
                <p className="text-sm text-slate-700">
                  {isActiveValue ? "Active" : "Non-active"}
                </p>
                <p className="text-xs text-slate-400">
                  {isActiveValue
                    ? "This mapping will be displayed in the assessment results."
                    : "This mapping will not be displayed."}
                </p>
              </div>
            </div>
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
            {isSubmitting
              ? "Saving..."
              : isEdit
              ? "Update Mapping"
              : "Add Mapping"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}