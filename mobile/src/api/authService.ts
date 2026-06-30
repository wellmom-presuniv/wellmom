import apiClient from "./client";
import { TokenResponse, RegisterPayload, AuthResponse } from "../types";

/**
 * SEMENTARA balik ke form-urlencoded — Alek bilang udah ganti ke JSON,
 * tapi kode itu masih di branch dia sendiri, belum merge ke main.
 * Backend lokal kita masih versi OAuth2PasswordRequestForm.
 * TODO: balik ke JSON begitu fix Alek beneran di-merge ke main + di-pull.
 */
export async function login(email: string, password: string): Promise<TokenResponse> {
  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);

  const { data } = await apiClient.post<TokenResponse>("/auth/login", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  return data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
  return data;
}