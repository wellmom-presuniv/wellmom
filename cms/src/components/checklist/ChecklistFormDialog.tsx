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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { ChecklistItem, CreateChecklistItemPayload } from "@/types";
// Schema validasi Zod v4
// category: string biasa, empty string akan dikonversi
// ke null di submit handler — lebih bersih daripada
// handling nullable di schem
const checklistSchema = z.object({
  label: z.string().min(1, "The label must be filled in"),
  category: z.string().optional(),
  is_active: z.boolean(),
  order_index: z.number({
    error: "The order index must be filled in",
  })
    .int()
    .min(1),
});

type FormValues = z.infer<typeof checklistSchema>;

interface ChecklistFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateChecklistItemPayload) => Promise<void>;
  initialData?: ChecklistItem | null;
  isSubmitting: boolean;
}

export function ChecklistFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: ChecklistFormDialogProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(checklistSchema),
    defaultValues: {
      label: "",
      category: "",
      is_active: true,   // default aktif
      order_index: 1,
    },
  });

  // Watch is_active untuk render Switch secara reactive
  const isActiveValue = watch("is_active");

  // Pre-fill form kalau mode edit, reset kalau mode tambah
  useEffect(() => {
    if (initialData) {
      reset({
        label: initialData.label,
        category: initialData.category ?? "",  // null → string kosong di form
        is_active: initialData.is_active,
        order_index: initialData.order_index,
      });
    } else {
      reset({
        label: "",
        category: "",
        is_active: true,
        order_index: 1,
      });
    }
  }, [initialData, reset]);

  async function handleFormSubmit(values: FormValues) {
    // Konversi string kosong → null untuk field category
    // Backend expect null, bukan empty string
    const payload: CreateChecklistItemPayload = {
      label: values.label,
      category: values.category?.trim() || null,
      is_active: values.is_active,
      order_index: values.order_index,
    };
    await onSubmit(payload);
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Checklist Item" : "Add Item to Checklist"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Label */}
          <div className="space-y-1">
            <Label>Label</Label>
            <Input
              {...register("label")}
              placeholder="Example: Taking folic acid supplements"
            />
            {errors.label && (
              <p className="text-xs text-rose-500">{errors.label.message}</p>
            )}
          </div>

          {/* Kategori */}
          <div className="space-y-1">
            <Label>
              Category{" "}
              <span className="text-slate-400 font-normal">(optional)</span>
            </Label>
            <Input
              {...register("category")}
              placeholder="Example: supplements / hydration / nutrition"
            />
            {/*
              Tidak ada error message untuk category karena opsional.
              Kalau dikosongkan, akan dikirim sebagai null ke backend.
            */}
            <p className="text-xs text-slate-400">
              Leave empty if there is no specific category.
            </p>
          </div>

          {/* Urutan */}
          <div className="space-y-1">
            <Label>Display Order</Label>
            <Input
              {...register("order_index", { valueAsNumber: true })}
              type="number"
              min={1}
              placeholder="1"
            />
            {/*
              valueAsNumber: true → react-hook-form konversi
              string dari HTML input → number sebelum masuk form state.
              Tanpa ini, z.number() akan reject karena dapat string.
            */}
            {errors.order_index && (
              <p className="text-xs text-rose-500">
                {errors.order_index.message}
              </p>
            )}
            <p className="text-xs text-slate-400">
              The display order of this item in the daily checklist.
            </p>
          </div>

          {/* Status aktif */}
          <div className="space-y-1">
            <Label>Status</Label>
            <div className="flex items-center gap-3 pt-1">
              <Switch
                checked={isActiveValue}
                onCheckedChange={(checked) => setValue("is_active", checked)}
              />
              <div>
                <p className="text-sm text-slate-700">
                  {isActiveValue ? "Active" : "Inactive"}
                </p>
                <p className="text-xs text-slate-400">
                  {isActiveValue
                    ? "This item will appear in the user's daily checklist."
                    : "This item will not appear in the daily checklist."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
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
              : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}