import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    approveBlogPost,
    getAdminBlogs,
    rejectBlogPost,
} from "../../services/blogService";

function formatDate(dateString) {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
}

export default function AdminModerationPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState("");
    const [blogs, setBlogs] = useState([]);

    const fetchBlogs = async () => {
        setLoading(true);
        try {
            const data = await getAdminBlogs({ page: 1, limit: 100 });
            setBlogs(data?.blogs || []);
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to load moderation list");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const stats = useMemo(() => {
        const total = blogs.length;
        const pending = blogs.filter((b) => b.status === "PENDING").length;
        const approved = blogs.filter((b) => b.status === "PUBLISHED").length;
        const rejected = blogs.filter((b) => b.status === "REJECTED").length;
        return { total, pending, approved, rejected };
    }, [blogs]);

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

    const handleReject = async (blogId) => {
        const reason = window.prompt("Enter rejection reason:");
        if (!reason || !reason.trim()) {
            return toast.error("Rejection reason is required");
        }

        setActionLoadingId(blogId);
        try {
            await rejectBlogPost(blogId, reason.trim());
            toast.success("Blog rejected");
            await fetchBlogs();
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to reject blog");
        } finally {
            setActionLoadingId("");
        }
    };

    const scoreColor = (score = 0) => {
        if (score >= 70) return "bg-green-500";
        if (score >= 40) return "bg-yellow-500";
        return "bg-orange-500";
    };

    return (
        <div className="min-h-screen bg-emerald-50 p-4 md:p-8">
            <div className="mx-auto max-w-6xl rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm md:p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-black text-gray-900">Admin Moderation</h1>
                    <button
                        onClick={() => navigate("/admin/dashboard")}
                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                        Back
                    </button>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                    <div className="rounded-xl border bg-gray-50 p-4">
                        <p className="text-3xl font-black">{stats.total}</p>
                        <p className="text-sm text-gray-600">Total Submissions</p>
                    </div>
                    <div className="rounded-xl border bg-yellow-50 p-4">
                        <p className="text-3xl font-black">{stats.pending}</p>
                        <p className="text-sm text-gray-600">Pending Review</p>
                    </div>
                    <div className="rounded-xl border bg-green-50 p-4">
                        <p className="text-3xl font-black">{stats.approved}</p>
                        <p className="text-sm text-gray-600">Approved Blogs</p>
                    </div>
                    <div className="rounded-xl border bg-red-50 p-4">
                        <p className="text-3xl font-black">{stats.rejected}</p>
                        <p className="text-sm text-gray-600">Rejected Blogs</p>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl border">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-emerald-100 text-gray-700">
                            <tr>
                                <th className="px-4 py-3 font-bold">Blog Title / Author</th>
                                <th className="px-4 py-3 font-bold">Submitted Date</th>
                                <th className="px-4 py-3 font-bold">AI Moderation Score</th>
                                <th className="px-4 py-3 font-bold">Status</th>
                                <th className="px-4 py-3 font-bold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                        Loading...
                                    </td>
                                </tr>
                            ) : blogs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                        No blog submissions found
                                    </td>
                                </tr>
                            ) : (
                                blogs.map((blog) => {
                                    const authorName = `${blog?.author?.firstName || ""} ${blog?.author?.lastName || ""}`.trim() || "Unknown";
                                    const isPending = blog.status === "PENDING";
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
                                                <span className={`rounded-full px-2 py-1 text-xs font-bold ${
                                                    blog.status === "PUBLISHED"
                                                        ? "bg-green-100 text-green-700"
                                                        : blog.status === "REJECTED"
                                                          ? "bg-red-100 text-red-700"
                                                          : "bg-yellow-100 text-yellow-700"
                                                }`}>
                                                    {blog.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        disabled={!isPending || actionLoadingId === blog._id}
                                                        onClick={() => handleApprove(blog._id)}
                                                        className="rounded-md border border-green-200 px-2 py-1 text-green-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                        title="Approve"
                                                    >
                                                        ✓
                                                    </button>
                                                    <button
                                                        disabled={!isPending || actionLoadingId === blog._id}
                                                        onClick={() => handleReject(blog._id)}
                                                        className="rounded-md border border-red-200 px-2 py-1 text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                        title="Reject"
                                                    >
                                                        ✕
                                                    </button>
                                                    <button
                                                        onClick={() => window.alert(blog.content || "No content available")}
                                                        className="rounded-md border border-gray-200 px-2 py-1 text-gray-700"
                                                        title="View"
                                                    >
                                                        👁
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
            </div>
        </div>
    );
}
