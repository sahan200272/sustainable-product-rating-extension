import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Leaf, Award } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
      <div className="h-40 sm:h-52 animate-shimmer rounded-t-2xl" />
      <div className="p-4 sm:p-6 space-y-3">
        <div className="h-3 w-1/3 rounded animate-shimmer" />
        <div className="h-5 w-2/3 rounded animate-shimmer" />
        <div className="flex gap-2 mt-4">
          <div className="h-6 w-20 rounded-full animate-shimmer" />
          <div className="h-6 w-16 rounded-full animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

// ── Score badge ───────────────────────────────────────────────────────────────
function ScoreBadge({ score }) {
  const color =
    score >= 80 ? "bg-emerald-500 ring-emerald-300 shadow-emerald-500/30"
    : score >= 60 ? "bg-teal-500 ring-teal-300 shadow-teal-500/30"
    : score >= 40 ? "bg-amber-500 ring-amber-300 shadow-amber-500/30"
    : "bg-red-500 ring-red-300 shadow-red-500/30";

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: false }}
      transition={{ type: "spring", stiffness: 350, delay: 0.2 }}
      className={`absolute top-4 right-4 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full
        text-white text-sm font-bold shadow-lg ring-2 ring-white ${color}`}
    >
      <Leaf size={11} />
      {score}
    </motion.div>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
const cardColors = ["bg-emerald-50", "bg-sky-50", "bg-amber-50", "bg-rose-50"];

function ProductCard({ product, index }) {
  const tags = [];
  if (product.sustainability?.plasticFree) tags.push("Plastic-Free");
  if (product.sustainability?.biodegradable) tags.push("Biodegradable");
  if (product.sustainability?.crueltyFree) tags.push("Cruelty-Free");
  if (product.sustainability?.fairTradeCertified) tags.push("Fair Trade");
  if (product.sustainability?.recyclableMaterial) tags.push("Recyclable");

  const displayTags = tags.slice(0, 2);
  const bgColor = cardColors[index % cardColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
    >
      <Link
        to={`/products/${product._id}`}
        className="group flex flex-col bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 border border-slate-100 shadow-md"
      >
        {/* Image area */}
        <div className={`h-40 sm:h-52 ${bgColor} relative overflow-hidden flex items-center justify-center`}>
          {product.images && product.images.length > 0 ? (
            <>
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply opacity-90 p-4 relative z-10
                           group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center z-10">
                <Star size={32} strokeWidth={1.5} className="text-slate-400 opacity-50" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          )}

          <ScoreBadge score={product.sustainabilityScore} />

          {/* Eco certified overlay on hover */}
          <motion.div
            className="absolute bottom-3 left-3 z-20 flex items-center gap-1 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-emerald-700 text-xs font-bold border border-emerald-100 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <Award size={11} />
            Eco Certified
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 flex flex-col flex-grow">
          <p className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-1 truncate">
            {product.brand}
          </p>
          <h3 className="text-base font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-1">
            {product.name}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-auto">
            {displayTags.length > 0 ? (
              displayTags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100"
                >
                  {tag}
                </span>
              ))
            ) : (
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                Eco-Friendly
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function TopProductsSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const response = await api.get("/api/products/top");
        if (response.data.success) setProducts(response.data.data);
      } catch (error) {
        console.error("Error fetching top products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopProducts();
  }, []);

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-white border-t border-slate-100 relative overflow-hidden">
      {/* Decorative blob */}
      <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-emerald-100 rounded-full blur-[120px] opacity-30 translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-3 sm:gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-xs font-bold mb-4">
              <Star size={12} className="fill-amber-500 text-amber-500" />
              Community Favourites
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 mb-1 sm:mb-2 tracking-tight">
              Top Rated This Week
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Highest performing products across verified sustainability data points.
            </p>
          </div>
          <motion.div whileHover={{ x: 3 }} className="shrink-0">
            <Link
              to="/products"
              id="top-products-view-all"
              className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors text-sm"
            >
              View Full Directory <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
