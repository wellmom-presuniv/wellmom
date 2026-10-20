import { APP_NAME } from "@/lib/appName";

export default function DashboardPage() {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold text-slate-800">Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome to {APP_NAME} CMS.</p>
        </div>
    );
}