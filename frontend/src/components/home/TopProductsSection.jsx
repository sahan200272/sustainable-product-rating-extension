import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Loader } from "lucide-react";
import api from "../../services/api";

export default function TopProductsSection() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const response = await api.get('/api/products/top');
                if (response.data.success) {
                    setProducts(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching top products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTopProducts();
    }, []);

    const colors = ["bg-amber-100", "bg-rose-100", "bg-slate-100", "bg-orange-50"];

    return (
        <section className="py-24 bg-slate-50 border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Top Rated This Week
                        </h2>
                        <p className="text-lg text-slate-600">
                            The highest performing products across our verified data points.
                        </p>
                    </div>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
                    >
                        View Full Directory <ArrowRight size={20} />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader className="animate-spin text-emerald-500 w-12 h-12" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {products.map((product, index) => {
                            const tags = [];
                            if (product.sustainability?.plasticFree) tags.push("Plastic-Free");
                            if (product.sustainability?.biodegradable) tags.push("Biodegradable");
                            if (product.sustainability?.crueltyFree) tags.push("Cruelty-Free");
                            if (product.sustainability?.fairTradeCertified) tags.push("Fair Trade");
                            if (product.sustainability?.recyclableMaterial) tags.push("Recyclable");

                            const displayTags = tags.slice(0, 2);
                            const color = colors[index % colors.length];

                            return (
                                <Link 
                                    key={product._id}
                                    to={`/products/${product._id}`}
                                    className="bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100 group"
                                >
                                    <div className={`h-48 ${color} relative overflow-hidden flex items-center justify-center`}>
                                        {/* Abstract shape replacing image */}
                                        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-black/20 via-transparent to-transparent"></div>
                                        {product.images && product.images.length > 0 ? (
                                            <img 
                                                src={product.images[0].url} 
                                                alt={product.name}
                                                className="w-full h-full object-cover mix-blend-multiply opacity-90 p-4 rounded-xl relative z-10"
                                            />
                                        ) : (
                                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full shadow-inner flex items-center justify-center text-slate-700 text-3xl z-10 relative">
                                                <Star size={32} strokeWidth={1.5} className="opacity-40" />
                                            </div>
                                        )}

                                        <div className="absolute top-4 right-4 bg-white shadow-md text-emerald-600 font-bold px-3 py-1 rounded-full text-sm flex items-center gap-1 z-20">
                                            {product.sustainabilityScore} <span className="text-[10px] text-slate-400">/ 100</span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1 truncate">
                                            {product.brand}
                                        </p>
                                        <h3 className="text-lg font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors line-clamp-1">
                                            {product.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {displayTags.length > 0 ? displayTags.map(tag => (
                                                <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                                                    {tag}
                                                </span>
                                            )) : (
                                                <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                                                    Eco-Friendly
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
