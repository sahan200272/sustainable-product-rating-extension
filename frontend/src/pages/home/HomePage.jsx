import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyBlogs } from "../../services/blogService";
import { GREENVY_LOGO_URL, GREENVY_LOGO_ALT } from "../../config/env";

// Import new modular sections
import HeroSection from "../../components/home/HeroSection";
import FeatureSection from "../../components/home/FeatureSection";
import ComparisonSection from "../../components/home/ComparisonSection";
import TopProductsSection from "../../components/home/TopProductsSection";
import ReviewsSection from "../../components/home/ReviewsSection";
import BlogSection from "../../components/home/BlogSection";
import CtaSection from "../../components/home/CtaSection";

export default function HomePage() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [myBlogs, setMyBlogs] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [showNotificationPanel, setShowNotificationPanel] = useState(false);
    const notificationRef = useRef(null);

    useEffect(() => {
        const fetchMyBlogs = async () => {
            if (!isAuthenticated) return;
            try {
                const data = await getMyBlogs({ page: 1, limit: 20 });
                setMyBlogs(data?.blogs || []);

                // Build notifications from blogs
                const rejected = data?.blogs?.filter((blog) => blog.status === "REJECTED") || [];
                const approved = data?.blogs?.filter((blog) => blog.status === "PUBLISHED") || [];
                
                const notificationsList = [];
                
                // Add rejection notifications
                rejected.forEach((blog) => {
                    notificationsList.push({
                        id: `rejection-${blog._id}`,
                        type: "rejection",
                        title: blog.title,
                        message: blog.rejectionReason || "No reason provided",
                        timestamp: blog.updatedAt,
                        read: false,
                    });
                });
                
                // Add approval notifications
                approved.forEach((blog) => {
                    notificationsList.push({
                        id: `approval-${blog._id}`,
                        type: "approval",
                        title: blog.title,
                        message: "Your blog has been approved and published!",
                        timestamp: blog.approvedAt,
                        read: false,
                    });
                });

                setNotifications(notificationsList);
            } catch {
                // ignore optional account notification errors
            }
        };

        fetchMyBlogs();
    }, [isAuthenticated]);

    // Close notification panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotificationPanel(false);
            }
        };

        if (showNotificationPanel) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showNotificationPanel]);

    const dismissNotification = (id) => {
        setNotifications(notifications.filter((notif) => notif.id !== id));
    };

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200">
            {/* Clean, Modern Navigation Bar */}
            <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100 transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center">
                            <Link to="/" className="group">
                                <h1 className="text-2xl font-black text-emerald-600 tracking-tight hover:text-emerald-700 transition-colors">
                                    Greenvy
                                </h1>
                            </Link>
                        </div>
                        
                        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
                            <Link to="/products" className="hover:text-emerald-500 transition-colors">Products</Link>
                            <Link to="/compare" className="hover:text-emerald-500 transition-colors">Compare</Link>
                            <Link to="/blogs" className="hover:text-emerald-500 transition-colors">Insights</Link>
                        </div>

                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <>
                                    <span className="hidden lg:block text-slate-600 text-sm font-medium">
                                        Hi, <span className="font-bold text-slate-900">{user?.name}</span>
                                    </span>

                                    {/* Notification Button */}
                                    <div className="relative" ref={notificationRef}>
                                        <button
                                            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                                            className="relative p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-full transition-all"
                                            title="Notifications"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                                />
                                            </svg>
                                            {notifications.length > 0 && (
                                                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-white">
                                                    {notifications.length}
                                                </span>
                                            )}
                                        </button>

                                        {/* Notification Dropdown Panel */}
                                        {showNotificationPanel && (
                                            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 z-50 max-h-96 overflow-y-auto">
                                                <div className="sticky top-0 bg-white/95 backdrop-blur px-5 py-4 border-b border-slate-100">
                                                    <h3 className="text-sm font-bold text-slate-900">
                                                        Notifications ({notifications.length})
                                                    </h3>
                                                </div>

                                                {notifications.length > 0 ? (
                                                    <div className="divide-y divide-slate-50">
                                                        {notifications.map((notif) => (
                                                            <div
                                                                key={notif.id}
                                                                className={`px-5 py-4 hover:bg-slate-50 transition-colors ${
                                                                    notif.type === "rejection"
                                                                        ? "border-l-4 border-l-red-500"
                                                                        : "border-l-4 border-l-emerald-500"
                                                                }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-3">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            {notif.type === "rejection" ? (
                                                                                <span className="text-red-500 text-sm">❌</span>
                                                                            ) : (
                                                                                <span className="text-emerald-500 text-sm">✅</span>
                                                                            )}
                                                                            <p className="text-sm font-bold text-slate-900 truncate">
                                                                                {notif.title}
                                                                            </p>
                                                                        </div>
                                                                        <p className="text-xs text-slate-500 leading-relaxed">
                                                                            {notif.message}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => dismissNotification(notif.id)}
                                                                        className="text-slate-400 hover:text-slate-600 p-1"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="px-5 py-8 text-center text-slate-500 text-sm">
                                                        You're all caught up!
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        to="/blogs/create"
                                        className="hidden md:inline-flex items-center justify-center px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-semibold hover:bg-emerald-100 transition-colors"
                                    >
                                        Create Blog
                                    </Link>
                                    
                                    {user?.role === "Admin" && (
                                        <Link
                                            to="/admin/dashboard"
                                            className="hidden lg:inline-flex px-4 py-2 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 text-slate-500 hover:text-slate-700 font-semibold transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="hidden sm:inline-flex px-5 py-2.5 text-slate-600 hover:text-slate-900 font-bold transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="inline-flex items-center justify-center px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md"
                                    >
                                        Sign up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Modular Main Content */}
            <main>
                <HeroSection />
                <FeatureSection />
                <ComparisonSection />
                <TopProductsSection />
                <ReviewsSection />
                <BlogSection />
                <CtaSection />
            </main>
        </div>
    );
}
