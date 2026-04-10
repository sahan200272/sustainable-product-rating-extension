import { useEffect, useMemo, useState } from "react";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import { getAllProducts } from "../../services/productServices";
import { getAdminBlogs } from "../../services/blogService";
import { adminGetAllUsers } from "../../services/userService";
import { getAllReviewsAdmin } from "../../services/reviewService";
import { motion } from "framer-motion";
import {
    FiPlus,
    FiPackage,
    FiFileText,
    FiCheckCircle,
    FiBarChart2,
    FiUsers,
    FiStar,
    FiArrowRight,
    FiActivity,
    FiAlertTriangle,
} from "react-icons/fi";

/* ─────────────────────── animation helpers ─────────────────────── */
const fadeUp = (delay = 0) => ({
    initial:    { opacity: 0, y: 16 },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay, ease: "easeOut" },
});

/* ─────────────────────── skeleton component ────────────────────── */
function Skeleton({ className = "" }) {
    return (
        <div
            className={`animate-pulse rounded-xl bg-slate-200 ${className}`}
            aria-hidden="true"
        />
    );
}

/* ─────────────────────── stat card component ───────────────────── */
function StatCard({ card, loading, delay }) {
    const Icon = card.rawIcon;
    return (
        <motion.div {...fadeUp(delay)}>
            <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                {/* coloured accent bar */}
                <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${card.accentBar}`} />

                <div className="flex items-start justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.iconWrap}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                    {/* sub-label badge (e.g. "combined") */}
                    {card.badge && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${card.badgeClass}`}>
                            {card.badge}
                        </span>
                    )}
                </div>

                <div className="mt-4">
                    {loading ? (
                        <>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-28" />
                        </>
                    ) : (
                        <>
                            <p className="text-3xl font-black text-slate-900 tabular-nums">
                                {card.value ?? "—"}
                            </p>
                            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {card.label}
                            </p>
                            {card.sub && (
                                <p className="mt-1 text-[11px] text-slate-500">{card.sub}</p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ─────────────────────── quick action card ─────────────────────── */
function ActionCard({ action, delay, loading }) {
    const Icon = action.rawIcon;
    return (
        <motion.div {...fadeUp(delay)}>
            {loading ? (
                <Skeleton className="h-24 w-full" />
            ) : (
                <button
                    onClick={action.onClick}
                    className={`group relative w-full overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${action.cardClass}`}
                >
                    <div className="flex items-center justify-between">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${action.iconWrap}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <FiArrowRight className="h-4 w-4 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-70" />
                    </div>
                    <p className="mt-3 text-sm font-bold text-slate-800 leading-snug">{action.label}</p>
                    {action.sub && (
                        <p className="mt-0.5 text-[11px] text-slate-500">{action.sub}</p>
                    )}
                </button>
            )}
        </motion.div>
    );
}

/* ═══════════════════════ AdminDashboard ════════════════════════════ */
/**
 * AdminDashboard
 *
 * Route: /admin/dashboard
 * Overview section only — balanced stats cards + quick-action grid.
 * Layout shell (sidebar + topbar) is provided by AdminLayout.
 *
 * Cards represent one card per core module:
 *   1. Total Products
 *   2. Total Users
 *   3. Total Reviews
 *   4. Pending Actions (pending blogs + any pending reviews)
 */
export default function AdminDashboard() {
    const navigate      = useNavigate();
    const { user }      = useAuth();

    /* ── Loading states (granular so each card skeleton resolves independently) */
    const [productsLoading, setProductsLoading] = useState(true);
    const [usersLoading,    setUsersLoading]    = useState(true);
    const [reviewsLoading,  setReviewsLoading]  = useState(true);
    const [blogsLoading,    setBlogsLoading]    = useState(true);
    const [actionsLoading,  setActionsLoading]  = useState(true);

    /* ── Data */
    const [productCount, setProductCount] = useState(null);
    const [userCount,    setUserCount]    = useState(null);
    const [reviewCount,  setReviewCount]  = useState(null);
    const [pendingBlogs, setPendingBlogs] = useState(null);
    const [pendingReviews, setPendingReviews] = useState(null);

    /* ── Greeting */
    const displayName = user?.name || "Administrator";
    const greeting    = (() => {
        const h = new Date().getHours();
        if (h < 12) return "Good morning";
        if (h < 17) return "Good afternoon";
        return "Good evening";
    })();

    useEffect(() => {
        fetchProducts();
        fetchUsers();
        fetchReviews();
        fetchBlogs();
        // Slight delay so action skeletons appear briefly even when data is fast
        const t = setTimeout(() => setActionsLoading(false), 700);
        return () => clearTimeout(t);
    }, []);

    /* ── Fetchers ── */
    const fetchProducts = async () => {
        setProductsLoading(true);
        try {
            const res = await getAllProducts();
            if (res.success && res.data) setProductCount(res.data.length);
        } catch {
            toast.error("Failed to fetch products");
        } finally {
            setProductsLoading(false);
        }
    };

    const fetchUsers = async () => {
        setUsersLoading(true);
        try {
            const res = await adminGetAllUsers();
            // API returns { success, data: [...] } or an array directly
            const list = Array.isArray(res) ? res : res?.data ?? [];
            setUserCount(list.length);
        } catch {
            // Non-critical — show "—" gracefully
            setUserCount(null);
        } finally {
            setUsersLoading(false);
        }
    };

    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const res = await getAllReviewsAdmin();
            const list = Array.isArray(res) ? res : res?.data ?? [];
            setReviewCount(list.length);
            // Count pending reviews for the "Pending Actions" card
            const pending = list.filter(
                (r) => r.status === "PENDING" || r.status === "pending"
            ).length;
            setPendingReviews(pending);
        } catch {
            setReviewCount(null);
            setPendingReviews(0);
        } finally {
            setReviewsLoading(false);
        }
    };

    const fetchBlogs = async () => {
        setBlogsLoading(true);
        try {
            const data = await getAdminBlogs({ page: 1, limit: 200 });
            const list = data?.blogs || [];
            setPendingBlogs(list.filter((b) => b.status === "PENDING").length);
        } catch {
            setPendingBlogs(null);
        } finally {
            setBlogsLoading(false);
        }
    };

    /* ── Combined pending count for card 4 */
    const pendingActionCount = useMemo(() => {
        const pb = pendingBlogs   ?? 0;
        const pr = pendingReviews ?? 0;
        return pb + pr;
    }, [pendingBlogs, pendingReviews]);

    const pendingActionsLoading = blogsLoading || reviewsLoading;

    /* ── Stat cards — one per core module ── */
    const statCards = [
        {
            label:     "Total Products",
            value:     productCount,
            sub:       "Listed on the platform",
            rawIcon:   FiPackage,
            accentBar: "bg-blue-500",
            iconWrap:  "bg-blue-50 text-blue-600",
            loading:   productsLoading,
        },
        {
            label:     "Total Users",
            value:     userCount,
            sub:       "Registered accounts",
            rawIcon:   FiUsers,
            accentBar: "bg-emerald-500",
            iconWrap:  "bg-emerald-50 text-emerald-600",
            loading:   usersLoading,
        },
        {
            label:     "Total Reviews",
            value:     reviewCount,
            sub:       "Across all products",
            rawIcon:   FiStar,
            accentBar: "bg-violet-500",
            iconWrap:  "bg-violet-50 text-violet-600",
            loading:   reviewsLoading,
        },
        {
            label:     "Pending Actions",
            value:     pendingActionCount,
            sub:       "Blogs + reviews awaiting review",
            badge:     "Needs attention",
            badgeClass: pendingActionCount > 0
                ? "bg-amber-100 text-amber-700"
                : "bg-slate-100 text-slate-400",
            rawIcon:   FiAlertTriangle,
            accentBar: pendingActionCount > 0 ? "bg-amber-400" : "bg-slate-300",
            iconWrap:  pendingActionCount > 0
                ? "bg-amber-50 text-amber-500"
                : "bg-slate-100 text-slate-400",
            loading:   pendingActionsLoading,
        },
    ];

    /* ── Quick actions — Settings removed ── */
    const quickActions = [
        {
            label:    "Add New Product",
            sub:      "Publish a product listing",
            rawIcon:  FiPlus,
            onClick:  () => navigate("/admin/add-product"),
            cardClass: "border-blue-100 bg-blue-50 hover:bg-blue-100",
            iconWrap:  "bg-blue-600 text-white",
        },
        {
            label:    "Manage Products",
            sub:      "View & edit all products",
            rawIcon:  FiPackage,
            onClick:  () => navigate("/admin/products"),
            cardClass: "border-indigo-100 bg-indigo-50 hover:bg-indigo-100",
            iconWrap:  "bg-indigo-600 text-white",
        },
        {
            label:    "Manage Users",
            sub:      "Roles, bans & accounts",
            rawIcon:  FiUsers,
            onClick:  () => navigate("/admin/users"),
            cardClass: "border-cyan-100 bg-cyan-50 hover:bg-cyan-100",
            iconWrap:  "bg-cyan-600 text-white",
        },
        {
            label:    "Manage Reviews",
            sub:      "Moderate feedback",
            rawIcon:  FiStar,
            onClick:  () => navigate("/admin/reviews"),
            cardClass: "border-violet-100 bg-violet-50 hover:bg-violet-100",
            iconWrap:  "bg-violet-600 text-white",
        },
        {
            label:    "Blog Moderation",
            sub:      "Approve or reject posts",
            rawIcon:  FiCheckCircle,
            onClick:  () => navigate("/admin/moderation"),
            cardClass: "border-amber-100 bg-amber-50 hover:bg-amber-100",
            iconWrap:  "bg-amber-500 text-white",
        },
        {
            label:    "Comparison Stats",
            sub:      "View analytics charts",
            rawIcon:  FiBarChart2,
            onClick:  () => navigate("/admin/compare-stats"),
            cardClass: "border-purple-100 bg-purple-50 hover:bg-purple-100",
            iconWrap:  "bg-purple-600 text-white",
        },
    ];

    /* ── Render ── */
    return (
        <div className="space-y-8">
            {/* ── Page heading ── */}
            <motion.div {...fadeUp(0)}>
                <AdminPageHeader
                    title="Dashboard Overview"
                    subtitle="Real-time snapshot of your entire platform."
                    breadcrumbs={[
                        { label: "Admin" },
                        { label: "Dashboard" }
                    ]}
                    actionButton={
                        <p className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full inline-block">
                            {greeting}, {displayName.split(" ")[0]} 👋
                        </p>
                    }
                />
            </motion.div>

            {/* ── Stat cards — 4 balanced columns ── */}
            <section aria-label="Platform statistics">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {statCards.map((card, i) => (
                        <StatCard
                            key={card.label}
                            card={card}
                            loading={card.loading}
                            delay={0.05 + i * 0.06}
                        />
                    ))}
                </div>
            </section>

            {/* ── Divider ── */}
            <div className="h-px bg-slate-100" />

            {/* ── Quick actions ── */}
            <section aria-label="Quick actions">
                <motion.div {...fadeUp(0.25)} className="mb-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Quick Actions</h3>
                        <p className="text-xs text-slate-500">Jump to any admin area</p>
                    </div>
                </motion.div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {quickActions.map((action, i) => (
                        <ActionCard
                            key={action.label}
                            action={action}
                            delay={0.28 + i * 0.05}
                            loading={actionsLoading}
                        />
                    ))}
                </div>
            </section>

            {/* ── System status footer ── */}
            <motion.div {...fadeUp(0.55)}>
                <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white px-5 py-4 shadow-sm">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                        <FiActivity className="h-4 w-4" />
                    </div>
                    <p className="text-xs text-slate-500">
                        Platform is{" "}
                        <span className="font-semibold text-emerald-600">live & operational</span>.
                        All systems normal.
                    </p>
                    <div className="ml-auto flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[11px] font-medium text-slate-400">Live</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
