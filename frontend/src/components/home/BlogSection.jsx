import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, BookOpen, Loader } from "lucide-react";
import api from "../../services/api";

export default function BlogSection() {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                // Fetch top 2 published blogs
                const response = await api.get('/api/blogs?limit=2');
                if (response.data && response.data.blogs) {
                    setBlogs(response.data.blogs);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    // Calculate approximate read time
    const calculateReadTime = (content) => {
        const wordsPerMinute = 200;
        const noOfWords = content ? content.split(/\s/g).length : 0;
        const minutes = Math.ceil(noOfWords / wordsPerMinute);
        return `${minutes || 1} min read`;
    };

    const getCategoryStyles = (category) => {
        const styles = {
            "Education": { color: "bg-emerald-100", icon: "🍃" },
            "Science": { color: "bg-blue-100", icon: "🔬" },
            "Lifestyle": { color: "bg-amber-100", icon: "🌱" },
            "News": { color: "bg-purple-100", icon: "📰" },
        };
        
        return styles[category] || { color: "bg-slate-100", icon: "📚" };
    };

    return (
        <section className="py-24 bg-slate-50 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            The Insight Hub
                        </h2>
                        <p className="text-lg text-slate-600 max-w-2xl">
                            Uncovering the environmental reality of modern retail through data-driven articles.
                        </p>
                    </div>
                    <Link
                        to="/blogs"
                        className="inline-flex items-center gap-2 px-6 py-3 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                        Explore more blogs <ArrowRight size={18} />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader className="animate-spin text-emerald-500 w-12 h-12" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-8">
                        {blogs.length > 0 ? (
                            blogs.map((blog) => {
                                const { color: imageColor, icon } = getCategoryStyles(blog.category);
                                const authorName = blog.author ? `${blog.author.firstName || ''} ${blog.author.lastName || ''}`.trim() : "Unknown Author";

                                return (
                                    <Link 
                                        key={blog._id}
                                        to={`/blogs/${blog._id}`}
                                        className="group flex flex-col sm:flex-row bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
                                    >
                                        <div className={`sm:w-2/5 p-8 ${imageColor} flex items-center justify-center relative`}>
                                            {blog.imageUrl ? (
                                                <img 
                                                    src={blog.imageUrl} 
                                                    alt={blog.title} 
                                                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply transition-transform duration-700 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="text-6xl group-hover:scale-110 transition-transform duration-500 z-10 relative">
                                                    {icon}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-8 sm:w-3/5 flex flex-col justify-center">
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                                                    {blog.category || "Article"}
                                                </span>
                                                <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
                                                    <Clock size={12} /> {calculateReadTime(blog.content)}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors leading-snug line-clamp-2">
                                                {blog.title}
                                            </h3>
                                            <div className="mt-auto flex items-center gap-2 text-sm font-semibold text-slate-600">
                                                <BookOpen size={16} className="text-slate-400" />
                                                By {authorName}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })
                        ) : (
                            <div className="col-span-2 text-center text-slate-500 py-8">
                                No insights published yet. Check back soon!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
