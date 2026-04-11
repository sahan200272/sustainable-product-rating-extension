import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, Zap, Leaf, ShieldCheck, ArrowRight, Recycle, Trophy } from "lucide-react";
import { motion, useInView, useMotionValue, animate } from "framer-motion";

// ── Data ─────────────────────────────────────────────────────────────────────
const ECO_PRODUCT = {
  emoji: "🌿",
  name: "Eco-Max Liquid",
  brand: "GreenLeaf Co.",
  tagline: "Zero Waste Refill",
  score: 94,
  isWinner: true,
  metrics: [
    { label: "Carbon Footprint", value: 92, gradient: "from-emerald-400 to-teal-400" },
    { label: "Eco Packaging",    value: 97, gradient: "from-emerald-400 to-teal-500" },
    { label: "Supply Chain",     value: 88, gradient: "from-teal-400 to-emerald-500" },
  ],
  features: [
    { icon: Leaf,        text: "Plant-based biodegradable ingredients" },
    { icon: Recycle,     text: "Infinitely recyclable packaging" },
    { icon: ShieldCheck, text: "Carbon neutral shipping" },
  ],
};

const STD_PRODUCT = {
  emoji: "🧴",
  name: "Market Standard X",
  brand: "GenBrand Inc.",
  tagline: "Standard Performance",
  score: 42,
  isWinner: false,
  metrics: [
    { label: "Carbon Footprint", value: 38, gradient: "from-red-400 to-orange-400" },
    { label: "Eco Packaging",    value: 22, gradient: "from-red-400 to-red-500" },
    { label: "Supply Chain",     value: 51, gradient: "from-orange-400 to-red-400" },
  ],
  features: [
    { icon: X, text: "Contains synthetic microplastics" },
    { icon: X, text: "High supply chain emissions" },
    { icon: X, text: "Single-use plastic container" },
  ],
};

