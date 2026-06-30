import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/axios";

const loginSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Minimum 6 characters required"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    // Dipanggil saat Chelsea klik tombol Login
    async function onSubmit(values: LoginFormValues) {
        setServerError(null);
        try {
            const response = await apiClient.post("/api/v1/auth/login", values); // update endpoint
            const token = response.data.access_token;
            login(token);              // simpan ke AuthContext + axios
            navigate("/");             // redirect ke dashboard
        } catch {
            setServerError("Incorrect email or password. Please try again.");
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <div className="bg-white border border-slate-200 rounded-lg p-8 w-full max-w-sm shadow-sm">

                {/* Brand */}
                <div className="flex items-center gap-2 mb-6">
                    <Heart className="w-5 h-5 text-rose-500" />
                    <span className="font-semibold text-slate-800">
                        WellMom <span className="text-slate-400 font-normal">CMS</span>
                    </span>
                </div>

                <h1 className="text-lg font-semibold text-slate-800 mb-1">
                    Sign In to Admin Panel
                </h1>
                <p className="text-sm text-slate-500 mb-6">
                    For WellMom internal team only.
                </p>

                <div className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Email
                        </label>
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="name@example.com"
                            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                        />
                        {errors.email && (
                            <p className="text-xs text-rose-500 mt-1">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Password
                        </label>
                        <input
                            {...register("password")}
                            type="password"
                            placeholder="Enter your password"
                            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300"
                        />
                        {errors.password && (
                            <p className="text-xs text-rose-500 mt-1">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    {/* Server error */}
                    {serverError && (
                        <p className="text-xs text-rose-500">{serverError}</p>
                    )}

                    {/* Submit */}
                    <Button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting}
                        className="w-full"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Signing In...
                            </>
                        ) : (
                            "Sign In"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}