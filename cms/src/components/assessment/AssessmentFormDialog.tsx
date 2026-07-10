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
import type {
  AssessmentQuestion,
  CreateAssessmentQuestionPayload,
} from "@/types";

// Zod v4 schema — pakai pattern yang sudah terbukti:
// z.number() + valueAsNumber: true untuk number input
// error bukan invalid_type_error (Zod v4)
const assessmentSchema = z.object({
  question_text: z.string().min(1, "The question must be filled in"),
  weight: z
    .number({ error: "The weight must be filled in" })
    .int()
    .min(1, "The weight must be at least 1"),
  is_red_flag: z.boolean(),
  order_index: z
    .number({ error: "The order must be filled in" })
    .int()
    .min(1, "The order must be at least 1"),
  is_active: z.boolean(),
  category: z.string().optional(),
});

type FormValues = z.infer<typeof assessmentSchema>;

interface AssessmentFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAssessmentQuestionPayload) => Promise<void>;
  initialData?: AssessmentQuestion | null;
  isSubmitting: boolean;
}

export function AssessmentFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: AssessmentFormDialogProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      question_text: "",
      weight: 1,
      is_red_flag: false,
      order_index: 1,
      is_active: true,
      category: "",
    },
  });

  const isRedFlagValue = watch("is_red_flag");
  const isActiveValue = watch("is_active");

  useEffect(() => {
    if (initialData) {
      reset({
        question_text: initialData.question_text,
        weight: initialData.weight,
        is_red_flag: initialData.is_red_flag,
        order_index: initialData.order_index,
        is_active: initialData.is_active,
        category: initialData.category ?? "",
      });
    } else {
      reset({
        question_text: "",
        weight: 1,
        is_red_flag: false,
        order_index: 1,
        is_active: true,
        category: "",
      });
    }
  }, [initialData, reset]);

  async function handleFormSubmit(values: FormValues) {
    const payload: CreateAssessmentQuestionPayload = {
      question_text: values.question_text,
      weight: values.weight,
      is_red_flag: values.is_red_flag,
      order_index: values.order_index,
      is_active: values.is_active,
      // Konversi empty string → null untuk category nullable
      category: values.category?.trim() || null,
    };
    await onSubmit(payload);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Question" : "Add Question"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Question Text */}
          <div className="space-y-1">
            <Label>Question Text</Label>
            <Textarea
              {...register("question_text")}
              placeholder="Example: Is there any bleeding or spotting?"
              className="resize-none"
              rows={3}
            />
            {errors.question_text && (
              <p className="text-xs text-rose-500">
                {errors.question_text.message}
              </p>
            )}
          </div>

          {/* Bobot + Urutan */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Weight</Label>
              <Input
                {...register("weight", { valueAsNumber: true })}
                type="number"
                min={1}
                placeholder="1"
              />
              {errors.weight && (
                <p className="text-xs text-rose-500">
                  {errors.weight.message}
                </p>
              )}
              <p className="text-xs text-slate-400">
                Contribution value to total risk score.
              </p>
            </div>

            <div className="space-y-1">
              <Label>Order to display</Label>
              <Input
                {...register("order_index", { valueAsNumber: true })}
                type="number"
                min={1}
                placeholder="1"
              />
              {errors.order_index && (
                <p className="text-xs text-rose-500">
                  {errors.order_index.message}
                </p>
              )}
              <p className="text-xs text-slate-400">
                The order of questions in the assessment form.
              </p>
            </div>
          </div>

          {/* Kategori */}
          <div className="space-y-1">
            <Label>
              Kategori{" "}
              <span className="text-slate-400 font-normal">(opsional)</span>
            </Label>
            <Input
              {...register("category")}
              placeholder="Reserved — boleh dikosongkan"
            />
            <p className="text-xs text-slate-400">
              Not used currently. Leave empty if none.
            </p>
          </div>

          {/* Red Flag Toggle — paling penting, paling menonjol */}
          <div
            className={`rounded-lg border p-4 space-y-2 transition-colors ${
              isRedFlagValue
                ? "border-rose-200 bg-rose-50"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Red Flag Override
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  A "Yes" answer directly triggers High Risk regardless of the total score.
                </p>
              </div>
              <Switch
                checked={isRedFlagValue}
                onCheckedChange={(checked) =>
                  setValue("is_red_flag", checked)
                }
              />
            </div>
            {isRedFlagValue && (
              <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100 text-xs">
                ⚠ This question is a Red Flag
              </Badge>
            )}
          </div>

          {/* Status Aktif */}
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
                  {isActiveValue ? "Active" : "Inactive"}
                </p>
                <p className="text-xs text-slate-400">
                  {isActiveValue
                    ? "This question will appear in the assessment form."
                    : "This question will not appear in the assessment form."}
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
              ? "Save Changes"
              : "Add Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}