import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import RegisterPage from "../pages/register/RegisterPage";
import HomePage from "../pages/home/HomePage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminModerationPage from "../pages/admin/AdminModerationPage";
import CreateBlogPage from "../pages/blog/CreateBlogPage";
import PublicBlogFeedPage from "../pages/blog/PublicBlogFeedPage";
import ProtectedRoute from "./ProtectedRoute";
import AddProductPage from "../pages/product/AddProductPage";
import ProductsListPage from "../pages/product/ProductsListPage";
import ProductDetailsPage from "../pages/product/ProductDetailsPage";
import EditProductPage from "../pages/product/EditProductPage";
import ComparePage from "../pages/compare/ComparePage";
import ComparisonHistoryPage from "../pages/compare/ComparisonHistoryPage";
import ComparisonDetailPage from "../pages/compare/ComparisonDetailPage";
import ComparisonStatsPage from "../pages/compare/ComparisonStatsPage";
export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/blogs" element={<PublicBlogFeedPage />} />
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
            <Route 
                path="/add-product" 
                element={
                    <ProtectedRoute element={<AddProductPage/>} requiredRole="Admin" />
                } 
            />
            <Route 
                path="/edit-product/:id" 
                element={
                    <ProtectedRoute element={<EditProductPage/>} requiredRole="Admin" />
                } 
            />
            <Route path="/products" element={<ProductsListPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />

            {/* Comparison Component Routes */}
            <Route path="/compare" element={<ComparePage />} />
            <Route 
                path="/compare/history" 
                element={<ProtectedRoute element={<ComparisonHistoryPage />} />} 
            />
            <Route 
                path="/compare/stats" 
                element={<ProtectedRoute element={<ComparisonStatsPage />} requiredRole="Admin" />} 
            />
            <Route 
                path="/compare/:id" 
                element={<ProtectedRoute element={<ComparisonDetailPage />} />} 
            />

        </Routes>
    );
}
