import apiClient from "./client";
import { AssessmentQuestion, AssessmentSubmitPayload, AssessmentResult } from "../types";

export async function getAssessmentQuestions(): Promise<AssessmentQuestion[]> {
  const { data } = await apiClient.get<AssessmentQuestion[]>("/assessment/questions");
  return data;
}

export async function submitAssessment(payload: AssessmentSubmitPayload): Promise<AssessmentResult> {
  const { data } = await apiClient.post<AssessmentResult>("/assessment/submit", payload);
  return data;
}

export async function getTodayAssessment(): Promise<AssessmentResult | null> {
  const { data } = await apiClient.get<AssessmentResult | null>("/assessment/today");
  return data;
}

export async function getAssessmentHistory(limit = 20, offset = 0): Promise<AssessmentResult[]> {
  const { data } = await apiClient.get<AssessmentResult[]>("/assessment/history", {
    params: { limit, offset },
  });
  return data;
}