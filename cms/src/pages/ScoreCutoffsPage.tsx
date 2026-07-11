import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { scoreCutoffsApi } from "@/api/scoreCutoffs";

// -------------------------------------------------------
// Schema only needs two values:
// low_max and medium_max
// The rest are derived mathematically
//
// Additional validation via .refine():
// medium_max must be greater than low_max
// to avoid gaps or overlaps between categories
// -------------------------------------------------------
const cutoffSchema = z
  .object({
    low_max: z
      .number({ error: "Mandatory" })
      .int()
      .min(0, "Minimum 0"),
    medium_max: z
      .number({ error: "Mandatory" })
      .int()
      .min(1, "Minimum 1"),
  })
  .refine((data) => data.medium_max > data.low_max, {
    message: "Medium max must be greater than Low max",
    path: ["medium_max"],
  });

type FormValues = z.infer<typeof cutoffSchema>;

export default function ScoreCutoffsPage() {
  const queryClient = useQueryClient();

  // -------------------------------------------------------
  // Fetch configuration from backend
  // Used to pre-fill form when the page is first opened
  // -------------------------------------------------------
  const { data: cutoffs, isLoading } = useQuery({
    queryKey: ["score-cutoffs"],
    queryFn: scoreCutoffsApi.get,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(cutoffSchema),
    defaultValues: {
      low_max: 2,      // default values
      medium_max: 4,   // default values
    },
  });

  // -------------------------------------------------------
  // Once the cutoffs data arrives from the backend,
  // reset the form with the actual values from the database
  // -------------------------------------------------------
  useEffect(() => {
    if (cutoffs) {
      reset({
        low_max: cutoffs.low.max_score,
        medium_max: cutoffs.medium.max_score,
      });
    }
  }, [cutoffs, reset]);

  // Reactive values — re-render automatically when input changes
  const lowMaxValue = watch("low_max");
  const mediumMaxValue = watch("medium_max");

  const updateMutation = useMutation({
    mutationFn: scoreCutoffsApi.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["score-cutoffs"] });
      // Reset isDirty so Save button becomes disabled again after successful save
      reset({ low_max: lowMaxValue, medium_max: mediumMaxValue });
    },
  });

  async function onSubmit(values: FormValues) {
    // -------------------------------------------------------
    // Build complete payload from two Chelsea inputs
    // high.max_score = 999 is a sentinel value
    // Not shown to Chelsea, but required when sending to backend
    // -------------------------------------------------------
    await updateMutation.mutateAsync({
      low: {
        min_score: 0,
        max_score: values.low_max,
      },
      medium: {
        min_score: values.low_max + 1,
        max_score: values.medium_max,
      },
      high: {
        min_score: values.medium_max + 1,
        max_score: 999, // sentinel — don't show to Chelsea
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  const lowMin = 0;
  const mediumMin = isNaN(lowMaxValue) ? "?" : lowMaxValue + 1;
  const highMin = isNaN(mediumMaxValue) ? "?" : mediumMaxValue + 1;

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Configure Score Cutoffs
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Set score limits to determine the risk category of daily
          self-assessment results.
        </p>    
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-700">
        <Info className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          Only fill in the upper limits for Low and Medium. The minimum
          values for each category are calculated automatically.
        </p>
      </div>

      <div className="space-y-4">
        {/* LOW */}
        <div className="border border-slate-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
              Low Risk
            </Badge>
            <span className="text-xs text-slate-400">
              Range:{" "}
              {isNaN(lowMaxValue)
                ? "0 – ?"
                : `${lowMin} – ${lowMaxValue}`}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Minimum Skor</Label>
              {/* Read-only — always 0 */}
              <Input
                value={lowMin}
                disabled
                className="bg-slate-50 text-slate-400"
              />
              <p className="text-xs text-slate-400">Always starts from 0.</p>
            </div>
            <div className="space-y-1">
              <Label>Maximum Skor</Label>
              <Input
                {...register("low_max", { valueAsNumber: true })}
                type="number"
                min={0}
                placeholder="2"
              />
              {errors.low_max && (
                <p className="text-xs text-rose-500">
                  {errors.low_max.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* MEDIUM */}
        <div className="border border-slate-200 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
              Medium Risk
            </Badge>
            <span className="text-xs text-slate-400">
              Range:{" "}
              {isNaN(lowMaxValue) || isNaN(mediumMaxValue)
                ? "? – ?"
                : `${mediumMin} – ${mediumMaxValue}`}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Minimum Skor</Label>
              {/* Derived — automatically from low_max + 1 */}
              <Input
                value={isNaN(lowMaxValue) ? "" : mediumMin}
                disabled
                className="bg-slate-50 text-slate-400"
              />
              <p className="text-xs text-slate-400">
                Automatically: low max + 1.
              </p>
            </div>
            <div className="space-y-1">
              <Label>Maximum Skor</Label>
              <Input
                {...register("medium_max", { valueAsNumber: true })}
                type="number"
                min={1}
                placeholder="4"
              />
              {errors.medium_max && (
                <p className="text-xs text-rose-500">
                  {errors.medium_max.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* HIGH */}
        <div className="border border-rose-200 bg-rose-50/30 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">
              High Risk
            </Badge>
            <span className="text-xs text-slate-400">
              Score ≥{" "}
              {isNaN(mediumMaxValue) ? "?" : highMin}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Minimum Skor</Label>
              {/* Derived — automatically from medium_max + 1 */}
              <Input
                value={isNaN(mediumMaxValue) ? "" : highMin}
                disabled
                className="bg-slate-50 text-slate-400"
              />
              <p className="text-xs text-slate-400">
                Automatically: medium max + 1.
              </p>
            </div>
            <div className="space-y-1">
              <Label>Maximum Skor</Label>
              {/* Sentinel 999 — don't show to Chelsea */}
              <Input
                value="Unlimited"
                disabled
                className="bg-slate-50 text-slate-400"
              />
              <p className="text-xs text-slate-400">
                All scores ≥ minimum are automatically High Risk.
              </p>
            </div>
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center justify-between pt-2">
          <div>
            {updateMutation.isSuccess && (
              <p className="text-sm text-emerald-600">
                ✓ Score cutoffs configuration saved successfully.
              </p>
            )}
            {updateMutation.isError && (
              <p className="text-sm text-rose-500">
                Failed to save score cutoffs. Please try again.
              </p>
            )}
          </div>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={updateMutation.isPending || !isDirty}
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Score Cutoffs"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}