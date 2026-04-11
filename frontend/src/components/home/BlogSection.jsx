import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, BookOpen, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonBlogCard() {
  return (
    <div className="flex flex-col sm:flex-row bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
      <div className="sm:w-2/5 h-56 sm:h-auto animate-shimmer" />
      <div className="p-8 sm:w-3/5 space-y-4 flex flex-col justify-center">
        <div className="flex gap-2">
          <div className="h-6 w-20 rounded-full animate-shimmer" />
          <div className="h-6 w-16 rounded-full animate-shimmer" />
        </div>
        <div className="h-5 w-full rounded animate-shimmer" />
        <div className="h-5 w-4/5 rounded animate-shimmer" />
        <div className="h-4 w-32 rounded animate-shimmer mt-2" />
      </div>
    </div>
  );
}

// ── Category styles ───────────────────────────────────────────────────────────
const CATEGORY_STYLES = {
  Education: { bg: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500", imgBg: "bg-emerald-50" },
  Science:   { bg: "bg-blue-50 text-blue-700 border-blue-100",           dot: "bg-blue-500",   imgBg: "bg-blue-50" },
  Lifestyle: { bg: "bg-amber-50 text-amber-700 border-amber-100",         dot: "bg-amber-500",  imgBg: "bg-amber-50" },
  News:      { bg: "bg-purple-50 text-purple-700 border-purple-100",      dot: "bg-purple-500", imgBg: "bg-purple-50" },
};
const DEFAULT_STYLE = { bg: "bg-slate-50 text-slate-700 border-slate-100", dot: "bg-slate-400", imgBg: "bg-slate-50" };

const CATEGORY_EMOJI = {
  Education: "🍃", Science: "🔬", Lifestyle: "🌱", News: "📰",
};

const calcReadTime = (content) => {
  const words = content ? content.split(/\s/g).length : 0;
  return `${Math.ceil(words / 200) || 1} min read`;
};

// ── Blog card ─────────────────────────────────────────────────────────────────
function BlogCard({ blog, index }) {
  const style = CATEGORY_STYLES[blog.category] || DEFAULT_STYLE;
  const emoji = CATEGORY_EMOJI[blog.category] || "📚";
  const author = blog.author
    ? `${blog.author.firstName || ""} ${blog.author.lastName || ""}`.trim()
    : "Greenvy Team";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.12 }}
      whileHover={{ y: -6 }}
    >
      <Link
        to={`/blogs/${blog._id}`}
        className="group flex flex-col sm:flex-row bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-md hover:shadow-2xl hover:border-emerald-100 transition-all duration-350"
      >
        {/* Image panel */}
        <div className={`sm:w-2/5 min-h-[200px] sm:min-h-0 ${style.imgBg} relative overflow-hidden flex items-center justify-center`}>
          {blog.imageUrl ? (
            <>
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            </>
          ) : (
            <motion.div
              className="text-6xl z-10 relative"
              whileHover={{ scale: 1.15, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {emoji}
            </motion.div>
          )}

          {/* Category overlay badge on hover */}
          <div className="absolute bottom-3 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${style.bg} shadow-sm backdrop-blur-sm`}>
              <Leaf size={10} />
              {blog.category || "Article"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 sm:w-3/5 flex flex-col justify-between">
          <div>
            {/* Category + reading time */}
            <div className="flex items-center gap-2.5 mb-4 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${style.bg}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                {blog.category || "Article"}
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">
                <Clock size={11} />
                {calcReadTime(blog.content)}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-extrabold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors duration-200 leading-snug line-clamp-2">
              {blog.title}
            </h3>

            {/* Excerpt */}
            {blog.content && (
              <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
                {blog.content.replace(/<[^>]+>/g, "").slice(0, 160)}…
              </p>
            )}
          </div>

          {/* Author + read link */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
              <BookOpen size={15} className="text-slate-400" />
              By {author}
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              Read more <ArrowRight size={12} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function BlogSection() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get("/api/blogs?limit=2");
        if (response.data?.blogs) setBlogs(response.data.blogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <section className="py-28 bg-white border-t border-slate-100 relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-emerald-50 rounded-full blur-[100px] opacity-60 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold mb-4">
              <BookOpen size={12} />
              Eco Insights
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
              The Insight Hub
            </h2>
            <p className="text-lg text-slate-500 max-w-lg">
              Uncovering the environmental reality of modern retail through data-driven articles.
            </p>
          </div>

          <motion.div whileHover={{ x: 3 }} className="shrink-0">
            <Link
              to="/blogs"
              id="blog-section-view-all"
              className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 hover:border-emerald-200 transition-all duration-200 text-sm"
            >
              Explore All Insights <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Blog cards */}
        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            <SkeletonBlogCard /><SkeletonBlogCard />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {blogs.length > 0 ? (
              blogs.map((blog, index) => <BlogCard key={blog._id} blog={blog} index={index} />)
            ) : (
              <div className="col-span-2 text-center text-slate-400 py-12 bg-slate-50 rounded-3xl border border-slate-100">
                <BookOpen className="mx-auto h-10 w-10 text-slate-300 mb-3" />
                <p className="font-medium">No insights published yet. Check back soon!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
