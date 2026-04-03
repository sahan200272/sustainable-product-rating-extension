import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicBlogs } from "../../services/blogService";

export default function PublicBlogFeedPage() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublishedBlogs = async () => {
            try {
                const data = await getPublicBlogs({ page: 1, limit: 24 });
                setBlogs(data?.blogs || []);
            } catch {
                setBlogs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPublishedBlogs();
    }, []);

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Public Blog Feed</h1>
                        <p className="text-gray-600 mt-1">
                            Approved sustainability posts visible to every user
                        </p>
                    </div>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-indigo-700 shadow hover:bg-indigo-50"
                    >
                        Back to Dashboard
                    </Link>
                </div>

                {loading ? (
                    <div className="rounded-xl bg-white p-8 text-center text-gray-600 shadow">
                        Loading approved blogs...
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="rounded-xl bg-white p-8 text-center text-gray-600 shadow">
                        No approved blogs available yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {blogs.map((blog) => {
                            const coverImage = blog.imageUrls?.[0] || blog.imageUrl || "";
                            const authorName = [blog.author?.firstName, blog.author?.lastName]
                                .filter(Boolean)
                                .join(" ") || "Author";

                            return (
                                <article
                                    key={blog._id}
                                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                                >
                                    {coverImage ? (
                                        <img
                                            src={coverImage}
                                            alt={blog.title}
                                            className="h-44 w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-44 w-full bg-gray-100" />
                                    )}

                                    <div className="p-4">
                                        <div className="mb-2 flex items-center justify-between gap-3">
                                            <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                                                {blog.category}
                                            </span>
                                            <span className="text-xs text-gray-500">By {authorName}</span>
                                        </div>

                                        <h2 className="text-lg font-bold text-gray-900 line-clamp-2">
                                            {blog.title}
                                        </h2>
                                        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                                            {blog.content}
                                        </p>
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
