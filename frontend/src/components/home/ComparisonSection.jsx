import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X, Zap, Leaf, ShieldCheck, ArrowRight, Recycle } from "lucide-react";

// ─────────────────────────────────────────────
// Static data for the homepage preview
// ─────────────────────────────────────────────
const ECO_PRODUCT = {
    emoji: "🌿",
    name: "Eco-Max Liquid",
    brand: "GreenLeaf Co.",
    tagline: "Zero Waste Refill",
    score: 94,
    scoreColor: "text-emerald-600",
    scoreBorder: "border-emerald-500",
    scoreBg: "bg-emerald-50",
    badge: "Sustainable Pick",
    badgeBg: "bg-emerald-500",
    metrics: [
        { label: "Carbon Footprint", value: 92, color: "bg-emerald-500" },
        { label: "Eco Packaging",    value: 97, color: "bg-emerald-400" },
        { label: "Supply Chain",     value: 88, color: "bg-emerald-500" },
    ],
    features: [
        { icon: Leaf,        text: "Plant-based biodegradable ingredients" },
        { icon: Recycle,     text: "Infinitely recyclable packaging" },
        { icon: ShieldCheck, text: "Carbon neutral shipping" },
    ],
    positive: true,
};

const STD_PRODUCT = {
    emoji: "🧴",
    name: "Market Standard X",
    brand: "GenBrand Inc.",
    tagline: "Standard Performance",
    score: 42,
    scoreColor: "text-red-500",
    scoreBorder: "border-red-400",
    scoreBg: "bg-red-50",
    badge: null,
    badgeBg: null,
    metrics: [
        { label: "Carbon Footprint", value: 38, color: "bg-red-400" },
        { label: "Eco Packaging",    value: 22, color: "bg-red-400" },
        { label: "Supply Chain",     value: 51, color: "bg-orange-400" },
    ],
    features: [
        { icon: X, text: "Contains synthetic microplastics" },
        { icon: X, text: "High supply chain emissions" },
        { icon: X, text: "Single-use plastic container" },
    ],
    positive: false,
};

