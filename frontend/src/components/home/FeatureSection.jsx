import React from "react";
import { Link } from "react-router-dom";
import { Leaf, BarChart2, ShieldCheck, ArrowRight, Sparkles, Users } from "lucide-react";

// ─────────────────────────────────────────────
// Feature card data
// ─────────────────────────────────────────────
const FEATURES = [
  {
    id: "score",
    icon: Leaf,
    gradient: "from-emerald-400 to-teal-500",
    glowColor: "emerald",
    title: "Smart Sustainability Score",
    desc: "Instant AI-powered eco ratings for every product.",
    badge: "AI-Powered",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    stat: "94% accuracy",
    statIcon: Sparkles,
  },
  {
    id: "compare",
    icon: BarChart2,
    gradient: "from-blue-400 to-indigo-500",
    glowColor: "blue",
    title: "Compare Smarter",
    desc: "Side-by-side eco insights with better alternatives.",
    badge: "Real-time",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-100",
    stat: "1k+ Products",
    statIcon: Sparkles,
  },
  {
    id: "verified",
    icon: ShieldCheck,
    gradient: "from-violet-400 to-purple-500",
    glowColor: "violet",
    title: "Trusted & Transparent",
    desc: "Community + AI verification to eliminate greenwashing.",
    badge: "Verified",
    badgeColor: "bg-violet-50 text-violet-700 border-violet-100",
    stat: "2k+ Reviews",
    statIcon: Users,
  },
];

// ─────────────────────────────────────────────
// Feature card sub-component
// ─────────────────────────────────────────────
function FeatureCard({ feature, index }) {
  const Icon = feature.icon;
  const StatIcon = feature.statIcon;

  return (
    <div
      className="group relative flex flex-col bg-white/70 backdrop-blur-md rounded-3xl p-8 border border-white/80 shadow-md
                 hover:shadow-2xl hover:-translate-y-2 hover:border-white transition-all duration-300 ease-in-out cursor-default"
      style={{ animationDelay: `${index * 120}ms` }}
    >
      {/* Subtle glow on hover */}
      <div
        className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
          bg-gradient-to-br ${feature.gradient} blur-2xl -z-10 scale-95`}
        style={{ opacity: 0 }}
      />

      {/* Top row: icon + badge */}
      <div className="flex items-start justify-between mb-6">
        {/* Gradient icon background */}
        <div
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center
                     shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
        >
          <Icon size={26} className="text-white" strokeWidth={2} />
        </div>

        {/* Badge */}
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full border text-xs font-semibold tracking-wide ${feature.badgeColor}`}
        >
          {feature.badge}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-extrabold text-slate-900 mb-2 leading-snug group-hover:text-slate-800 transition-colors">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-slate-500 text-sm leading-relaxed flex-grow">
        {feature.desc}
      </p>

      {/* Stat strip */}
      <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-2">
        <StatIcon
          size={14}
          className={`
            ${feature.glowColor === "emerald" ? "text-emerald-500" : ""}
            ${feature.glowColor === "blue" ? "text-blue-500" : ""}
            ${feature.glowColor === "violet" ? "text-violet-500" : ""}
            group-hover:animate-pulse
          `}
        />
        <span className="text-xs font-bold text-slate-600 tracking-wide">
          {feature.stat}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main FeatureSection
// ─────────────────────────────────────────────
export default function FeatureSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* ── Soft eco-gradient background ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50/60 to-white -z-20" />

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-emerald-300 rounded-full blur-[160px] opacity-[0.12] translate-x-1/3 -translate-y-1/4 pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-teal-300 rounded-full blur-[140px] opacity-[0.10] -translate-x-1/3 translate-y-1/4 pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-200 rounded-full blur-[100px] opacity-[0.08] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section header ── */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          {/* SDG badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-6 shadow-sm">
            <Leaf size={15} className="text-emerald-500" />
            <span>SDG 12 · Responsible Consumption</span>
          </div>

          {/* Heading with gradient keyword */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">
            Make Smarter,{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
              Sustainable
            </span>{" "}
            Choices
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-slate-500 leading-relaxed">
            Understand product impact, compare smarter, and choose responsibly.
          </p>
        </div>

        {/* ── Feature cards grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* ── Divider ── */}
        <div className="mt-16 flex items-center gap-4 max-w-sm mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
        </div>

        {/* ── CTA ── */}
        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4
                       bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl
                       font-bold text-base shadow-lg shadow-emerald-500/30
                       hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5
                       transition-all duration-300 ease-in-out group"
          >
            Explore Sustainable Products
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform duration-300"
            />
          </Link>
          <p className="mt-4 text-sm text-slate-400 font-medium">
            Free to use · Verified eco data · No account required
          </p>
        </div>
      </div>
    </section>
  );
}