// ── Animated score ring ───────────────────────────────────────────────────────
function ScoreRing({ score, isWinner }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(motionVal, score, { duration: 1.8, ease: "easeOut" });
    const unsub = motionVal.on("change", (v) => setDisplay(Math.round(v)));
    return () => { ctrl.stop(); unsub(); };
  }, [inView, score, motionVal]);

  return (
    <div
      ref={ref}
      className={`mt-5 w-24 h-24 rounded-full flex items-center justify-center relative
        ${isWinner
          ? "ring-4 ring-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.35)] bg-emerald-50"
          : "ring-4 ring-red-200 bg-red-50"
        }`}
    >
      {isWinner && (
        <motion.div
          className="absolute inset-0 rounded-full ring-4 ring-emerald-400/30"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      <div className="text-center z-10">
        <span className={`text-3xl font-black leading-none ${isWinner ? "text-emerald-600" : "text-red-500"}`}>
          {display}
        </span>
        <span className="block text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
          / 100
        </span>
      </div>
    </div>
  );
}

// ── Animated progress bar ─────────────────────────────────────────────────────
function AnimatedBar({ value, gradient }) {
  return (
    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
        initial={{ width: "0%" }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut", delay: 0.1 }}
      />
    </div>
  );
}

// ── Product card ──────────────────────────────────────────────────────────────
function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`flex-1 w-full relative flex flex-col rounded-3xl border transition-shadow duration-300
        ${product.isWinner
          ? "border-emerald-200 bg-white shadow-xl shadow-emerald-500/10 hover:shadow-2xl hover:shadow-emerald-500/15"
          : "border-slate-200 bg-white/90 shadow-md hover:shadow-xl opacity-95"
        }`}
    >
      {/* Winner badge */}
      {product.isWinner && (
        <motion.div
          initial={{ scale: 0, y: -10 }}
          whileInView={{ scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 400, delay: 0.4 }}
          className="absolute -top-5 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="flex items-center gap-1.5 px-5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold rounded-full shadow-lg shadow-emerald-500/40 whitespace-nowrap">
            <Trophy size={12} />
            Sustainable Pick
          </div>
        </motion.div>
      )}

      {/* Product header */}
      <div className={`rounded-t-3xl px-8 pt-10 pb-6 flex flex-col items-center
        ${product.isWinner ? "bg-gradient-to-b from-emerald-50/80 to-white" : "bg-gradient-to-b from-slate-50 to-white"}`}
      >
        <motion.div
          whileHover={{ scale: 1.08 }}
          className={`w-24 h-24 rounded-2xl flex items-center justify-center mb-4 text-5xl shadow-sm border
            ${product.isWinner ? "border-emerald-100 bg-white" : "border-slate-200 bg-white grayscale-[40%]"}`}
        >
          {product.emoji}
        </motion.div>

        <span className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">
          {product.brand}
        </span>
        <h3 className="text-xl font-extrabold text-slate-900 text-center leading-tight">
          {product.name}
        </h3>
        <p className={`text-sm font-semibold mt-1 ${product.isWinner ? "text-emerald-600" : "text-slate-400"}`}>
          {product.tagline}
        </p>

        <ScoreRing score={product.score} isWinner={product.isWinner} />
      </div>

      {/* Metrics */}
      <div className="px-7 pt-5 pb-2">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
          Sustainability Metrics
        </p>
        <div className="space-y-3.5">
          {product.metrics.map((m) => (
            <div key={m.label}>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs font-semibold text-slate-600">{m.label}</span>
                <span className="text-xs font-bold text-slate-800">{m.value}%</span>
              </div>
              <AnimatedBar value={m.value} gradient={m.gradient} />
            </div>
          ))}
        </div>
      </div>

      {/* Feature list */}
      <div className="px-7 pt-5 pb-8 flex-grow">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
          Key Attributes
        </p>
        <ul className="space-y-2.5">
          {product.features.map((f, i) => {
            const Icon = f.icon;
            return (
              <li key={i} className="flex items-start gap-2.5">
                <span className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                  ${product.isWinner ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-500"}`}
                >
                  <Icon size={11} strokeWidth={2.5} />
                </span>
                <span className="text-sm text-slate-600 leading-snug">{f.text}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
}

// ── Impact stat ───────────────────────────────────────────────────────────────
const IMPACT_STATS = [
  { label: "Lower Carbon Impact",    value: "52%",  sub: "choosing Eco-Max over Standard" },
  { label: "Plastic Saved",          value: "100%", sub: "with refillable packaging" },
  { label: "Greenvy Score Gap",      value: "+124", sub: "points higher on the Greenvy Index" },
];

// ── Main Section ──────────────────────────────────────────────────────────────
export default function ComparisonSection() {
  return (
    <section className="py-28 bg-slate-50/80 border-t border-slate-100 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-300 rounded-full blur-[150px] opacity-[0.09] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-sky-200 rounded-full blur-[140px] opacity-[0.08] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
            <Zap size={15} className="text-emerald-500" />
            <span>Battle of Products</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">
            See the{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Difference
            </span>{" "}
            Side by Side
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Common choices vs. verified sustainable leaders — data-driven, transparent, and honest.
          </p>
        </motion.div>

        {/* Cards row */}
        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-10 max-w-4xl mx-auto">
          <ProductCard product={ECO_PRODUCT} />

          {/* VS divider */}
          <div className="flex lg:flex-col items-center justify-center gap-3 shrink-0 lg:py-4">
            <div className="hidden lg:block w-px h-full bg-gradient-to-b from-transparent via-slate-200 to-transparent flex-1" />
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 350, damping: 20, delay: 0.3 }}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 text-white font-black text-sm flex items-center justify-center shadow-lg shadow-slate-900/25 ring-4 ring-white shrink-0"
            >
              VS
            </motion.div>
            <div className="hidden lg:block w-px h-full bg-gradient-to-b from-transparent via-slate-200 to-transparent flex-1" />
          </div>

          <ProductCard product={STD_PRODUCT} />
        </div>

        {/* Impact stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mt-14 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {IMPACT_STATS.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-6 text-center hover:shadow-lg hover:border-emerald-100 transition-shadow duration-300"
            >
              <p className="text-3xl font-black text-emerald-600 mb-1">{stat.value}</p>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">{stat.label}</p>
              <p className="text-xs text-slate-500 leading-snug">{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} className="inline-block">
            <Link
              to="/compare"
              id="comparison-cta"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-slate-800 transition-colors duration-200 shadow-lg shadow-slate-900/20 group"
            >
              Analyze More Products Side-by-Side
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </motion.div>
          <p className="mt-4 text-sm text-slate-400">Free to use · No account required to compare</p>
        </motion.div>
      </div>
    </section>
  );
}
