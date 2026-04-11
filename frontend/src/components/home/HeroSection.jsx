import React from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, ShieldCheck, Leaf, Zap, Users } from "lucide-react";
import { motion } from "framer-motion";
import AnimatedCounter from "./utils/AnimatedCounter";

// ── Animation variants ──────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

// ── Floating badge icon ──────────────────────────────────────────────────────
const floatAnim = {
  animate: {
    y: [0, -5, 0],
    transition: { duration: 2.8, repeat: Infinity, ease: "easeInOut" },
  },
};

export default function HeroSection() {
  return (
    <section className="relative pt-12 pb-16 sm:pt-16 sm:pb-24 md:pb-32 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-30 sm:opacity-50"
      >
        <source src="/videos/Sustainability_Web_App_Hero_Video.mp4" type="video/mp4" />
        <source src="/videos/Sustainability_Web_App_Hero_Video.webm" type="video/webm" />
      </video>

      {/* Light overlay */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-0 pointer-events-none" />

      {/* Decorative gradient blobs */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-emerald-200 rounded-full blur-[160px] opacity-25 pointer-events-none z-0" />
      <div className="absolute -top-16 right-0 w-[480px] h-[480px] bg-teal-200 rounded-full blur-[140px] opacity-20 pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] bg-emerald-100 rounded-full blur-[80px] opacity-40 pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">

        {/* Stagger container */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          {/* SDG Badge */}
          <motion.div variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/80 border border-emerald-200 text-emerald-700 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-sm shadow-emerald-100 backdrop-blur-sm">
              <motion.span variants={floatAnim} animate="animate" className="flex items-center">
                <ShieldCheck size={16} className="text-emerald-500" />
              </motion.span>
              <span>Empowering Sustainable Choices · SDG 12</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-[1.1] mb-4 sm:mb-6"
          >
            Make Smarter,{" "}
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 bg-clip-text text-transparent">
              Greener Choices
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-sm sm:text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 px-2 sm:px-0"
          >
            AI-powered sustainability insights, transparent comparisons, and
            authentic community reviews — shop with purpose, every time.
          </motion.p>

          {/* Search bar */}
          <motion.div variants={fadeUp} className="w-full max-w-2xl mx-auto mb-6 sm:mb-8">
            {/* Mobile: stacked layout */}
            <div className="flex sm:hidden flex-col gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="hero-search-mobile"
                  type="text"
                  placeholder="Search products or brands..."
                  className="block w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent shadow-md text-base bg-white/90 backdrop-blur-sm"
                />
              </div>
              <button
                id="hero-search-btn-mobile"
                className="w-full min-h-[44px] py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-sm shadow-emerald-500/30 text-sm"
              >
                Search
              </button>
            </div>
            {/* Desktop: inline layout */}
            <div className="hidden sm:block relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors duration-200" />
              </div>
              <input
                id="hero-search"
                type="text"
                placeholder="Search products or brands..."
                className="block w-full pl-12 pr-36 py-4 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent shadow-md hover:shadow-lg transition-all duration-300 text-base bg-white/90 backdrop-blur-sm"
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                <button
                  id="hero-search-btn"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-sm shadow-emerald-500/30 hover:shadow-emerald-500/40 text-sm"
                >
                  Search
                </button>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-14 w-full"
          >
            <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                to="/compare"
                id="hero-cta-compare"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 sm:py-4 min-h-[48px] bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-base shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-shadow duration-300"
              >
                <Zap size={18} />
                Compare Products
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                to="/products"
                id="hero-cta-browse"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 sm:py-4 min-h-[48px] bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-base hover:bg-slate-50 hover:border-emerald-200 hover:shadow-md transition-all duration-300"
              >
                Browse All
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 md:gap-12"
          >
            {[
              { icon: Leaf, to: 1000, suffix: "+", label: "Products Rated" },
              { icon: Users, to: 2000, suffix: "+", label: "Community Reviews" },
              { icon: ShieldCheck, to: 94, suffix: "%", label: "AI Accuracy" },
            ].map(({ icon: Icon, to, suffix, label }) => (
              <div key={label} className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center group-hover:bg-emerald-100 transition-colors duration-200">
                  <Icon size={16} className="text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-extrabold text-slate-900 leading-none">
                    <AnimatedCounter to={to} suffix={suffix} duration={1.8} />
                  </p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
