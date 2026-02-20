import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import RegisterPage from "../pages/register/RegisterPage";
import HomePage from "../pages/home/HomePage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<HomePage />} />
            <Route 
                path="/admin/dashboard" 
                element={
                    <ProtectedRoute 
                        element={<AdminDashboard />} 
                        requiredRole="Admin" 
                    />
                } 
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
