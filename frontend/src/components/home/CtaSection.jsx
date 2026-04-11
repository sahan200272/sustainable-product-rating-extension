import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Zap, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";

// ── Floating decorative leaf icons ────────────────────────────────────────────
function FloatingIcon({ icon: Icon, className, delay = 0 }) {
  return (
    <motion.div
      animate={{ y: [0, -14, 0], rotate: [0, 8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
      className={`absolute pointer-events-none opacity-20 ${className}`}
    >
      <Icon size={48} className="text-white" />
    </motion.div>
  );
}

// ── CTA Button ────────────────────────────────────────────────────────────────
function CtaButton({ to, id, primary, children }) {
  return (
    <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} className="w-full sm:w-auto">
      <Link
        to={to}
        id={id}
        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 sm:py-4 min-h-[48px] rounded-2xl font-bold text-base transition-all duration-300
          ${primary
            ? "bg-white text-emerald-700 hover:bg-emerald-50 shadow-xl shadow-black/10"
            : "bg-white/20 text-white border border-white/40 hover:bg-white/30 backdrop-blur-sm"
          }`}
      >
        {children}
      </Link>
    </motion.div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function CtaSection() {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="py-16 sm:py-20 md:py-28 relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600">
      {/* Animated radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.12)_0%,transparent_70%)] pointer-events-none" />

      {/* Floating decorative icons */}
      <FloatingIcon icon={Leaf}  className="top-8 left-12"  delay={0} />
      <FloatingIcon icon={Globe} className="top-16 right-20" delay={1.2} />
      <FloatingIcon icon={Zap}   className="bottom-10 left-1/4" delay={2.4} />
      <FloatingIcon icon={Leaf}  className="bottom-8 right-12" delay={0.8} />

      {/* Soft edge glow blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-[120px] opacity-25 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-800 rounded-full blur-[100px] opacity-30 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          {!isAuthenticated ? (
            <>
              {/* SDG pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-sm font-bold mb-8 backdrop-blur-sm">
                <Leaf size={14} />
                SDG 12 · Responsible Consumption
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 leading-tight">
                Every purchase is a vote<br className="hidden md:block" />
                {" "}for the{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">future.</span>
                  <motion.span
                    className="absolute bottom-1 left-0 right-0 h-2 bg-white/25 rounded-full -z-0"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: false }}
                    transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
                  />
                </span>
              </h2>

              <p className="text-sm sm:text-base md:text-xl text-white/80 font-medium mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
                Join 50,000+ conscious shoppers making a quantifiable difference every single day.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <CtaButton to="/register" id="cta-register" primary>
                  <Zap size={18} />
                  Start Exploring Now
                </CtaButton>
                <CtaButton to="/login" id="cta-login">
                  Login with Google
                  <ArrowRight size={18} />
                </CtaButton>
              </motion.div>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-sm font-bold mb-8 backdrop-blur-sm">
                <Leaf size={14} />
                Welcome back, {user?.name?.split(" ")[0] || "Eco-Warrior"} 👋
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white mb-4 sm:mb-6 leading-tight">
                Ready to make an{" "}
                <br className="hidden md:block" />
                <span className="italic">impact today?</span>
              </h2>

              <p className="text-sm sm:text-base md:text-xl text-white/80 font-medium mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
                Discover top-rated sustainable alternatives and make informed decisions that matter.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
              >
                <CtaButton to="/products" id="cta-browse-products" primary>
                  <Leaf size={18} />
                  Browse Products
                </CtaButton>
                <CtaButton to="/compare" id="cta-compare">
                  Compare Items
                  <ArrowRight size={18} />
                </CtaButton>
              </motion.div>
            </>
          )}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-10 sm:mt-16 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-white/60 text-xs sm:text-sm font-medium"
        >
          {["No credit card required", "Free forever", "SDG 12 aligned", "AI-verified data"].map((item) => (
            <span key={item} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              {item}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
