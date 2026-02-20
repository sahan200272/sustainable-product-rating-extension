import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function HomePage() {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

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
