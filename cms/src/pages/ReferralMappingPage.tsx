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
import { referralMappingApi } from "@/api/referralMapping";
import { ReferralFormDialog } from "@/components/referral/ReferralFormDialog";
import { RISK_LEVEL_CONFIG, RISK_LEVEL_ORDER } from "@/lib/riskLevel";
import type { ReferralMapping, RiskLevel } from "@/types";

export default function ReferralMappingPage() {
  const queryClient = useQueryClient();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] =
    useState<ReferralMapping | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<ReferralMapping | null>(null);

  const { data: mappings = [], isLoading } = useQuery({
    queryKey: ["referral-mapping"],
    queryFn: referralMappingApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: referralMappingApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral-mapping"] });
      setFormOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Parameters<typeof referralMappingApi.update>[1];
    }) => referralMappingApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral-mapping"] });
      setFormOpen(false);
      setSelectedMapping(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: referralMappingApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral-mapping"] });
      setDeleteTarget(null);
    },
  });

  function handleAddClick() {
    setSelectedMapping(null);
    setFormOpen(true);
  }

  function handleEditClick(mapping: ReferralMapping) {
    setSelectedMapping(mapping);
    setFormOpen(true);
  }

  function handleFormClose() {
    setFormOpen(false);
    setSelectedMapping(null);
  }

  async function handleFormSubmit(
    data: Parameters<typeof referralMappingApi.create>[0]
  ) {
    if (selectedMapping) {
      await updateMutation.mutateAsync({
        id: selectedMapping.id,
        payload: data,
      });
    } else {
      await createMutation.mutateAsync(data);
    }
  }

  // -------------------------------------------------------
  // Group data by risk_level sesuai urutan LOW → MEDIUM → HIGH
  // Hasilnya: { LOW: [...], MEDIUM: [...], HIGH: [...] }
  // -------------------------------------------------------
  const groupedMappings = RISK_LEVEL_ORDER.reduce<
    Record<RiskLevel, ReferralMapping[]>
  >(
    (acc, level) => {
      acc[level] = mappings.filter((m) => m.risk_level === level);
      return acc;
    },
    { LOW: [], MEDIUM: [], HIGH: [] }
  );

  const isEmpty = mappings.length === 0;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Referral Mapping
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage referral mappings for risk categories to recommended health
            facilities in the mobile application.
          </p>
        </div>
        <Button onClick={handleAddClick}>
          <Plus className="w-4 h-4 mr-2" />
          Add Mapping
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : isEmpty ? (
        <div className="flex flex-col items-center justify-center h-48 border border-dashed border-slate-200 rounded-lg text-slate-400">
          <p className="text-sm">No referral mappings available.</p>
          <p className="text-sm">Click "Add Mapping" to get started.</p>
        </div>
      ) : (
        // -------------------------------------------------------
        // Render tiga section terpisah per risk level
        // Jauh lebih mudah dibaca daripada satu tabel flat
        // -------------------------------------------------------
        <div className="space-y-6">
          {RISK_LEVEL_ORDER.map((level) => {
            const config = RISK_LEVEL_CONFIG[level];
            const items = groupedMappings[level];

            return (
              <div key={level}>
                {/* Section header per risk level */}
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={config.badgeClass}>
                    {config.label}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {items.length} mapping
                  </span>
                </div>

                {items.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-lg p-4 text-center text-sm text-slate-400">
                    No mappings available for this category.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Facility</TableHead>
                          <TableHead>Recommendation</TableHead>
                          <TableHead className="w-32">
                            Urgency Label
                          </TableHead>
                          <TableHead className="w-24">Status</TableHead>
                          <TableHead className="w-24 text-right">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((mapping) => (
                          <TableRow
                            key={mapping.id}
                            className={config.rowClass}
                          >
                            <TableCell className="font-medium">
                              {mapping.facility_type}
                            </TableCell>
                            <TableCell className="text-slate-600 text-sm max-w-xs">
                              {/*
                                Potong teks rekomendasi kalau terlalu panjang
                                Chelsea bisa lihat full text saat edit
                              */}
                              <span
                                className="line-clamp-2"
                                title={mapping.recommendation}
                              >
                                {mapping.recommendation}
                              </span>
                            </TableCell>
                            <TableCell className="text-slate-500 text-sm">
                              {mapping.urgency_label}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  mapping.is_active
                                    ? "default"
                                    : "secondary"
                                }
                                className={
                                  mapping.is_active
                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                    : ""
                                }
                              >
                                {mapping.is_active ? "Aktif" : "Nonaktif"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => handleEditClick(mapping)}
                                >
                                  <Pencil className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
                                  onClick={() => setDeleteTarget(mapping)}
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
              </div>
            );
          })}
        </div>
      )}

      <ReferralFormDialog
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        initialData={selectedMapping}
        isSubmitting={
          createMutation.isPending || updateMutation.isPending
        }
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this mapping?</AlertDialogTitle>
            <AlertDialogDescription>
              The referral mapping for{" "}
              <strong>
                {deleteTarget
                  ? RISK_LEVEL_CONFIG[deleteTarget.risk_level].label
                  : ""}
              </strong>{" "}
              to {deleteTarget?.facility_type} will be permanently deleted.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-500 hover:bg-rose-600"
              onClick={() =>
                deleteTarget &&
                deleteMutation.mutate(deleteTarget.id)
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