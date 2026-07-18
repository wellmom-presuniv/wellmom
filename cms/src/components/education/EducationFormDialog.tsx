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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  EducationContent,
  CreateEducationContentPayload,
} from "@/types";

// -------------------------------------------------------
// Validasi form pakai Zod
// Setiap field yang wajib diisi akan menampilkan pesan
// error di bawah input kalau dikosongkan
// -------------------------------------------------------
const educationSchema = z.object({
  title: z.string().min(1, "The title is required"),
  trimester: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  category: z.string().min(1, "The category is required"),
  body: z.string().min(1, "The body is required"),
  status: z.enum(["published", "draft"]),
  order_in_category: z.number({
    error: "The order in category is required",
  }).int().min(1),
});

type FormValues = z.infer<typeof educationSchema>;

interface EducationFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEducationContentPayload) => Promise<void>;
  initialData?: EducationContent | null;
  isSubmitting: boolean;
}

export function EducationFormDialog({
  open,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: EducationFormDialogProps) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      title: "",
      trimester: 1,
      category: "",
      body: "",
      status: "draft",
      order_in_category: 1,
    },
  });

  const statusValue = watch("status");

  // -------------------------------------------------------
  // Kalau mode edit: pre-fill form dengan data yang ada
  // Kalau mode tambah: reset ke default kosong
  // -------------------------------------------------------
  useEffect(() => {
  if (initialData) {
    reset({
      title: initialData.title,
      trimester: initialData.trimester ?? 1,  // null → default 1
      category: initialData.category,
      body: initialData.body,
      status: initialData.is_published ? "published" : "draft", // Konversi is_published (boolean) → status (string) untuk form UX
      order_in_category: initialData.order_in_category,
    });
  } else {
    reset({
      title: "",
      trimester: 1,
      category: "",
      body: "",
      status: "draft",
      order_in_category: 1,
    });
  }
}, [initialData, reset]);

  async function handleFormSubmit(values: FormValues) {
  // Konversi status string → is_published boolean sesuai contract backend
  const payload: CreateEducationContentPayload = {
    title: values.title,
    trimester: values.trimester,
    category: values.category,
    body: values.body,
    is_published: values.status === "published",  // ← konversi di sini
    order_in_category: values.order_in_category,
  };
  await onSubmit(payload);
}

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Education Content" : "Add Education Content"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2 min-w-0">
          {/* Judul */}
          <div className="space-y-1">
            <Label>Title</Label>
            <Input
              {...register("title")}
              placeholder="Ex: The Importance of Nutrition in the First Trimester"
            />
            {errors.title && (
              <p className="text-xs text-rose-500">{errors.title.message}</p>
            )}
          </div>

          {/* Trimester + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Trimester</Label>
              {/* -------------------------------------------------------
                  Select tidak bisa pakai register() biasa dari react-hook-form
                  karena ini komponen shadcn kustom, bukan input HTML native.
                  Solusinya: pakai onValueChange + setValue dari useForm
                  ------------------------------------------------------- */}
              <Select
                defaultValue={String(initialData?.trimester ?? 1)}
                onValueChange={(val) =>
                  setValue("trimester", Number(val) as 1 | 2 | 3)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select trimester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Trimester 1</SelectItem>
                  <SelectItem value="2">Trimester 2</SelectItem>
                  <SelectItem value="3">Trimester 3</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Category</Label>
              <Input
                {...register("category")}
                placeholder="nutrition / anemia-iron-pills / etc"
              />
              {errors.category && (
                <p className="text-xs text-rose-500">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Body / Content */}
          <div className="space-y-1">
            <Label>Content</Label>
            {/* Plain textarea — sesuai keputusan tim: tidak perlu rich text editor */}
            <Textarea
              {...register("body")}
              placeholder="Write educational content here..."
              className="min-h-36 resize-y"
            />
            {errors.body && (
              <p className="text-xs text-rose-500">{errors.body.message}</p>
            )}
          </div>

          {/* Order + Status */}
          <div className="grid grid-cols-2 gap-4 items-start">
            <div className="space-y-1">
              <Label>Order in Category</Label>
              <Input
                {...register("order_in_category", {valueAsNumber: true})}
                type="number"
                min={1}
                placeholder="1"
              />
              <p className="text-xs text-slate-400">
                Order displayed among content in the same category.
              </p>
            </div>

            <div className="space-y-1">
              <Label>Status</Label>
              {/* -------------------------------------------------------
                  Switch juga komponen kustom — pakai watch() untuk baca
                  nilai saat ini, setValue() untuk update
                  ------------------------------------------------------- */}
              <div className="flex items-center gap-3 pt-2">
                <Switch
                  checked={statusValue === "published"}
                  onCheckedChange={(checked) =>
                    setValue("status", checked ? "published" : "draft")
                  }
                />
                <span className="text-sm text-slate-600">
                  {statusValue === "published" ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Draft will not be displayed on the mobile app.
              </p>
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
              : "Add Content"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}