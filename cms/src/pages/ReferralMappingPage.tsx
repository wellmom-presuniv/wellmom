import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Loader2 } from "lucide-react";
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
import { referralMappingApi } from "@/api/referralMapping";
import { ReferralFormDialog } from "@/components/referral/ReferralFormDialog";
import { RISK_LEVEL_CONFIG, RISK_LEVEL_ORDER } from "@/lib/riskLevel";
import type { ReferralMapping } from "@/types";

export default function ReferralMappingPage() {
  const queryClient = useQueryClient();

  // Hanya state edit — tidak ada add/delete
  const [selectedMapping, setSelectedMapping] =
    useState<ReferralMapping | null>(null);

  const { data: mappings = [], isLoading } = useQuery({
    queryKey: ["referral-mapping"],
    queryFn: referralMappingApi.getAll,
  });

  // -------------------------------------------------------
  // Update by risk_level — bukan by id
  // -------------------------------------------------------
  const updateMutation = useMutation({
    mutationFn: ({
      risk_level,
      payload,
    }: {
      risk_level: string;
      payload: Parameters<typeof referralMappingApi.update>[1];
    }) =>
      referralMappingApi.update(
        risk_level as "LOW" | "MEDIUM" | "HIGH",
        payload
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral-mapping"] });
      setSelectedMapping(null);
    },
  });

  async function handleFormSubmit(
    data: Parameters<typeof referralMappingApi.update>[1]
  ) {
    if (!selectedMapping) return;
    await updateMutation.mutateAsync({
      risk_level: selectedMapping.risk_level,
      payload: data,
    });
  }

  // Group by risk_level
  const groupedMappings = RISK_LEVEL_ORDER.reduce<Record<string, ReferralMapping[]>>(
    (acc, level) => {
      acc[level] = mappings.filter((m) => m.risk_level === level);
      return acc;
    },
    { LOW: [], MEDIUM: [], HIGH: [] }
  );

  return (
    <div className="p-8">
      {/* Header — tidak ada tombol Tambah */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Referral Mapping
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage referral recommendations per risk category. Three categories
          are already available — click Edit to update their content.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="space-y-6">
          {RISK_LEVEL_ORDER.map((level) => {
            const config = RISK_LEVEL_CONFIG[level];
            const items = groupedMappings[level];

            return (
              <div key={level}>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={config.badgeClass}>
                    {config.label}
                  </Badge>
                  {items.length === 0 && (
                    <span className="text-xs text-slate-400">
                      No data — needs to be filled in
                    </span>
                  )}
                </div>

                {items.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-lg p-4 text-center text-sm text-slate-400">
                    Referral mapping data for this category is not yet available
                    from backend.
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-40">Facility</TableHead>
                          <TableHead>Recommendation</TableHead>
                          <TableHead className="w-36">
                            Urgency Label
                          </TableHead>
                          <TableHead className="w-20 text-right">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.map((mapping) => (
                          <TableRow
                            key={mapping.mapping_id}
                            className={config.rowClass}
                          >
                            <TableCell className="font-medium">
                              {mapping.facility_type}
                            </TableCell>
                            <TableCell className="text-slate-600 text-sm">
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
                            <TableCell className="text-right">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setSelectedMapping(mapping)}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
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
        open={!!selectedMapping}
        onClose={() => setSelectedMapping(null)}
        onSubmit={handleFormSubmit}
        initialData={selectedMapping}
        isSubmitting={updateMutation.isPending}
      />
    </div>
  );
}