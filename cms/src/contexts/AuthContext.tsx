import {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode, // biar typesafe
} from "react";

import { setAuthToken } from "@/lib/axios";
// Tipe data yang disimpan di dalam Context
interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
    login: (token: string) => void;
    logout: () => void;
}

// Buat Context-nya
// defaultnya null — akan diisi oleh Provider di bawah
const AuthContext = createContext<AuthContextValue | null>(null);

// Provider: komponen pembungkus yang menyediakan "brankas"
// Semua komponen di dalam Provider bisa akses token
export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);

    // Dipanggil setelah backend kasih JWT token
    const login = useCallback((newToken: string) => {
        setToken(newToken);
        setAuthToken(newToken); // <-- menyambungkan token ke axios
    }, []);

    // Dipanggil saat Chelsea klik logout
    const logout = useCallback(() => {
        setToken(null);
        setAuthToken(null); // <-- membersihkan token dari axios juga
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token,
                isAuthenticated: token !== null,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook: cara komponen lain akses AuthContext
// Pakai ini di mana saja: const { token, login } = useAuth()
export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}