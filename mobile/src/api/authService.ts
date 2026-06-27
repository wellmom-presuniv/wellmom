import apiClient from "./client";
import { TokenResponse, RegisterPayload, UserResponse } from "../types";

/**
 * Login pakai OAuth2PasswordRequestForm — backend WAJIB terima form-urlencoded,
 * field name "username" (isinya email), BUKAN JSON { email, password }.
 * Lihat review PR #2 — kalau ini dikirim sebagai JSON, backend balas 422.
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

/**
 * Register pakai JSON biasa (Pydantic UserCreate). Backend TIDAK return token
 * di sini — cuma data user. Setelah register sukses, arahkan ke Login,
 * JANGAN asumsikan user otomatis login.
 */
export async function register(payload: RegisterPayload): Promise<UserResponse> {
  const { data } = await apiClient.post<UserResponse>("/auth/register", payload);
  return data;
}
