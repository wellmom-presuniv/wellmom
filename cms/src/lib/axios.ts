import axios from "axios";

// Instance axios khusus CMS
// baseURL mengarah ke backend Alek
export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

// Fungsi untuk set token — dipanggil dari AuthContext
// setelah login berhasil
export function setAuthToken(token: string | null) {
    if (token) {
        apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.common["Authorization"];
    }
}

// Response interceptor
// Kalau dapat 401 → token tidak valid/expired → hapus token → redirect ke /login
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            setAuthToken(null);
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);