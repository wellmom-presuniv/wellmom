import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AdminLayout from "@/layouts/AdminLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import AssessmentQuestionsPage from "@/pages/AssessmentQuestionsPage";
import ScoreCutoffsPage from "@/pages/ScoreCutoffsPage";
import EducationContentPage from "@/pages/EducationContentPage";
import ChecklistItemsPage from "@/pages/ChecklistItemsPage";
import ReferralMappingPage from "@/pages/ReferralMappingPage";

// Route guard - check token before allowing access - if not logged in redirect to login
function ProtectedRoute() {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return <Outlet />;
}

const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        element: <ProtectedRoute />,     // door guard
        children: [
            {
                element: <AdminLayout />,
                children: [
                    { index: true, element: <DashboardPage /> },
                    { path: "assessment-questions", element: <AssessmentQuestionsPage /> },
                    { path: "score-cutoffs", element: <ScoreCutoffsPage /> },
                    { path: "education-content", element: <EducationContentPage /> },
                    { path: "checklist-items", element: <ChecklistItemsPage /> },
                    { path: "referral-mapping", element: <ReferralMappingPage /> },
                ],
            },
        ],
    },
]);

export default router;