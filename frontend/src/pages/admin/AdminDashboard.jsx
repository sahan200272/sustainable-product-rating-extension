import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const stats = [
        { label: "Total Users", value: "1,234", icon: "👥", color: "bg-blue-500" },
        { label: "Total Products", value: "567", icon: "📦", color: "bg-green-500" },
        { label: "Total Ratings", value: "10,234", icon: "⭐", color: "bg-yellow-500" },
        { label: "Active Sessions", value: "89", icon: "🔥", color: "bg-red-500" },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navigation Bar */}
            <nav className="bg-indigo-600 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-white">
                                Admin Dashboard
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-white">
                                <span className="font-semibold">{user?.name}</span>
                                <span className="ml-2 px-2 py-1 bg-yellow-400 text-indigo-900 rounded text-xs font-bold">
                                    ADMIN
                                </span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">
                        Welcome back, {user?.name}!
                    </h2>
                    <p className="text-gray-600 mt-1">
                        Here's what's happening with your platform today.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm font-medium">
                                        {stat.label}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">
                                        {stat.value}
                                    </p>
                                </div>
                                <div className={`${stat.color} w-14 h-14 rounded-full flex items-center justify-center text-2xl`}>
                                    {stat.icon}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Admin Actions */}
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-left font-medium">
                                👤 Manage Users
                            </button>
                            <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-left font-medium">
                                📦 Manage Products
                            </button>
                            <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-left font-medium">
                                ⭐ View All Ratings
                            </button>
                            <button className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-left font-medium">
                                📊 Generate Reports
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Recent Activity
                        </h3>
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4 py-2">
                                <p className="font-medium text-gray-900">New user registered</p>
                                <p className="text-sm text-gray-500">2 minutes ago</p>
                            </div>
                            <div className="border-l-4 border-green-500 pl-4 py-2">
                                <p className="font-medium text-gray-900">Product added</p>
                                <p className="text-sm text-gray-500">15 minutes ago</p>
                            </div>
                            <div className="border-l-4 border-yellow-500 pl-4 py-2">
                                <p className="font-medium text-gray-900">New rating submitted</p>
                                <p className="text-sm text-gray-500">1 hour ago</p>
                            </div>
                            <div className="border-l-4 border-purple-500 pl-4 py-2">
                                <p className="font-medium text-gray-900">Report generated</p>
                                <p className="text-sm text-gray-500">3 hours ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* System Info */}
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                        System Information
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-gray-600 text-sm">Server Status</p>
                            <p className="text-lg font-semibold text-green-600 mt-1">● Online</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Database</p>
                            <p className="text-lg font-semibold text-green-600 mt-1">● Connected</p>
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Last Backup</p>
                            <p className="text-lg font-semibold text-gray-900 mt-1">2 hours ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