// ─────────────────────────────────────────────
// Sub-component: single product card
// ─────────────────────────────────────────────
function ProductCard({ product, side }) {
    const isEco = product.positive;

    return (
        <div
            className={`
                flex-1 w-full relative flex flex-col
                bg-white rounded-3xl border transition-all duration-300
                hover:-translate-y-1 hover:shadow-2xl
                ${isEco
                    ? "border-emerald-100 shadow-xl shadow-emerald-500/10"
                    : "border-slate-200 shadow-md opacity-95"
                }
            `}
        >
            {/* Winner badge */}
            {product.badge && (
                <div
                    className={`
                        absolute -top-4 left-1/2 -translate-x-1/2
                        px-5 py-1.5 ${product.badgeBg} text-white
                        text-xs font-bold rounded-full uppercase tracking-widest
                        shadow-lg shadow-emerald-500/30 z-10 whitespace-nowrap
                    `}
                >
                    ✦ {product.badge}
                </div>
            )}

            {/* Product image area */}
            <div
                className={`
                    rounded-t-3xl px-8 pt-10 pb-6 flex flex-col items-center
                    ${isEco ? "bg-gradient-to-b from-emerald-50/80 to-white" : "bg-gradient-to-b from-slate-50 to-white"}
                `}
            >
                <div
                    className={`
                        w-24 h-24 rounded-2xl flex flex-col items-center justify-center mb-4
                        text-5xl shadow-sm border
                        ${isEco ? "border-emerald-100 bg-white" : "border-slate-200 bg-white grayscale-[30%]"}
                    `}
                >
                    {product.emoji}
                </div>

                <span className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-1">
                    {product.brand}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 text-center leading-tight">
                    {product.name}
                </h3>
                <p className={`text-sm font-semibold mt-1 ${isEco ? "text-emerald-600" : "text-slate-400"}`}>
                    {product.tagline}
                </p>

                {/* Score ring */}
                <div
                    className={`
                        mt-5 w-20 h-20 rounded-full border-4 flex items-center justify-center
                        ${product.scoreBorder} ${product.scoreBg} shadow-inner
                    `}
                >
                    <div className="text-center">
                        <span className={`text-2xl font-black ${product.scoreColor} leading-none`}>
                            {product.score}
                        </span>
                        <span className="block text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                            / 100
                        </span>
                    </div>
                </div>
            </div>

            {/* Metrics */}
            <div className="px-7 pt-5 pb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                    Sustainability Metrics
                </p>
                <div className="space-y-3">
                    {product.metrics.map((m) => (
                        <div key={m.label}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-semibold text-slate-600">{m.label}</span>
                                <span className="text-xs font-bold text-slate-800">{m.value}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${m.color} rounded-full transition-all duration-700`}
                                    style={{ width: `${m.value}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature list */}
            <div className="px-7 pt-5 pb-7 flex-grow">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">
                    Key Attributes
                </p>
                <ul className="space-y-2.5">
                    {product.features.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <li key={i} className="flex items-start gap-2.5">
                                <span
                                    className={`
                                        mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center
                                        ${isEco
                                            ? "bg-emerald-100 text-emerald-600"
                                            : "bg-red-100 text-red-500"
                                        }
                                    `}
                                >
                                    <Icon size={11} strokeWidth={2.5} />
                                </span>
                                <span className="text-sm text-slate-600 leading-snug">
                                    {f.text}
                                </span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// Main section
// ─────────────────────────────────────────────
export default function ComparisonSection() {
    return (
        <section className="py-24 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
            {/* Decorative background blobs – same pattern as CTA section */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-400 rounded-full blur-[140px] opacity-[0.07] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400 rounded-full blur-[140px] opacity-[0.06] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* ── Section header ── */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    {/* Section badge – same pattern as HeroSection */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-6">
                        <Zap size={15} />
                        <span>SDG 12 · Responsible Consumption</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                        Battle of Products
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed">
                        See how common choices stack up against verified sustainable leaders —
                        side-by-side, data-driven, and transparent.
                    </p>
                </div>

                {/* ── Cards row ── */}
                <div className="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-10 max-w-4xl mx-auto">
                    <ProductCard product={ECO_PRODUCT} side="left" />

                    {/* VS divider */}
                    <div className="flex lg:flex-col items-center justify-center gap-3 shrink-0 lg:py-4">
                        <div className="hidden lg:block w-px h-full bg-slate-200 flex-1" />
                        <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-black text-base flex items-center justify-center shadow-lg shadow-slate-900/20 ring-4 ring-white shrink-0">
                            VS
                        </div>
                        <div className="hidden lg:block w-px h-full bg-slate-200 flex-1" />
                    </div>

                    <ProductCard product={STD_PRODUCT} side="right" />
                </div>

                {/* ── Impact callout strip ── */}
                <div className="mt-14 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: "Lower Carbon Impact",    value: "52%",  sub: "choosing Eco-Max over Standard" },
                        { label: "Plastic Saved",          value: "100%", sub: "with refillable packaging" },
                        { label: "Sustainability Score ↑", value: "+124", sub: "points higher on Greenvy Index" },
                    ].map((stat) => (
                        <div
                            key={stat.label}
                            className="bg-white rounded-2xl border border-slate-100 shadow-sm px-6 py-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <p className="text-2xl font-black text-emerald-600 mb-0.5">
                                {stat.value}
                            </p>
                            <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                                {stat.label}
                            </p>
                            <p className="text-xs text-slate-500">{stat.sub}</p>
                        </div>
                    ))}
                </div>

                {/* ── CTA ── */}
                <div className="mt-12 text-center">
                    <Link
                        to="/compare"
                        className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-base hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-slate-900/20"
                    >
                        Analyze More Products Side-by-Side
                        <ArrowRight size={18} />
                    </Link>
                    <p className="mt-4 text-sm text-slate-400">
                        Free to use · No account required to compare
                    </p>
                </div>
            </div>
        </section>
    );
}
