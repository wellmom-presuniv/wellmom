import { apiClient } from "@/lib/axios";
import type { ScoreCutoffs } from "@/types";

export const scoreCutoffsApi = {
  // Take score cutoffs from database
  get: async (): Promise<ScoreCutoffs> => {
    const response = await apiClient.get("/api/v1/admin/score-cutoffs");
    return response.data;
  },
  // Update score cutoffs
  update: async (payload: ScoreCutoffs): Promise<ScoreCutoffs> => {
    const response = await apiClient.patch(
      "/api/v1/admin/score-cutoffs",
      payload
    );
    return response.data;
  },
};