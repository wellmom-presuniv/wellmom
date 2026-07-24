import apiClient from "./client";
import { ChecklistHistoryDay, ChecklistSubmitPayload, TodayChecklistResponse } from "../types";

export async function getTodayChecklist(): Promise<TodayChecklistResponse> {
const { data } = await apiClient.get<TodayChecklistResponse>("/checklist/today");
return data;
}

export async function getChecklistForDate(date: string): Promise<TodayChecklistResponse> {
const { data } = await apiClient.get<TodayChecklistResponse>(`/checklist/day/${date}`);
return data;
}

export async function submitChecklist(
date: string,
payload: ChecklistSubmitPayload
): Promise<TodayChecklistResponse> {
const { data } = await apiClient.put<TodayChecklistResponse>(`/checklist/day/${date}`, payload);
return data;
}

export async function getChecklistHistory(
limit = 30,
offset = 0
): Promise<ChecklistHistoryDay[]> {
const { data } = await apiClient.get<ChecklistHistoryDay[]>("/checklist/history", {
  params: { limit, offset },
});
return data;
}
