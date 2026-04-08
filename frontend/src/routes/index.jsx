import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/login/LoginPage";
import RegisterPage from "../pages/register/RegisterPage";
import HomePage from "../pages/home/HomePage";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminModerationPage from "../pages/admin/AdminModerationPage";
import CreateBlogPage from "../pages/blog/CreateBlogPage";
import PublicBlogFeedPage from "../pages/blog/PublicBlogFeedPage";
import BlogDetailsPage from "../pages/blog/BlogDetailsPage";
import EducationHubPage from "../pages/blog/EducationHubPage";
import ProtectedRoute from "./ProtectedRoute";
import AddProductPage from "../pages/product/AddProductPage";
import ProductsListPage from "../pages/product/ProductsListPage";
import ProductDetailsPage from "../pages/product/ProductDetailsPage";
import VerifyOtpPage from "../pages/login/VerifyOtpPage";
import EditProductPage from "../pages/product/EditProductPage";
import ComparePage from "../pages/compare/ComparePage";
import ComparisonHistoryPage from "../pages/compare/ComparisonHistoryPage";
import ComparisonDetailPage from "../pages/compare/ComparisonDetailPage";
import ComparisonStatsPage from "../pages/compare/ComparisonStatsPage";
import MainLayout from "../components/layouts/MainLayout";
import MyProfilePage from "../pages/profile/MyProfilePage";
import MyReviewsPage from "../pages/profile/MyReviewsPage";

export default function AppRoutes() {
    return (
        <Routes>
            {/* ── Auth pages — no footer ── */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-otp" element={<VerifyOtpPage />} />

            {/* ── Public & app pages — wrapped in MainLayout (includes Footer) ── */}
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/blogs" element={<MainLayout><PublicBlogFeedPage /></MainLayout>} />
            <Route path="/blogs/:id" element={<MainLayout><BlogDetailsPage /></MainLayout>} />
            <Route path="/blogs/:id/education-hub" element={<MainLayout><EducationHubPage /></MainLayout>} />
            <Route
                path="/blogs/create"
                element={<MainLayout><ProtectedRoute element={<CreateBlogPage />} /></MainLayout>}
            />

            {/* Admin pages */}
            <Route 
                path="/admin/dashboard" 
                element={
                    <ProtectedRoute element={<AdminDashboard />} requiredRole="Admin" />
                } 
            />
            <Route
                path="/admin/moderation"
                element={
                    <ProtectedRoute element={<AdminModerationPage />} requiredRole="Admin" />
                }
            />

            {/* Product & Sustainability Evaluation Component Routes */}
            <Route 
                path="/add-product" 
                element={
                    <MainLayout>
                        <ProtectedRoute element={<AddProductPage />} requiredRole="Admin" />
                    </MainLayout>
                } 
            />
            <Route 
                path="/edit-product/:id" 
                element={
                    <MainLayout>
                        <ProtectedRoute element={<EditProductPage />} requiredRole="Admin" />
                    </MainLayout>
                } 
            />
            <Route path="/products" element={<MainLayout><ProductsListPage /></MainLayout>} />
            <Route path="/products/:id" element={<MainLayout><ProductDetailsPage /></MainLayout>} />

            {/* Comparison Component Routes */}
            <Route path="/compare" element={<MainLayout><ComparePage /></MainLayout>} />
            <Route 
                path="/compare/history" 
                element={<MainLayout><ProtectedRoute element={<ComparisonHistoryPage />} /></MainLayout>} 
            />
            <Route 
                path="/compare/stats" 
                element={<MainLayout><ProtectedRoute element={<ComparisonStatsPage />} requiredRole="Admin" /></MainLayout>} 
            />
            <Route 
                path="/compare/:id" 
                element={<MainLayout><ProtectedRoute element={<ComparisonDetailPage />} /></MainLayout>} 
            />

            {/* User profile pages */}
            <Route
                path="/profile"
                element={<MainLayout><ProtectedRoute element={<MyProfilePage />} /></MainLayout>}
            />
            <Route
                path="/my-reviews"
                element={<MainLayout><ProtectedRoute element={<MyReviewsPage />} /></MainLayout>}
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}
