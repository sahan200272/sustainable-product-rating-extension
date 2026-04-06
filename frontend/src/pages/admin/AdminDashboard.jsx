import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getAllProducts, deleteProduct } from "../../services/productServices";
import appLogo from "../../assets/icons/app_logo.png";
import {
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiBox,
    FiLogOut,
    FiGrid,
    FiPackage,
    FiCheckCircle,
    FiX,
    FiEye,
    FiSettings,
    FiFileText,
} from "react-icons/fi";
import {
    approveBlogPost,
    getAdminBlogs,
    rejectBlogPost,
} from "../../services/blogService";

function formatDate(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
}

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState("dashboard");

    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);

    const [blogs, setBlogs] = useState([]);
    const [blogsLoading, setBlogsLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState("");
    const [selectedBlogForContent, setSelectedBlogForContent] = useState(null);
    const [selectedBlogForReject, setSelectedBlogForReject] = useState(null);
    const [rejectionReason, setRejectionReason] = useState("");

    useEffect(() => {
        fetchProducts();
        fetchBlogs();
    }, []);

    const fetchProducts = async () => {
        setProductsLoading(true);
        try {
            const res = await getAllProducts();
            if (res.success && res.data) {
                setProducts(res.data);
            }
        } catch (error) {
            toast.error("Failed to fetch products");
        } finally {
            setProductsLoading(false);
        }
    };

    const fetchBlogs = async () => {
        setBlogsLoading(true);
        try {
            const data = await getAdminBlogs({ page: 1, limit: 100 });
            setBlogs(data?.blogs || []);
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to load moderation list");
        } finally {
            setBlogsLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to permanently delete this product?")) {
            try {
                await deleteProduct(id);
                toast.success("Product deleted successfully");
                setProducts(prev => prev.filter(p => p._id !== id));
            } catch (err) {
                toast.error("Failed to delete product");
            }
        }
    };

    const handleApprove = async (blogId) => {
        setActionLoadingId(blogId);
        try {
            await approveBlogPost(blogId);
            toast.success("Blog approved");
            await fetchBlogs();
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to approve blog");
        } finally {
            setActionLoadingId("");
        }
    };

    const handleOpenRejectModal = (blogId) => {
        setSelectedBlogForReject(blogId);
        setRejectionReason("");
    };

    const handleReject = async () => {
        if (!selectedBlogForReject) return;
        if (!rejectionReason.trim()) {
            toast.error("Rejection reason is required");
            return;
        }

        setActionLoadingId(selectedBlogForReject);
        try {
            await rejectBlogPost(selectedBlogForReject, rejectionReason.trim());
            toast.success("Blog rejected");
            setSelectedBlogForReject(null);
            setRejectionReason("");
            await fetchBlogs();
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to reject blog");
        } finally {
            setActionLoadingId("");
        }
    };

    const moderationStats = useMemo(() => {
        const pending = blogs.filter((b) => b.status === "PENDING").length;
        return {
            totalSubmissions: blogs.length,
            pending,
            approved: blogs.filter((b) => b.status === "PUBLISHED").length,
            rejected: blogs.filter((b) => b.status === "REJECTED").length,
        };
    }, [blogs]);

    const pendingBlogs = useMemo(
        () => blogs.filter((blog) => blog.status === "PENDING"),
        [blogs]
    );

    const scoreColor = (score = 0) => {
        if (score >= 70) return "bg-green-500";
        if (score >= 40) return "bg-yellow-500";
        return "bg-orange-500";
    };

    const dashboardCards = [
        {
            label: "TOTAL PRODUCTS",
            value: products.length,
            icon: <FiPackage className="h-5 w-5" />,
            panelClass: "bg-blue-50",
            iconClass: "bg-blue-600 text-white",
        },
        {
            label: "PENDING BLOGS",
            value: moderationStats.pending,
            icon: <FiFileText className="h-5 w-5" />,
            panelClass: "bg-amber-50",
            iconClass: "bg-amber-600 text-white",
        },
    ];

    const sidebarItems = [
        { key: "dashboard", label: "Dashboard", icon: <FiGrid className="h-4 w-4" /> },
        { key: "products", label: "Products", icon: <FiPackage className="h-4 w-4" /> },
        { key: "moderation", label: "Review blogs", icon: <FiCheckCircle className="h-4 w-4" /> },
        { key: "settings", label: "Settings", icon: <FiSettings className="h-4 w-4" /> },
    ];

    return (
        <div className="min-h-screen bg-[#f5faf7] text-slate-900">
            <div className="flex min-h-screen">
                <aside className="hidden w-64 border-r border-emerald-100 bg-gradient-to-b from-emerald-900 to-cyan-900 p-5 text-white md:flex md:flex-col">
                    <div className="mb-8 flex items-center gap-3">
                        <img
                            src={appLogo}
                            alt="Greenvy Logo"
                            className="h-12 w-12 rounded-xl object-contain bg-white/10 p-1.5 shadow-lg"
                        />
                        <div className="leading-tight">
                            <p className="text-2xl font-extrabold tracking-tight">Greenvy</p>
                            <p className="text-xs text-emerald-100">Management Hub</p>
                        </div>
                    </div>

                    <div className="mb-6 flex items-center gap-3 rounded-xl bg-white/10 p-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 font-bold uppercase">
                            {(user?.name || "A").slice(0, 1)}
                        </div>
                        <div>
                            <p className="text-sm font-semibold">{user?.name || "Admin"}</p>
                            <p className="text-xs text-emerald-100">Administrator</p>
                        </div>
                    </div>

                    <nav className="space-y-1">
                        {sidebarItems.map((item) => {
                            const isActive = activeSection === item.key;
                            return (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => setActiveSection(item.key)}
                                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                                        isActive
                                            ? "bg-emerald-300 text-emerald-950"
                                            : "text-white/90 hover:bg-white/10"
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>

                    <button
                        onClick={handleLogout}
                        className="mt-auto flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20"
                    >
                        <FiLogOut className="h-4 w-4" /> Logout
                    </button>
                </aside>

                <main className="flex-1">
                    <header className="border-b border-emerald-100 bg-white/80 px-4 py-4 backdrop-blur md:px-8">
                        <div className="mx-auto flex max-w-7xl items-center justify-between">
                            <h1 className="text-2xl font-extrabold text-slate-900">Admin Dashboard</h1>
                            <div className="flex items-center gap-3">
                                <span className="hidden rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700 sm:inline-flex">
                                    ADMINISTRATOR
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </header>

                    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
                        {activeSection === "dashboard" && (
                            <>
                                <div className="mb-6">
                                    <h2 className="text-3xl font-black text-slate-900">Admin Dashboard</h2>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Welcome back! Here&apos;s an overview of your store.
                                    </p>
                                </div>

                                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:max-w-xl">
                                    {dashboardCards.map((card) => (
                                        <div
                                            key={card.label}
                                            className={`rounded-2xl border border-slate-200 p-5 shadow-sm ${card.panelClass}`}
                                        >
                                            <div className="mb-3 flex items-center justify-between">
                                                <div
                                                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconClass}`}
                                                >
                                                    {card.icon}
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold tracking-wide text-slate-600">
                                                {card.label}
                                            </p>
                                            <p className="mt-1 text-4xl font-black text-slate-900">
                                                {card.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <h3 className="mb-4 text-3xl font-black text-slate-900">Quick Actions</h3>
                                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
                                        <button
                                            onClick={() => navigate("/add-product")}
                                            className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-left font-semibold text-blue-700 hover:bg-blue-100"
                                        >
                                            <FiPlus className="mr-2 inline h-4 w-4" /> Add New Product
                                        </button>
                                        <button
                                            onClick={() => setActiveSection("products")}
                                            className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-left font-semibold text-indigo-700 hover:bg-indigo-100"
                                        >
                                            <FiPackage className="mr-2 inline h-4 w-4" /> Manage Products
                                        </button>
                                        <button
                                            onClick={() => setActiveSection("moderation")}
                                            className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left font-semibold text-amber-700 hover:bg-amber-100"
                                        >
                                            <FiCheckCircle className="mr-2 inline h-4 w-4" /> Review Blogs
                                        </button>
                                        <button
                                            onClick={() => setActiveSection("settings")}
                                            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-left font-semibold text-emerald-700 hover:bg-emerald-100"
                                        >
                                            <FiSettings className="mr-2 inline h-4 w-4" /> Settings
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeSection === "products" && (
                            <>
                                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                            Products Datastore
                                        </h2>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Monitor, edit, and orchestrate all products available in the public catalog.
                                        </p>
                                    </div>
                                    <Link
                                        to="/add-product"
                                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-emerald-700 hover:shadow-lg"
                                    >
                                        <FiPlus className="h-5 w-5" /> Add New Product
                                    </Link>
                                </div>

                                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                        Product Info
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                        Brand / Category
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">
                                                        Sustainability
                                                    </th>
                                                    <th scope="col" className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-gray-500">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 bg-white">
                                                {productsLoading ? (
                                                    <tr>
                                                        <td colSpan="4" className="py-16 text-center">
                                                            <div className="flex flex-col items-center justify-center">
                                                                <div className="mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-500"></div>
                                                                <p className="text-sm font-medium text-gray-500">Loading Datastore...</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : products.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="4" className="py-16 text-center">
                                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                                <FiBox className="mb-3 h-12 w-12 text-gray-300" />
                                                                <p className="text-lg font-medium text-gray-900">No Products Found</p>
                                                                <p className="mt-1 text-sm">Your datastore is currently empty.</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    products.map((product) => (
                                                        <tr key={product._id} className="transition-colors hover:bg-gray-50/50">
                                                            <td className="whitespace-nowrap px-6 py-4">
                                                                <div className="flex items-center">
                                                                    <div className="h-10 w-10 flex-shrink-0">
                                                                        {product.images && product.images.length > 0 ? (
                                                                            <img className="h-10 w-10 rounded-lg border border-gray-200 object-cover" src={product.images[0].url || product.images[0]} alt="" />
                                                                        ) : (
                                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
                                                                                <FiBox className="text-gray-400" />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                                                        <div className="max-w-[200px] truncate text-xs text-gray-500">{product.description}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4">
                                                                <div className="text-sm font-medium text-gray-900">{product.brand}</div>
                                                                <span className="mt-1 inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                                                                    {product.category}
                                                                </span>
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-2 w-24 flex-1 overflow-hidden rounded-full bg-gray-100">
                                                                        <div
                                                                            className={`h-full rounded-full ${
                                                                                product.sustainabilityScore >= 80
                                                                                    ? "bg-emerald-500"
                                                                                    : product.sustainabilityScore >= 50
                                                                                      ? "bg-yellow-400"
                                                                                      : "bg-red-500"
                                                                            }`}
                                                                            style={{ width: `${product.sustainabilityScore || 0}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-sm font-bold text-gray-700">
                                                                        {Math.round(product.sustainabilityScore || 0)}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                                <div className="flex justify-end gap-2">
                                                                    <Link
                                                                        to={`/edit-product/${product._id}`}
                                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors hover:bg-indigo-100"
                                                                        title="Edit Product"
                                                                    >
                                                                        <FiEdit2 className="h-4 w-4" />
                                                                    </Link>
                                                                    <button
                                                                        onClick={() => handleDelete(product._id)}
                                                                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                                                                        title="Delete Product"
                                                                    >
                                                                        <FiTrash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}

                        {activeSection === "moderation" && (
                            <>
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-3xl font-black text-gray-900">Admin Moderation</h2>
                                </div>

                                <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                                    <div className="rounded-xl border bg-gray-50 p-4">
                                        <p className="text-3xl font-black">{moderationStats.totalSubmissions}</p>
                                        <p className="text-sm text-gray-600">Total Submissions</p>
                                    </div>
                                    <div className="rounded-xl border bg-yellow-50 p-4">
                                        <p className="text-3xl font-black">{moderationStats.pending}</p>
                                        <p className="text-sm text-gray-600">Pending Review</p>
                                    </div>
                                    <div className="rounded-xl border bg-green-50 p-4">
                                        <p className="text-3xl font-black">{moderationStats.approved}</p>
                                        <p className="text-sm text-gray-600">Approved Blogs</p>
                                    </div>
                                    <div className="rounded-xl border bg-red-50 p-4">
                                        <p className="text-3xl font-black">{moderationStats.rejected}</p>
                                        <p className="text-sm text-gray-600">Rejected Blogs</p>
                                    </div>
                                </div>

                                <div className="overflow-x-auto rounded-xl border bg-white">
                                    <table className="min-w-full text-left text-sm">
                                        <thead className="bg-emerald-100 text-gray-700">
                                            <tr>
                                                <th className="px-4 py-3 font-bold">Blog Title / Author</th>
                                                <th className="px-4 py-3 font-bold">Submitted Date</th>
                                                <th className="px-4 py-3 font-bold">AI Moderation Score</th>
                                                <th className="px-4 py-3 font-bold">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {blogsLoading ? (
                                                <tr>
                                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                                        Loading...
                                                    </td>
                                                </tr>
                                            ) : pendingBlogs.length === 0 ? (
                                                <tr>
                                                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                                                        No pending submissions
                                                    </td>
                                                </tr>
                                            ) : (
                                                pendingBlogs.map((blog) => {
                                                    const authorName =
                                                        `${blog?.author?.firstName || ""} ${blog?.author?.lastName || ""}`.trim() ||
                                                        "Unknown";
                                                    return (
                                                        <tr key={blog._id} className="border-t hover:bg-gray-50">
                                                            <td className="px-4 py-3">
                                                                <p className="font-semibold text-gray-900">{blog.title}</p>
                                                                <p className="text-xs text-gray-500">{authorName}</p>
                                                            </td>
                                                            <td className="px-4 py-3 text-gray-700">{formatDate(blog.createdAt)}</td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="h-2 w-20 overflow-hidden rounded-full bg-gray-200">
                                                                        <div
                                                                            className={`h-2 ${scoreColor(blog.moderationScore)}`}
                                                                            style={{ width: `${Math.max(0, Math.min(100, blog.moderationScore || 0))}%` }}
                                                                        />
                                                                    </div>
                                                                    <span className="text-xs font-semibold text-gray-700">
                                                                        {blog.moderationScore || 0}%
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3">
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        disabled={actionLoadingId === blog._id}
                                                                        onClick={() => handleApprove(blog._id)}
                                                                        className="rounded-md border border-green-200 px-2 py-1 text-green-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                                        title="Approve"
                                                                    >
                                                                        <FiCheckCircle className="h-4 w-4" />
                                                                    </button>
                                                                    <button
                                                                        disabled={actionLoadingId === blog._id}
                                                                        onClick={() => handleOpenRejectModal(blog._id)}
                                                                        className="rounded-md border border-red-200 px-2 py-1 text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                                        title="Reject"
                                                                    >
                                                                        <FiX className="h-4 w-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setSelectedBlogForContent(blog)}
                                                                        className="rounded-md border border-gray-200 px-2 py-1 text-gray-700"
                                                                        title="View"
                                                                    >
                                                                        <FiEye className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {activeSection === "settings" && (
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h2 className="text-2xl font-black text-slate-900">Settings</h2>
                                <p className="mt-2 text-sm text-slate-600">
                                    Settings section is ready for your future admin options.
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {selectedBlogForContent ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-2xl rounded-xl bg-white p-5 shadow-xl">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-gray-900">Blog Content</h2>
                            <button
                                type="button"
                                onClick={() => setSelectedBlogForContent(null)}
                                className="rounded-md border px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                        </div>
                        <p className="mb-2 text-sm font-semibold text-gray-800">
                            {selectedBlogForContent.title}
                        </p>
                        <div className="max-h-[60vh] whitespace-pre-line overflow-y-auto rounded-lg border bg-gray-50 p-3 text-sm text-gray-700">
                            {selectedBlogForContent.content || "No content available"}
                        </div>
                    </div>
                </div>
            ) : null}

            {selectedBlogForReject ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl">
                        <h2 className="text-lg font-bold text-gray-900">Reject Blog</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Please provide a rejection reason for the author.
                        </p>

                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            rows={4}
                            placeholder="Enter rejection reason"
                            className="mt-4 w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:outline-none"
                        />

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedBlogForReject(null);
                                    setRejectionReason("");
                                }}
                                className="rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={actionLoadingId === selectedBlogForReject}
                                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
                            >
                                {actionLoadingId === selectedBlogForReject ? "Rejecting..." : "Reject"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
