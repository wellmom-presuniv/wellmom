import { NavLink, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    ClipboardList,
    SlidersHorizontal,
    BookOpen,
    CheckSquare,
    MapPin,
    Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { to: "/", label: "Dasbor", icon: LayoutDashboard, end: true },
    { to: "/assessment-questions", label: "Pertanyaan Assessment", icon: ClipboardList, end: false },
    { to: "/score-cutoffs", label: "Konfigurasi Cutoff", icon: SlidersHorizontal, end: false },
    { to: "/education-content", label: "Konten Edukasi", icon: BookOpen, end: false },
    { to: "/checklist-items", label: "Checklist Harian", icon: CheckSquare, end: false },
    { to: "/referral-mapping", label: "Mapping Rujukan", icon: MapPin, end: false },
];

export default function AdminLayout() {
    return (
        <div className="flex h-screen bg-slate-50">
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                {/* Brand */}
                <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-200">
                    <Heart className="w-5 h-5 text-rose-500" />
                    <span className="font-semibold text-slate-800 text-sm">
                        WellMom <span className="text-slate-400 font-normal">CMS</span>
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-slate-100 text-slate-900"
                                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                                )
                            }
                        >
                            <Icon className="w-4 h-4 shrink-0" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="px-6 py-4 border-t border-slate-200">
                    <p className="text-xs text-slate-400">WellMom Admin · v0.1.0</p>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}