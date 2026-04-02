import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import RegisterPage from "../pages/register/RegisterPage";
import HomePage from "../pages/home/HomePage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminModerationPage from "../pages/admin/AdminModerationPage";
import CreateBlogPage from "../pages/blog/CreateBlogPage";
import ProtectedRoute from "./ProtectedRoute";
import AddProductPage from "../pages/product/AddProductPage";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<HomePage />} />
            <Route
                path="/blogs/create"
                element={<ProtectedRoute element={<CreateBlogPage />} />}
            />
            <Route 
                path="/admin/dashboard" 
                element={
                    <ProtectedRoute 
                        element={<AdminDashboard />} 
                        requiredRole="Admin" 
                    />
                } 
            />
            <Route
                path="/admin/moderation"
                element={
                    <ProtectedRoute
                        element={<AdminModerationPage />}
                        requiredRole="Admin"
                    />
                }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />

            {/*Product & Sustainability Evaluation Component Routes*/}
            <Route path="/add-product" element={<AddProductPage/>} />

        </Routes>
    );
}
