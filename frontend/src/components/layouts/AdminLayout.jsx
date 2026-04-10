import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { GREENVY_LOGO_URL, GREENVY_LOGO_ALT } from "../../config/env";
import toast from "react-hot-toast";
import {
    FiGrid,
    FiUsers,
    FiPackage,
    FiStar,
    FiCheckCircle,
    FiLogOut,
    FiMenu,
    FiX,
} from "react-icons/fi";
import { useState, useEffect, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Admin sidebar navigation items.
 * Settings deliberately excluded per design spec.
 */
const NAV_ITEMS = [
    { to: "/admin/dashboard", label: "Dashboard",          icon: FiGrid        },
    { to: "/admin/users",     label: "Users",              icon: FiUsers       },
    { to: "/admin/products",  label: "Products",           icon: FiPackage     },
    { to: "/admin/reviews",   label: "Reviews & Feedback", icon: FiStar        },
    { to: "/admin/moderation",label: "Blog Moderation",    icon: FiCheckCircle },
];

/* ─────────────────────── Avatar helper ─────────────────────────── */
/**
 * Renders a rounded avatar:
 *  - Google / uploaded profile picture when available
 *  - Gradient initials fallback when image is missing or broken
 *
 * Props:
 *   src        – URL string or null/undefined
 *   initial    – single uppercase letter for fallback
 *   size       – Tailwind size classes applied to both variants (default h-9 w-9)
 *   ringClass  – optional ring classes
 */
function Avatar({ src, initial, size = "h-9 w-9", ringClass = "" }) {
    const [errored, setErrored] = useState(false);

    if (src && !errored) {
        return (
            <img
                src={src}
                alt="Profile"
                referrerPolicy="no-referrer"
                className={`${size} rounded-full object-cover shadow-sm ${ringClass}`}
                onError={() => setErrored(true)}
            />
        );
    }

    return (
        <div
            className={`${size} flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-600 text-sm font-bold text-white shadow-md`}
        >
            {initial}
        </div>
    );
}

/* ─────────────────────── Skeleton Loader ─────────────────────────── */
/**
 * Skeleton Loader for Lazy-loaded routes
 */
function AdminContentSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            {/* Top indeterminate progress bar */}
            <div className="fixed top-0 left-0 z-50 h-1 w-full bg-emerald-500/10 overflow-hidden">
                <div 
                    className="h-full bg-emerald-500 rounded-r-full" 
                    style={{ animation: "nprogressBar 1s infinite linear" }} 
                />
                <style>{`
                  @keyframes nprogressBar {
                    0% { transform: translateX(-100%); width: 0%; }
                    50% { width: 50%; transform: translateX(50%); }
                    100% { transform: translateX(200%); width: 0%; }
                  }
                `}</style>
            </div>
            
            {/* Header Skeleton */}
            <div className="mb-8">
                <div className="h-10 w-1/3 rounded-xl bg-slate-200 mb-4" />
                <div className="h-5 w-1/2 rounded-lg bg-slate-100" />
            </div>
            
            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-32 rounded-3xl bg-slate-200 shadow-sm" />
                ))}
            </div>

            {/* Table/List Skeleton */}
            <div className="h-[400px] rounded-3xl bg-slate-200 shadow-sm" />
        </div>
    );
}

/**
 * AdminLayout
 *
 * The dedicated shell for ALL admin pages.
 * Renders a professional SaaS-style sidebar + topbar, with <Outlet />
 * for child route content. Does NOT import or render any user-facing
 * layout components (Navbar, Footer, etc.).
 *
 * Usage (via React Router nested routes):
 *   <Route path="/admin" element={<AdminLayout />}>
 *     <Route path="dashboard" element={<AdminDashboard />} />
 *     ...
 *   </Route>
 */
