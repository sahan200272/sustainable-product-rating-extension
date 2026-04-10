import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { RiAddLine, RiBookOpenLine, RiDeleteBinLine, RiMore2Fill, RiPencilLine } from "react-icons/ri";
import { deleteMyBlogPost, getMyBlogs } from "../../services/blogService";

const statusClassMap = {
  PUBLISHED: "bg-emerald-50 text-emerald-700 border-emerald-100",
  PENDING: "bg-amber-50 text-amber-700 border-amber-100",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-100",
};

export default function MyBlogsPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await getMyBlogs({ limit: 50 });
        if (cancelled) return;
        setBlogs(Array.isArray(response?.blogs) ? response.blogs : []);
      } catch (error) {
        if (!cancelled) {
          toast.error(error?.response?.data?.error || "Failed to load your blogs.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (blogId) => {
    const confirmed = window.confirm("Delete this blog post?");
    if (!confirmed) return;

    try {
      setProcessingId(blogId);
      await deleteMyBlogPost(blogId);
      setBlogs((prev) => prev.filter((blog) => blog._id !== blogId));
      toast.success("Blog deleted successfully");
    } catch (error) {
      toast.error(error?.response?.data?.error || "Failed to delete blog.");
    } finally {
      setProcessingId(null);
      setOpenMenuId(null);
    }
  };

  const handleUpdate = (blogId) => {
    setOpenMenuId(null);
    navigate(`/my-blogs/${blogId}/edit`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">My Blogs</h1>
            <p className="text-sm text-slate-500 mt-1">Only blog posts created by your account.</p>
          </div>
          <Link
            to="/blogs/create"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 transition-colors"
          >
            <RiAddLine className="text-base" />
            Create Blog
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-8 text-center text-slate-500 shadow-sm">
            Loading your blogs...
          </div>
        ) : blogs.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <RiBookOpenLine className="text-xl" />
            </div>
            <p className="text-slate-700 font-semibold">No blogs yet</p>
            <p className="text-sm text-slate-500 mt-1">Start writing your first sustainability article.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-emerald-200 transition-all"
              >
                <div className="relative">
                  {blog.imageUrls?.[0] || blog.imageUrl ? (
                    <Link to={`/blogs/${blog._id}`}>
                      <img
                        src={blog.imageUrls?.[0] || blog.imageUrl}
                        alt={blog.title}
                        className="h-44 w-full object-cover"
                      />
                    </Link>
                  ) : (
                    <Link to={`/blogs/${blog._id}`} className="flex h-44 w-full items-center justify-center bg-emerald-50 text-emerald-600">
                      <RiBookOpenLine className="text-3xl" />
                    </Link>
                  )}

                  <div className="absolute right-3 top-3">
                    <button
                      type="button"
                      onClick={() => setOpenMenuId((prev) => (prev === blog._id ? null : blog._id))}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow hover:bg-white"
                      aria-label="Open actions"
                    >
                      <RiMore2Fill className="text-lg" />
                    </button>

                    {openMenuId === blog._id ? (
                      <div className="absolute right-0 mt-2 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                        <button
                          type="button"
                          onClick={() => handleUpdate(blog._id)}
                          disabled={processingId === blog._id}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                          <RiPencilLine className="text-base" /> Update
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(blog._id)}
                          disabled={processingId === blog._id}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50"
                        >
                          <RiDeleteBinLine className="text-base" /> Delete
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>

                <Link to={`/blogs/${blog._id}`} className="block p-5">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="text-base font-black text-slate-900 line-clamp-2">{blog.title}</h2>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${statusClassMap[blog.status] || "bg-slate-50 text-slate-600 border-slate-200"}`}
                    >
                      {blog.status || "PENDING"}
                    </span>
                  </div>
                  <p className="line-clamp-3 text-sm text-slate-600">{blog.content}</p>
                  <p className="mt-4 text-xs text-slate-400">
                    {blog.category || "Blog"} • {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "—"}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
