import apiClient from "./client";
import { TokenResponse, RegisterPayload, AuthResponse } from "../types";

/**
 * Login pakai JSON biasa { email, password } — sesuai update Alek terbaru.
 * NOTE: sebelumnya ini form-urlencoded (OAuth2PasswordRequestForm), tapi
 * backend sudah diubah ke JSON biasa. Kalau ke depan ketemu 422 lagi,
 * cek dulu apakah backend balik lagi ke versi form-urlencoded.
 */
export async function login(email: string, password: string): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/auth/login", { email, password });
  return data;
}

/**
 * Register sekarang JUGA return token (skema AuthResponse), bukan cuma
 * data user — backend auto-login user setelah register. TODO: field exact
 * AuthResponse belum confirmed dari Alek (cuma "ada access_token, user_id, dll"),
 * verifikasi field lain begitu ketemu response asli.
 */
export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
  return data;
}