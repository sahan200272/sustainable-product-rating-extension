import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import {
    getPublicBlogById,
    likeBlogPost,
    unlikeBlogPost,
} from "../../services/blogService";

export default function BlogDetailsPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liking, setLiking] = useState(false);

    const currentUserId = user?._id || user?.id || "";
    const isAdminUser = (user?.role || "").toLowerCase() === "admin";
    const isAdminRoute = location.pathname.startsWith("/admin/");
    const isAdminPreview =
        isAdminRoute || new URLSearchParams(location.search).get("adminPreview") === "1";
    const isReadOnlyAdminPreview = isAdminUser && isAdminPreview;

    const authorName = useMemo(() => {
        if (!blog?.author) return "Author";
        return [blog.author.firstName, blog.author.lastName].filter(Boolean).join(" ") || "Author";
    }, [blog]);

    const isLikedByCurrentUser = useMemo(() => {
        if (!currentUserId || !Array.isArray(blog?.likedUsers)) return false;

        return blog.likedUsers.some((likedUser) => {
            if (!likedUser) return false;
            if (typeof likedUser === "string") return likedUser === currentUserId;
            if (typeof likedUser === "object") {
                return (likedUser._id || likedUser.id || likedUser.toString?.()) === currentUserId;
            }
            return false;
        });
    }, [blog, currentUserId]);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const data = await getPublicBlogById(id);
                setBlog(data?.blog || null);
            } catch (error) {
                toast.error(error?.response?.data?.error || "Failed to load blog details");
                navigate("/blogs");
            } finally {
                setLoading(false);
            }
        };

        fetchBlog();
    }, [id, navigate]);

    const handleToggleLike = async () => {
        if (!blog) return;

        if (!isAuthenticated) {
            toast.error("Please login to like this blog");
            navigate("/login");
            return;
        }

        try {
            setLiking(true);
            const result = isLikedByCurrentUser
                ? await unlikeBlogPost(blog._id)
                : await likeBlogPost(blog._id);

            if (result?.blog) {
                setBlog(result.blog);
            }
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to update like");
        } finally {
            setLiking(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
                <div className="mx-auto max-w-7xl rounded-2xl bg-white p-8 text-center shadow">
                    Loading blog details...
                </div>
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6">
                <div className="mx-auto max-w-7xl rounded-2xl bg-white p-8 text-center shadow">
                    Blog not found.
                </div>
            </div>
        );
    }

    const coverImage = blog.imageUrls?.[0] || blog.imageUrl || "";

    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-50 to-indigo-50 p-4 sm:p-6">
            <div className="mx-auto max-w-7xl">
                <div className="mb-5 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Blog Post Details</h1>
                    <Link
                        to={isReadOnlyAdminPreview ? "/admin/moderation" : "/blogs"}
                        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow hover:bg-indigo-50"
                    >
                        {isReadOnlyAdminPreview ? "Back to Moderation" : "Back to Feed"}
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <article className={`${isReadOnlyAdminPreview ? "lg:col-span-3" : "lg:col-span-2"} rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm`}>
                        {coverImage ? (
                            <img
                                src={coverImage}
                                alt={blog.title}
                                className="h-72 w-full rounded-xl object-cover"
                            />
                        ) : null}

                        <h2 className="mt-4 text-4xl font-bold leading-tight text-gray-900">
                            {blog.title}
                        </h2>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
                            <div>
                                <p className="text-sm text-gray-500">Author Info</p>
                                <p className="font-semibold text-gray-900">{authorName}</p>
                            </div>

                            {!isReadOnlyAdminPreview && (
                                <button
                                    type="button"
                                    onClick={handleToggleLike}
                                    disabled={liking}
                                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                                        isLikedByCurrentUser
                                            ? "bg-rose-100 text-rose-700 hover:bg-rose-200"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    } ${liking ? "cursor-not-allowed opacity-60" : ""}`}
                                >
                                    <span>{isLikedByCurrentUser ? "♥" : "♡"}</span>
                                    <span>{blog.likes || 0}</span>
                                </button>
                            )}
                        </div>

                        <p className="mt-5 whitespace-pre-line text-base leading-7 text-gray-700">
                            {blog.content}
                        </p>

                        {Array.isArray(blog.tags) && blog.tags.length > 0 ? (
                            <div className="mt-6 flex flex-wrap gap-2">
                                {blog.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        ) : null}
                    </article>

                    {!isReadOnlyAdminPreview && (
                        <aside className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-center">
                                <div className="h-20 w-20 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl">
                                    🌿
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 text-center">AI Education Hub</h3>
                            <p className="mt-2 text-center text-gray-600">
                                Generate personalized learning guidance from this blog.
                            </p>

                            <Link
                                to={`/blogs/${blog._id}/education-hub`}
                                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 text-lg font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-gray-800"
                            >
                                Generate Education Guide
                            </Link>
                        </aside>
                    )}
                </div>
            </div>
        </div>
    );
}
