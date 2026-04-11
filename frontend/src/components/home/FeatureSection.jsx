import React from "react";
import { Link } from "react-router-dom";
import { Leaf, BarChart2, ShieldCheck, ArrowRight, Sparkles, Users } from "lucide-react";
import { motion } from "framer-motion";

// ── Data ────────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    id: "score",
    icon: Leaf,
    gradient: "from-emerald-400 to-teal-500",
    ringColor: "ring-emerald-200",
    glowBg: "bg-emerald-500/10",
    title: "Smart Sustainability Score",
    desc: "Instant AI-powered eco ratings for every product, built on real data across 12 sustainability dimensions.",
    badge: "AI-Powered",
    badgeClass: "bg-emerald-50 text-emerald-700 border border-emerald-100",
    stat: "94% accuracy",
    statIcon: Sparkles,
    statColor: "text-emerald-500",
  },
  {
    id: "compare",
    icon: BarChart2,
    gradient: "from-blue-400 to-indigo-500",
    ringColor: "ring-blue-200",
    glowBg: "bg-blue-500/10",
    title: "Compare Smarter",
    desc: "Side-by-side eco insights with visual breakdowns and verified sustainable alternatives surfaced instantly.",
    badge: "Real-time",
    badgeClass: "bg-blue-50 text-blue-700 border border-blue-100",
    stat: "1k+ Products",
    statIcon: Sparkles,
    statColor: "text-blue-500",
  },
  {
    id: "verified",
    icon: ShieldCheck,
    gradient: "from-violet-400 to-purple-500",
    ringColor: "ring-violet-200",
    glowBg: "bg-violet-500/10",
    title: "Trusted & Transparent",
    desc: "Community + AI verification to eliminate greenwashing. Every claim is backed by traceable data.",
    badge: "Verified",
    badgeClass: "bg-violet-50 text-violet-700 border border-violet-100",
    stat: "2k+ Reviews",
    statIcon: Users,
    statColor: "text-violet-500",
  },
];

// ── Animation variants ───────────────────────────────────────────────────────
const sectionFade = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

// ── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ feature }) {
  const Icon = feature.icon;
  const StatIcon = feature.statIcon;

  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className="group relative flex flex-col bg-white/80 backdrop-blur-sm rounded-3xl p-8
                 border border-slate-100 shadow-md hover:shadow-2xl hover:border-emerald-100
                 transition-shadow duration-300 cursor-default overflow-hidden"
    >
      {/* Hover glow backdrop */}
      <div
        className={`absolute inset-0 rounded-3xl ${feature.glowBg} opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none`}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-7 relative z-10">
        {/* Icon box */}
        <motion.div
          whileHover={{ rotate: 6, scale: 1.15 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center
                      shadow-lg ring-4 ring-white ${feature.ringColor} group-hover:ring-opacity-60 transition-all duration-300`}
        >
          <Icon size={26} className="text-white" strokeWidth={2} />
        </motion.div>

        {/* Badge */}
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide ${feature.badgeClass}`}>
          {feature.badge}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-xl font-extrabold text-slate-900 mb-3 leading-snug relative z-10">
        {feature.title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed flex-grow relative z-10">
        {feature.desc}
      </p>

      {/* Stat strip */}
      <div className="mt-7 pt-5 border-t border-slate-100 flex items-center gap-2 relative z-10">
        <motion.span
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1.5 }}
        >
          <StatIcon size={14} className={feature.statColor} />
        </motion.span>
        <span className="text-xs font-bold text-slate-600 tracking-wide">{feature.stat}</span>
      </div>
    </motion.div>
  );
}

// ── Main Section ─────────────────────────────────────────────────────────────
export default function FeatureSection() {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-br from-white via-emerald-50/30 to-slate-50">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-emerald-200 rounded-full blur-[160px] opacity-[0.15] translate-x-1/3 -translate-y-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-teal-200 rounded-full blur-[140px] opacity-[0.12] -translate-x-1/3 translate-y-1/4 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section header */}
        <motion.div
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-80px" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-6 shadow-sm">
            <Leaf size={15} className="text-emerald-500" />
            <span>SDG 12 · Responsible Consumption</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">
            Make Smarter,{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
              Sustainable
            </span>{" "}
            Choices
          </h2>

          <p className="text-lg text-slate-500 leading-relaxed">
            Understand product impact, compare smarter, and choose responsibly with data you can trust.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={cardStagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </motion.div>

        {/* Divider */}
        <div className="mt-16 flex items-center gap-4 max-w-xs mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
        </div>

        {/* CTA */}
        <motion.div
          variants={sectionFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          className="mt-10 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
          >
            <Link
              to="/products"
              id="features-cta"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4
                         bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl
                         font-bold text-base shadow-lg shadow-emerald-500/30
                         hover:shadow-xl hover:shadow-emerald-500/40 transition-shadow duration-300 group"
            >
              Explore Sustainable Products
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </Link>
          </motion.div>
          <p className="mt-4 text-sm text-slate-400 font-medium">
            Free to use · Verified eco data · No account required
          </p>
        </motion.div>
      </div>
    </section>
  );
}
