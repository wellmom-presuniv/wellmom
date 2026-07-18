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
import { checklistApi } from "@/api/checklist";
import { ChecklistFormDialog } from "@/components/checklist/ChecklistFormDialog";
import type { ChecklistItem } from "@/types";

export default function ChecklistItemsPage() {
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ChecklistItem | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["checklist-items"],
    queryFn: checklistApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: checklistApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items"] });
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof checklistApi.update>[1];
    }) => checklistApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items"] });
      setFormOpen(false);
      setSelectedItem(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: checklistApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklist-items"] });
      setDeleteTarget(null);
    },
  });

  function handleAddClick() {
    setSelectedItem(null);
    setFormOpen(true);
  }

  function handleEditClick(item: ChecklistItem) {
    setSelectedItem(item);
    setFormOpen(true);
  }

  function handleFormClose() {
    setFormOpen(false);
    setSelectedItem(null);
  }

  async function handleFormSubmit(
    data: Parameters<typeof checklistApi.create>[0]
  ) {
    if (selectedItem) {
      await updateMutation.mutateAsync({
        id: selectedItem.item_id,
        payload: data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Daily Checklist Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage the list of items that appear in the daily checklist for pregnant women.
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : items.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-200 rounded-lg text-slate-400">
          <p className="text-sm">No checklist items.</p>
          <p className="text-sm">Click "Add Item" to start.</p>
        </div>
      ) : (
        /* Tabel */
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">No.</TableHead>
                <TableHead>Label</TableHead>
                <TableHead className="w-36">Category</TableHead>
                <TableHead className="w-16">Order</TableHead>
                <TableHead className="w-24">Status</TableHead>
                <TableHead className="w-24 text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.item_id}>
                  <TableCell className="text-slate-400 text-sm">
                    {index + 1}
                  </TableCell>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell className="text-slate-500">
                    {/*
                      category nullable — kalau null, tampilkan dash
                      supaya tabel tidak terlihat kosong/broken
                    */}
                    {item.category ?? (
                      <span className="text-slate-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {item.order_index}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={item.is_active ? "default" : "secondary"}
                      className={
                        item.is_active
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                          : ""
                      }
                    >
                      {item.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditClick(item)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                        onClick={() => setDeleteTarget(item)}
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

      {/* Form Dialog */}
      <ChecklistFormDialog
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={selectedItem}
        isSubmitting={
          createMutation.isPending || updateMutation.isPending
        }
      />

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this item?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.label}" will be permanently deleted and will not
              appear in the daily checklist. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-500 hover:bg-rose-600"
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget.item_id)
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