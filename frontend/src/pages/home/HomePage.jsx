import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyBlogs } from "../../services/blogService";

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
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
            {/* Navigation Bar */}
            <nav className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-indigo-600">
                                Sustainable Products
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {isAuthenticated ? (
                                <>
                                    <span className="text-gray-700">
                                        Welcome, <span className="font-semibold">{user?.name}</span>
                                    </span>

                                    {/* Notification Button */}
                                    <div className="relative" ref={notificationRef}>
                                        <button
                                            onClick={() => setShowNotificationPanel(!showNotificationPanel)}
                                            className="relative p-2 text-gray-600 hover:text-indigo-600 transition-colors"
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
                                                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                                                    {notifications.length}
                                                </span>
                                            )}
                                        </button>

                                        {/* Notification Dropdown Panel */}
                                        {showNotificationPanel && (
                                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                                                <div className="sticky top-0 bg-indigo-50 px-4 py-3 border-b">
                                                    <h3 className="text-sm font-bold text-gray-900">
                                                        Notifications ({notifications.length})
                                                    </h3>
                                                </div>

                                                {notifications.length > 0 ? (
                                                    <div className="divide-y">
                                                        {notifications.map((notif) => (
                                                            <div
                                                                key={notif.id}
                                                                className={`px-4 py-3 hover:bg-gray-50 transition-colors ${
                                                                    notif.type === "rejection"
                                                                        ? "border-l-4 border-l-red-500"
                                                                        : "border-l-4 border-l-green-500"
                                                                }`}
                                                            >
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center gap-2 mb-1">
                                                                            {notif.type === "rejection" ? (
                                                                                <span className="text-lg">❌</span>
                                                                            ) : (
                                                                                <span className="text-lg">✅</span>
                                                                            )}
                                                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                                                {notif.title}
                                                                            </p>
                                                                        </div>
                                                                        <p
                                                                            className={`text-xs leading-relaxed ${
                                                                                notif.type === "rejection"
                                                                                    ? "text-red-700"
                                                                                    : "text-green-700"
                                                                            }`}
                                                                        >
                                                                            {notif.message}
                                                                        </p>
                                                                    </div>
                                                                    <button
                                                                        onClick={() =>
                                                                            dismissNotification(notif.id)
                                                                        }
                                                                        className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                                                                        title="Dismiss"
                                                                    >
                                                                        ✕
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                                        No notifications yet
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <Link
                                        to="/blogs/create"
                                        className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                    >
                                        Create Blog
                                    </Link>
                                    {user?.role === "Admin" && (
                                        <Link
                                            to="/admin/dashboard"
                                            className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="px-4 py-2 text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        {isAuthenticated 
                            ? `Welcome to Your Dashboard, ${user?.name}!` 
                            : "Welcome to Sustainable Products"}
                    </h2>
                    <p className="text-xl text-gray-600">
                        Discover and rate sustainable products
                    </p>
                    {!isAuthenticated && (
                        <div className="mt-6">
                            <Link
                                to="/register"
                                className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg"
                            >
                                Get Started Today
                            </Link>
                        </div>
                    )}
                </div>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">🌿</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Eco-Friendly Products
                        </h3>
                        <p className="text-gray-600">
                            Browse thousands of environmentally conscious products
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">⭐</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Rate Products
                        </h3>
                        <p className="text-gray-600">
                            Share your experience and help others make informed choices
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                        <div className="text-4xl mb-4">📊</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            View Analytics
                        </h3>
                        <p className="text-gray-600">
                            Track your contributions to sustainable living
                        </p>
                    </div>
                </div>

                {/* User Info Card - Only show when authenticated */}
                {isAuthenticated && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            Your Profile
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600">Name</p>
                                <p className="text-lg font-semibold text-gray-900">{user?.name}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Email</p>
                                <p className="text-lg font-semibold text-gray-900">{user?.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Role</p>
                                <p className="text-lg font-semibold text-gray-900">{user?.role}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Account Status</p>
                                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