export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const mainRef = useRef(null);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Smooth scroll to top on route change
    useEffect(() => {
        if (mainRef.current) {
            mainRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    }, [location.pathname]);

    /* ── Profile helpers ── */
    // Backend stores firstName + lastName separately; no combined "name" field.
    const firstName   = user?.firstName || "";
    const lastName    = user?.lastName  || "";
    const displayName = firstName || lastName
        ? `${firstName} ${lastName}`.trim()
        : "Administrator";
    const avatarInitial  = displayName.slice(0, 1).toUpperCase();

    // Backend field confirmed from user.controller.js & user.service.js
    const profilePicture = user?.profilePicture || null;

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    };

    /* ─────────────────────────── Sidebar ─────────────────────────── */
    const SidebarContent = (
        <aside className="flex h-full w-64 flex-shrink-0 flex-col bg-gradient-to-b from-emerald-900 via-emerald-950 to-cyan-950 text-white shadow-xl">
            {/* ── Brand ── */}
            <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
                <img
                    src={GREENVY_LOGO_URL}
                    alt={GREENVY_LOGO_ALT}
                    loading="lazy"
                    className="h-10 w-10 rounded-xl bg-white/10 object-contain p-1.5 shadow-md"
                />
                <div className="leading-tight">
                    <p className="text-lg font-extrabold tracking-tight">Greenvy</p>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-emerald-300">
                        Admin Panel
                    </p>
                </div>
            </div>

            {/* ── Admin profile card ── */}
            <div className="mx-4 mt-5 flex items-center gap-3 rounded-xl bg-white/10 px-3 py-3 ring-1 ring-white/10">
                <div className="relative flex-shrink-0">
                    <Avatar
                        src={profilePicture}
                        initial={avatarInitial}
                        size="h-9 w-9"
                        ringClass="ring-2 ring-emerald-400/40"
                    />
                    {/* Online indicator */}
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-900" />
                </div>

                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold leading-tight">{displayName}</p>
                    <span className="inline-block rounded-full bg-emerald-500/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-200">
                        Admin
                    </span>
                </div>
            </div>

            {/* ── Navigation ── */}
            <nav className="mt-5 flex-1 space-y-0.5 overflow-y-auto px-3">
                <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                    Navigation
                </p>
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={({ isActive }) =>
                            `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 ${
                                isActive
                                    ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/30 scale-[1.02] shadow-sm shadow-emerald-900/20"
                                    : "text-white/65 hover:bg-white/10 hover:text-white hover:scale-[1.02]"
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <span
                                    className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md transition-colors ${
                                        isActive
                                            ? "bg-emerald-400/30 text-emerald-300"
                                            : "text-white/50 group-hover:text-white/80"
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                </span>
                                {label}
                                {isActive && (
                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* ── Sign-out ── */}
            <div className="border-t border-white/10 p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-red-500/20 hover:text-red-300"
                >
                    <FiLogOut className="h-4 w-4" />
                    Sign Out
                </button>
            </div>
        </aside>
    );

    /* ─────────────────────────── Render ─────────────────────────── */
    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
            {/* ── Desktop sidebar ── */}
            <div className="hidden md:flex">{SidebarContent}</div>

            {/* ── Mobile sidebar overlay ── */}
            <AnimatePresence>
                {mobileSidebarOpen && (
                    <motion.div
                        key="mobile-sidebar"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 md:hidden"
                        onClick={() => setMobileSidebarOpen(false)}
                    >
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        <motion.div
                            initial={{ x: -260 }}
                            animate={{ x: 0 }}
                            exit={{ x: -260 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute left-0 top-0 h-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {SidebarContent}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Main content column ── */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* ── Topbar ── */}
                <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm md:px-6">
                    {/* Mobile menu toggle */}
                    <button
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 md:hidden"
                        onClick={() => setMobileSidebarOpen((v) => !v)}
                        aria-label="Toggle sidebar"
                    >
                        {mobileSidebarOpen ? (
                            <FiX className="h-5 w-5" />
                        ) : (
                            <FiMenu className="h-5 w-5" />
                        )}
                    </button>

                    {/* Breadcrumb title */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-400 hidden md:inline">
                            Greenvy
                        </span>
                        <span className="hidden text-slate-300 md:inline">/</span>
                        <span className="text-sm font-semibold text-slate-700">
                            Admin Dashboard
                        </span>
                    </div>

                    {/* ── Right side: badge + avatar only ── */}
                    <div className="flex items-center gap-3">
                        {/* Admin role badge */}
                        <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 sm:inline-flex">
                            ADMINISTRATOR
                        </span>

                        {/* Profile avatar */}
                        <Avatar
                            src={profilePicture}
                            initial={avatarInitial}
                            size="h-9 w-9"
                            ringClass="ring-2 ring-emerald-400/40"
                        />
                    </div>
                </header>

                {/* ── Page content scrolls here ── */}
                <main ref={mainRef} className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="mx-auto max-w-7xl px-4 py-8 md:px-8"
                        >
                            <Suspense fallback={<AdminContentSkeleton />}>
                                <Outlet />
                            </Suspense>
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
