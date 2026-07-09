import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { educationApi } from "@/api/education";
import { EducationFormDialog } from "@/components/education/EducationFormDialog";
import type { EducationContent } from "@/types";

export default function EducationContentPage() {
  const queryClient = useQueryClient();

  // State untuk kontrol dialog form dan delete
  const [formOpen, setFormOpen] = useState(false);
  const [selectedContent, setSelectedContent] =
    useState<EducationContent | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<EducationContent | null>(null);

  // -------------------------------------------------------
  // useQuery: ambil data dari backend saat halaman dibuka
  // Data di-cache oleh TanStack Query — tidak refetch
  // setiap render, hanya kalau stale atau invalidated
  // -------------------------------------------------------
  const { data: contents = [], isLoading } = useQuery({
    queryKey: ["education-content"],
    queryFn: educationApi.getAll,
  });

  // -------------------------------------------------------
  // useMutation: untuk operasi yang mengubah data
  // onSuccess: invalidate cache supaya tabel otomatis
  // refresh setelah tambah/edit/hapus
  // -------------------------------------------------------
  const createMutation = useMutation({
    mutationFn: educationApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education-content"] });
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof educationApi.update>[1];
    }) => educationApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education-content"] });
      setFormOpen(false);
      setSelectedContent(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: educationApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education-content"] });
      setDeleteTarget(null);
    },
  });

  function handleAddClick() {
    setSelectedContent(null); // pastikan mode tambah, bukan edit
    setFormOpen(true);
  }

  function handleEditClick(content: EducationContent) {
    setSelectedContent(content); // passing data → form akan pre-fill
    setFormOpen(true);
  }

  function handleFormClose() {
    setFormOpen(false);
    setSelectedContent(null);
  }

  async function handleFormSubmit(
    data: Parameters<typeof educationApi.create>[0]
  ) {
    if (selectedContent) {
      // Mode edit
      await updateMutation.mutateAsync({
        id: selectedContent.content_id,
        payload: data,
      });
    } else {
      // Mode tambah
      await createMutation.mutateAsync(data);
    }
  }

  return (
    <div className="p-8">
      {/* Header halaman */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Education Content
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage trimester-based educational materials displayed in the mobile app.
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add Content
        </Button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : contents.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-200 rounded-lg text-slate-400">
          <p className="text-sm">No education content yet.</p>
          <p className="text-sm">Click "Add Content" to start.</p>
        </div>
      ) : (
        /* Tabel data */
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead className="w-28">Trimester</TableHead>
                <TableHead className="w-36">Category</TableHead>
                <TableHead className="w-16">Order</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contents.map((content) => (
                <TableRow key={content.content_id}>
                  <TableCell className="font-medium">
                    {content.title}
                  </TableCell>
                  <TableCell>Trimester {content.trimester}</TableCell>
                  <TableCell className="text-slate-500">
                    {content.category}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {content.order_in_category}
                  </TableCell>
                  <TableCell>
                    {/* Badge berubah warna sesuai status */}
                    <Badge
                      variant={
                        content.status === "published"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {content.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditClick(content)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => setDeleteTarget(content)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Form Dialog (tambah / edit) */}
      <EducationFormDialog
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={selectedContent}
        isSubmitting={
          createMutation.isPending || updateMutation.isPending
        }
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this content?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.title}" will be permanently deleted and will not be displayed in the mobile app. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-500 hover:bg-rose-600"
              onClick={() =>
                deleteTarget &&
                deleteMutation.mutate(deleteTarget.content_id)
              }
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}