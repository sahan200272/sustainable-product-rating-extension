import { useEffect, useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, ArrowUp, ShieldCheck, ChevronDown } from "lucide-react";
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
  const [openSection, setOpenSection] = useState(null);

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

  const toggleSection = (heading) => {
    setOpenSection(openSection === heading ? null : heading);
  };

  return (
    <>
      {/* ══════════════════════ FOOTER ══════════════════════ */}
      <footer
        className={`border-t border-gray-200 bg-white transition-opacity duration-500 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── TOP SECTION — Brand + Nav ── */}
          <div className="py-6 sm:py-12 flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-y-10 sm:gap-x-8">

            {/* Brand block (2 cols on large devices) */}
            <div className="flex flex-col items-center sm:items-start gap-3 lg:col-span-2 text-center sm:text-left mb-2 sm:mb-0">
              <Link to="/" className="flex items-center gap-2 group w-fit mx-auto sm:mx-0">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
                  <Leaf size={16} className="text-emerald-500" />
                </div>
                <span className="text-lg font-black text-slate-900 tracking-tight">
                  Greenvy
                </span>
              </Link>

              <p className="text-[13px] sm:text-sm text-slate-500 leading-tight sm:leading-relaxed max-w-xs mx-auto sm:mx-0">
                AI-powered sustainability ratings for conscious shoppers making
                greener buying decisions.
              </p>

              {/* SDG badge */}
              <div className="mt-1 sm:mt-0">
                <span className="inline-flex items-center justify-center gap-1.5 w-fit px-3 py-1 sm:px-3 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] sm:text-xs font-semibold text-emerald-600">
                  <ShieldCheck size={12} className="sm:w-3 sm:h-3" />
                  SDG 12 Aligned
                </span>
              </div>
            </div>

            {/* Nav columns (Accordions on Mobile) */}
            <div className="w-full sm:contents flex flex-col space-y-2 sm:space-y-0">
              {NAV_COLUMNS.map(({ heading, links }) => (
                <div key={heading} className="w-full border-b border-gray-100 sm:border-none sm:text-left flex flex-col sm:items-start text-left overflow-hidden">
                  
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleSection(heading)}
                    className="w-full flex items-center justify-between py-3 px-2 sm:px-0 sm:py-0 sm:mb-4 focus:outline-none sm:cursor-default rounded-lg sm:rounded-none hover:bg-gray-50 active:bg-gray-100 active:scale-[0.98] sm:hover:bg-transparent sm:active:bg-transparent sm:active:scale-100 transition-all duration-200"
                  >
                    <p className="text-[13px] sm:text-xs font-semibold uppercase tracking-widest text-slate-800 sm:text-slate-400">
                      {heading}
                    </p>
                    <div className="flex items-center gap-2 sm:hidden text-slate-400">
                      <span className="text-[10px] uppercase font-medium tracking-wide opacity-60">
                        {openSection === heading ? "Close" : "Expand"}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${
                          openSection === heading ? "rotate-180 text-emerald-500" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Accordion Content */}
                  <div
                    className={`w-full transition-all duration-300 ease-in-out sm:max-h-none sm:opacity-100 ${
                      openSection === heading ? "max-h-[500px] opacity-100 pb-4 px-2 sm:px-0" : "max-h-0 opacity-0 sm:pb-0"
                    }`}
                  >
                    {/* Using grid-cols-2 on mobile for links to minimize height footprint */}
                    <ul className="grid grid-cols-2 sm:flex sm:flex-col gap-x-4 gap-y-2.5 sm:gap-y-2.5 w-full pt-1 sm:pt-0">
                      {links.map(({ label, to }) => (
                        <li key={label} className="w-full">
                          <Link
                            to={to}
                            className="relative block text-[13px] sm:text-sm text-slate-500 hover:text-emerald-600 transition-colors duration-200 group active:text-emerald-700 leading-tight"
                          >
                            {label}
                            <span className="hidden sm:block absolute -bottom-px left-0 h-px w-0 bg-emerald-500 group-hover:w-full transition-all duration-300" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── DIVIDER ── */}
          <div className="h-px bg-gray-200 my-4 sm:my-4" />

          {/* ── BOTTOM BAR — Legal + Social ── */}
          <div className="pb-6 pt-2 sm:py-5 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-4 text-center sm:text-left">

            {/* Copyright + legal (compactly merged) */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-x-5 text-[11px] sm:text-xs text-slate-500 sm:text-slate-400">
              <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                <span className="whitespace-nowrap font-medium text-slate-600 sm:font-normal sm:text-inherit">© {year} Greenvy</span>
                <span className="hidden sm:inline text-gray-300">•</span>
                {LEGAL_LINKS.map((item, idx) => (
                  <div key={item} className="flex items-center gap-2 sm:gap-3">
                    <Link
                      to="/"
                      className="relative hover:text-emerald-600 transition-colors duration-200 group active:text-emerald-700"
                    >
                      {item}
                    </Link>
                    {idx < LEGAL_LINKS.length - 1 && <span className="sm:hidden text-gray-200">|</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3 sm:gap-1.5 mt-1 sm:mt-0">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center rounded-full sm:rounded-lg bg-slate-50 sm:bg-transparent text-slate-500 sm:text-slate-400 hover:text-emerald-600 sm:hover:text-emerald-500 border border-slate-200 sm:border-transparent transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  <Icon size={14} className="sm:w-3.5 sm:h-3.5" />
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
        className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-slate-900 text-white shadow-xl hover:bg-emerald-500 hover:-translate-y-1 transition-all duration-300 active:scale-90 ${
          showTop ? "opacity-100 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp size={18} className="sm:w-4 sm:h-4" />
      </button>
    </>
  );
}
