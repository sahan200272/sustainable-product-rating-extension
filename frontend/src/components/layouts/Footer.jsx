import { useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, ArrowUp, ShieldCheck } from "lucide-react";
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

/* ─── Nav columns ─── */
const NAV_COLUMNS = [
  {
    heading: "Platform",
    links: [
      { label: "Browse Products", to: "/products" },
      { label: "Compare Products", to: "/compare" },
      { label: "Sustainability Insights", to: "/blogs" },
      { label: "Top Rated", to: "/#top-rated" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Greenvy", to: "/" },
      { label: "Our Mission", to: "/" },
      { label: "Careers", to: "/" },
      { label: "Contact Us", to: "/" },
    ],
  },
];

const SOCIAL_LINKS = [
  { Icon: FaFacebook,  href: "#", label: "Facebook"    },
  { Icon: FaTwitter,   href: "#", label: "Twitter / X"  },
  { Icon: FaLinkedin,  href: "#", label: "LinkedIn"    },
  { Icon: FaInstagram, href: "#", label: "Instagram"   },
];

const LEGAL_LINKS = ["Privacy", "Terms", "Cookies"];

/* ─── Component ─── */
export default function Footer() {
  const year = new Date().getFullYear();
  const [showTop, setShowTop] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = useCallback(
    () => window.scrollTo({ top: 0, behavior: "smooth" }),
    []
  );

  return (
    <>
      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer
        className={`border-t border-slate-100 bg-white transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── TOP SECTION — Brand + Nav ── */}
          <div className="py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

            {/* Brand block */}
            <div className="flex flex-col gap-4">
              <Link to="/" className="flex items-center gap-2 group w-fit">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                  <Leaf size={15} className="text-emerald-500" />
                </div>
                <span className="text-lg font-black text-slate-900 tracking-tight">
                  Greenvy
                </span>
              </Link>

              <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
                AI-powered sustainability ratings for conscious shoppers making
                greener buying decisions.
              </p>

              {/* SDG badge — inline, light */}
              <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-semibold text-emerald-600">
                <ShieldCheck size={12} />
                SDG 12 Aligned
              </span>
            </div>

            {/* Nav columns */}
            {NAV_COLUMNS.map(({ heading, links }) => (
              <div key={heading}>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                  {heading}
                </p>
                <ul className="space-y-2.5">
                  {links.map(({ label, to }) => (
                    <li key={label}>
                      <Link
                        to={to}
                        className="relative inline-block text-sm text-slate-500 hover:text-slate-900 transition-colors duration-200 group"
                      >
                        {label}
                        <span className="absolute -bottom-px left-0 h-px w-0 bg-emerald-500 group-hover:w-full transition-all duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── DIVIDER ── */}
          <div className="h-px bg-slate-100" />

          {/* ── BOTTOM BAR — Legal + Social ── */}
          <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Copyright + legal */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-slate-400">
              <span>© {year} Greenvy, Inc.</span>
              {LEGAL_LINKS.map((item) => (
                <Link
                  key={item}
                  to="/"
                  className="relative hover:text-slate-700 transition-colors duration-200 group"
                >
                  {item}
                  <span className="absolute -bottom-px left-0 h-px w-0 bg-slate-400 group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-1.5">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

        </div>
      </footer>

      {/* ══════════════ BACK TO TOP ══════════════ */}
      <button
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-6 right-6 z-50 w-9 h-9 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-md hover:bg-emerald-500 hover:-translate-y-1 transition-all duration-300 ${
          showTop ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <ArrowUp size={16} />
      </button>
    </>
  );
}
