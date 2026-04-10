/**
 * ReviewManagementSection.jsx
 *
 *  • Analytics cards (total, pending, avg-rating, approved)
 *  • Search (user name / product / keyword)
 *  • Filters: status, star rating, eco-score range
 *  • Sortable table (date ↑↓, rating ↑↓)
 *  • Pagination
 *  • Bulk select → approve / delete
 *  • Per-row actions: approve, reject (w/ comment modal), delete, view
 *  • Review detail modal with sustainability insights
 *  • Skeleton loaders, empty state, error state
 *  • Confirmation dialog + react-hot-toast notifications
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import AdminPageHeader from "../AdminPageHeader";
import toast from "react-hot-toast";
import {
  FiSearch,
  FiFilter,
  FiStar,
  FiCheck,
  FiX,
  FiTrash2,
  FiEye,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiAlertTriangle,
  FiMessageSquare,
  FiTrendingUp,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiGlobe,
  FiChevronUp,
  FiChevronDown,
  FiMinus,
  FiUser,
} from "react-icons/fi";
import {
  getAllReviewsAdmin,
  approveReview,
  rejectReview,
  deleteReview,
} from "../../../services/reviewService";

// ─── Constants ────────────────────────────────────────────────────────────────
const PAGE_SIZE = 8;
const SUSTAINABILITY_KEYWORDS = [
  "eco",
  "sustainable",
  "green",
  "organic",
  "recycled",
  "biodegradable",
  "environment",
  "carbon",
  "renewable",
  "ethical",
  "fair trade",
  "zero waste",
  "compostable",
  "natural",
  "planet",
];

// ─── Utility helpers ──────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(firstName = "", lastName = "") {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "?";
}

function hasSustainabilityMention(text = "") {
  const lower = text.toLowerCase();
  return SUSTAINABILITY_KEYWORDS.some((kw) => lower.includes(kw));
}

function ecoScoreColor(score) {
  if (score >= 75) return { bar: "bg-emerald-500", text: "text-emerald-700", bg: "bg-emerald-50" };
  if (score >= 50) return { bar: "bg-yellow-400", text: "text-yellow-700", bg: "bg-yellow-50" };
  if (score >= 25) return { bar: "bg-orange-400", text: "text-orange-700", bg: "bg-orange-50" };
  return { bar: "bg-red-400", text: "text-red-700", bg: "bg-red-50" };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Fallback & Loading Avatar */
function UserAvatar({ user, isAnonymous, size = "sm" }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const dim = size === "sm" ? "w-10 h-10" : "w-12 h-12";
  const textSz = size === "sm" ? "text-sm" : "text-base";
  const ring = size === "sm" ? "ring-1 ring-slate-200" : "ring-2 ring-white";
  const iconSize = size === "sm" ? "h-5 w-5" : "h-6 w-6";

  if (isAnonymous || !user || Object.keys(user).length === 0) {
    return (
      <div className={`flex ${dim} shrink-0 items-center justify-center rounded-full bg-slate-100 ${ring}`}>
        <FiUser className={`${iconSize} text-slate-400`} />
      </div>
    );
  }

  const avatarUrl = user?.profilePicture;
  const initials = getInitials(user?.firstName, user?.lastName);

  if (avatarUrl && !imgError) {
    return (
      <div className={`relative shrink-0 rounded-full ${dim} ${ring} bg-slate-100 overflow-hidden flex items-center justify-center`}>
        {!imgLoaded && <div className="absolute inset-0 animate-pulse bg-slate-200" />}
        <img
          src={avatarUrl}
          alt={user.firstName || "User"}
          className={`h-full w-full object-cover transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
          onError={(e) => {
            e.target.onerror = null;
            setImgError(true);
          }}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 font-bold text-white ${dim} ${textSz} ${ring}`}>
      {initials}
    </div>
  );
}

/** Animated star rating display */
function StarRating({ rating, size = "sm" }) {
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <FiStar
          key={i}
          className={`${starSize} ${
            i <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200"
          }`}
        />
      ))}
    </div>
  );
}

/** Status badge */
function StatusBadge({ status }) {
  const map = {
    APPROVED: {
      cls: "bg-emerald-100 text-emerald-700 ring-emerald-200",
      icon: <FiCheckCircle className="h-3 w-3" />,
      label: "Approved",
    },
    PENDING: {
      cls: "bg-amber-100 text-amber-700 ring-amber-200",
      icon: <FiClock className="h-3 w-3" />,
      label: "Pending",
    },
    REJECTED: {
      cls: "bg-red-100 text-red-700 ring-red-200",
      icon: <FiXCircle className="h-3 w-3" />,
      label: "Rejected",
    },
  };
  const cfg = map[status] || map.PENDING;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cfg.cls}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

/** Skeleton row for loading state */
function SkeletonRow() {
  return (
    <tr className="border-b border-slate-100">
      {[...Array(8)].map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-full animate-pulse rounded-md bg-slate-200" />
        </td>
      ))}
    </tr>
  );
}

/** Analytics stat card */
function StatCard({ icon, label, value, sub, color }) {
  const colors = {
    blue: "from-blue-500 to-indigo-600",
    amber: "from-amber-400 to-orange-500",
    emerald: "from-emerald-500 to-teal-600",
    violet: "from-violet-500 to-purple-600",
  };
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/60 transition-all hover:shadow-md hover:-translate-y-0.5">
      <div
        className={`absolute inset-0 opacity-5 bg-gradient-to-br ${colors[color]}`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {label}
          </p>
          <p className="mt-1.5 text-3xl font-black text-slate-900">{value}</p>
          {sub && <p className="mt-0.5 text-xs text-slate-500">{sub}</p>}
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-md`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/** Confirmation dialog */
function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, danger = true }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-3 flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full ${
              danger ? "bg-red-100" : "bg-amber-100"
            }`}
          >
            <FiAlertTriangle
              className={`h-5 w-5 ${danger ? "text-red-600" : "text-amber-600"}`}
            />
          </div>
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
        </div>
        <p className="mb-5 text-sm text-slate-600">{message}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white transition ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/** Reject modal — prompts for admin comment */
function RejectModal({ isOpen, onSubmit, onClose, loading }) {
  const [comment, setComment] = useState("");
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="mb-1 text-base font-bold text-slate-900">
          Reject Review
        </h3>
        <p className="mb-4 text-sm text-slate-500">
          Optionally provide a reason that will be shown to the user.
        </p>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="e.g. 'This review violates our community guidelines.'"
          className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 placeholder-slate-400 focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => {
              onClose();
              setComment("");
            }}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            disabled={loading}
            onClick={() => {
              onSubmit(comment);
              setComment("");
            }}
            className="rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? "Rejecting…" : "Reject Review"}
          </button>
        </div>
      </div>
    </div>
  );
}

/** Full review details modal */
function ReviewDetailsModal({ review, onClose }) {
  if (!review) return null;

  const user = review.user || {};
  const product = review.product || {};
  const ecoScore = product.sustainabilityScore ?? 0;
  const ecoColors = ecoScoreColor(ecoScore);
  const isSustainabilityMention = hasSustainabilityMention(review.reviewText);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-emerald-900 to-teal-800 px-6 py-4">
          <h2 className="text-base font-bold text-white">Review Details</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white transition hover:bg-white/20"
          >
            <FiX className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-6">
          {/* User + Product row */}
          <div className="mb-5 grid gap-4 sm:grid-cols-2">
            {/* User */}
            <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              <UserAvatar user={user} isAnonymous={review.isAnonymous} size="md" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Reviewer
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {review.isAnonymous
                    ? "Anonymous User"
                    : user && Object.keys(user).length > 0
                      ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User"
                      : "Unknown User"}
                </p>
                <p className="text-xs text-slate-500">
                  {review.isAnonymous ? "—" : user?.email || "No email provided"}
                </p>
              </div>
            </div>

            {/* Product */}
            <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
              {product.images?.[0] ? (
                <img
                  src={product.images[0]?.url || product.images[0]}
                  alt={product.name}
                  className="h-11 w-11 rounded-lg object-cover ring-2 ring-white"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-200">
                  <FiMessageSquare className="h-5 w-5 text-slate-400" />
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Product
                </p>
                <p className="text-sm font-bold text-slate-900">
                  {product.name || "Unknown Product"}
                </p>
                <p className="text-xs text-slate-500">
                  {product.brand || "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Rating + Status + Date */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <StarRating rating={review.overallRating} size="md" />
            <span className="text-sm font-bold text-slate-700">
              {review.overallRating}/5
            </span>
            <StatusBadge status={review.status} />
            <span className="ml-auto text-xs text-slate-400">
              Submitted {formatDate(review.createdAt)}
            </span>
          </div>

          {/* Review Text */}
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Review Content
              </p>
              {isSustainabilityMention && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                  <FiGlobe className="h-3 w-3" /> Sustainability Mention
                </span>
              )}
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
              {review.reviewText}
            </div>
          </div>

          {/* Sustainability Insights */}
          <div className="mb-5 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
            <div className="mb-3 flex items-center gap-2">
              <FiGlobe className="h-4 w-4 text-emerald-600" />
              <p className="text-sm font-bold text-emerald-800">
                Sustainability Insights
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs text-slate-500">
                  Product Eco-Score
                </p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${ecoColors.bar} transition-all duration-700`}
                      style={{ width: `${ecoScore}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${ecoColors.text}`}>
                    {Math.round(ecoScore)}/100
                  </span>
                </div>
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-500">Toxicity Score</p>
                <div className="flex items-center gap-2">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full rounded-full ${
                        (review.toxicityScore || 0) < 0.2
                          ? "bg-emerald-500"
                          : (review.toxicityScore || 0) < 0.5
                          ? "bg-amber-400"
                          : "bg-red-500"
                      } transition-all duration-700`}
                      style={{
                        width: `${Math.round((review.toxicityScore || 0) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600">
                    {Math.round((review.toxicityScore || 0) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Comment */}
          {review.adminComment && (
            <div className="rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-red-500">
                Admin Note
              </p>
              <p className="text-sm text-red-700">{review.adminComment}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sort indicator icon ──────────────────────────────────────────────────────
function SortIcon({ field, currentSort }) {
  if (currentSort.field !== field)
    return <FiMinus className="h-3 w-3 text-slate-300" />;
  return currentSort.dir === "asc" ? (
    <FiChevronUp className="h-3.5 w-3.5 text-emerald-600" />
  ) : (
    <FiChevronDown className="h-3.5 w-3.5 text-emerald-600" />
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ReviewManagementSection() {
  // ── Data state
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // ── Filter / Sort / Search state
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  
  const [filterRating, setFilterRating] = useState(0); // 0 = all
  const [filterEcoMin, setFilterEcoMin] = useState(0);
  const [sort, setSort] = useState({ field: "createdAt", dir: "desc" });

  // ── Pagination
  const [page, setPage] = useState(1);

  // ── Selection (bulk actions)
  const [selected, setSelected] = useState(new Set());

  // ── Modals / dialogs
  const [viewReview, setViewReview] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  const [confirmBulkApprove, setConfirmBulkApprove] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // ── Fetch all reviews
  const fetchReviews = useCallback(async (isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const res = await getAllReviewsAdmin();
      setReviews(res.data || []);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load reviews.");
    } finally {
      if (isRefresh) setIsRefreshing(false);
      else setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews(false);
  }, [fetchReviews]);

  // ── Derived: analytics
  const stats = useMemo(() => {
    const total = reviews.length;
    const pending = reviews.filter((r) => r.status === "PENDING").length;
    const approved = reviews.filter((r) => r.status === "APPROVED").length;
    const avgRating =
      total > 0
        ? (reviews.reduce((s, r) => s + r.overallRating, 0) / total).toFixed(1)
        : "—";
    return { total, pending, approved, avgRating };
  }, [reviews]);

  // ── Derived: filtered + sorted + paginated
  const filtered = useMemo(() => {
    let list = reviews;

    // Search
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter((r) => {
        const userName = `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.toLowerCase();
        const productName = (r.product?.name || "").toLowerCase();
        const text = (r.reviewText || "").toLowerCase();
        return userName.includes(q) || productName.includes(q) || text.includes(q);
      });
    }

    // Status
    if (filterStatus !== "ALL") {
      list = list.filter((r) => r.status === filterStatus);
    }

    // Star rating
    if (filterRating > 0) {
      list = list.filter((r) => r.overallRating === filterRating);
    }

    // Eco-score min
    if (filterEcoMin > 0) {
      list = list.filter(
        (r) => (r.product?.sustainabilityScore ?? 0) >= filterEcoMin
      );
    }

    // Sort
    list = [...list].sort((a, b) => {
      let valA, valB;
      if (sort.field === "createdAt") {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      } else {
        valA = a.overallRating;
        valB = b.overallRating;
      }
      return sort.dir === "asc" ? valA - valB : valB - valA;
    });

    return list;
  }, [reviews, search, filterStatus, filterRating, filterEcoMin, sort]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [search, filterStatus, filterRating, filterEcoMin, sort]);

  // ── Sort toggle
  const toggleSort = (field) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "desc" }
    );
  };

  // ── Selection handlers
  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map((r) => r._id)));
    }
  };

  // ── Actions
  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await approveReview(id);
      toast.success("Review approved successfully");
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "APPROVED" } : r))
      );
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to approve review");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (comment) => {
    if (!rejectTarget) return;
    setActionLoading(true);
    try {
      await rejectReview(rejectTarget, comment);
      toast.success("Review rejected");
      setReviews((prev) =>
        prev.map((r) =>
          r._id === rejectTarget
            ? { ...r, status: "REJECTED", adminComment: comment }
            : r
        )
      );
      setRejectTarget(null);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to reject review");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setActionLoading(true);
    try {
      await deleteReview(id);
      toast.success("Review deleted");
      setReviews((prev) => prev.filter((r) => r._id !== id));
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to delete review");
    } finally {
      setActionLoading(false);
      setConfirmDelete(null);
    }
  };

  const handleBulkApprove = async () => {
    setConfirmBulkApprove(false);
    setActionLoading(true);
    let success = 0;
    for (const id of selected) {
      try {
        await approveReview(id);
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status: "APPROVED" } : r))
        );
        success++;
      } catch {
        /* skip individual failures */
      }
    }
    toast.success(`${success} review(s) approved`);
    setSelected(new Set());
    setActionLoading(false);
  };

  const handleBulkDelete = async () => {
    setConfirmBulkDelete(false);
    setActionLoading(true);
    let success = 0;
    for (const id of selected) {
      try {
        await deleteReview(id);
        setReviews((prev) => prev.filter((r) => r._id !== id));
        success++;
      } catch {
        /* skip */
      }
    }
    toast.success(`${success} review(s) deleted`);
    setSelected(new Set());
    setActionLoading(false);
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* ── Section Header */}
      <AdminPageHeader
        title="Review Management"
        subtitle="Moderate, approve, and analyse all product reviews."
        breadcrumbs={[
            { label: "Dashboard", path: "/admin/dashboard" },
            { label: "Reviews" }
        ]}
        actionButton={
            <button
              onClick={() => fetchReviews(true)}
              disabled={loading || isRefreshing}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
            >
              <FiRefreshCw className={`h-4 w-4 ${loading || isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
        }
      />

      {/* ── Analytics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<FiMessageSquare className="h-5 w-5" />}
          label="Total Reviews"
          value={loading ? "—" : stats.total}
          color="blue"
        />
        <StatCard
          icon={<FiClock className="h-5 w-5" />}
          label="Pending Review"
          value={loading ? "—" : stats.pending}
          sub={stats.pending > 0 ? "Needs attention" : "All clear!"}
          color="amber"
        />
        <StatCard
          icon={<FiStar className="h-5 w-5" />}
          label="Avg. Rating"
          value={loading ? "—" : stats.avgRating}
          sub="out of 5 stars"
          color="violet"
        />
        <StatCard
          icon={<FiTrendingUp className="h-5 w-5" />}
          label="Approved"
          value={loading ? "—" : stats.approved}
          sub={
            stats.total > 0
              ? `${Math.round((stats.approved / stats.total) * 100)}% approval rate`
              : undefined
          }
          color="emerald"
        />
      </div>

      {/* ── Toolbar: Search + Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by user, product, or keyword…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-2">
            <FiFilter className="h-4 w-4 shrink-0 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          {/* Rating filter */}
          <div className="flex items-center gap-2">
            <FiStar className="h-4 w-4 shrink-0 text-slate-400" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value={0}>All Ratings</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Eco-score filter */}
          <div className="flex items-center gap-2">
            <FiGlobe className="h-4 w-4 shrink-0 text-emerald-500" />
            <select
              value={filterEcoMin}
              onChange={(e) => setFilterEcoMin(Number(e.target.value))}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value={0}>All Eco-Scores</option>
              <option value={75}>High (≥ 75)</option>
              <option value={50}>Medium (≥ 50)</option>
              <option value={25}>Low (≥ 25)</option>
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        {(filterStatus !== "ALL" || filterRating > 0 || filterEcoMin > 0 || search) && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">Active filters:</span>
            {search && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                "{search}"
                <button onClick={() => setSearch("")}>
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            )}
            {filterStatus !== "ALL" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {filterStatus}
                <button onClick={() => setFilterStatus("ALL")}>
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            )}
            {filterRating > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {filterRating} stars
                <button onClick={() => setFilterRating(0)}>
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            )}
            {filterEcoMin > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                🌱 Eco ≥ {filterEcoMin}
                <button onClick={() => setFilterEcoMin(0)}>
                  <FiX className="h-3 w-3" />
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSearch("");
                setFilterStatus("ALL");
                setFilterRating(0);
                setFilterEcoMin(0);
              }}
              className="ml-1 text-xs text-red-500 transition hover:text-red-700"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* ── Bulk Actions Bar */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <span className="text-sm font-semibold text-emerald-800">
            {selected.size} selected
          </span>
          <button
            onClick={() => setConfirmBulkApprove(true)}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            <FiCheck className="h-3.5 w-3.5" /> Approve All
          </button>
          <button
            onClick={() => setConfirmBulkDelete(true)}
            disabled={actionLoading}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-red-700 disabled:opacity-60"
          >
            <FiTrash2 className="h-3.5 w-3.5" /> Delete All
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="ml-auto text-xs text-slate-500 hover:text-slate-700"
          >
            Deselect
          </button>
        </div>
      )}

      {/* ── Data Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Result count */}
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <p className="text-xs text-slate-500">
            {loading ? "Loading…" : `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={
                      paginated.length > 0 && selected.size === paginated.length
                    }
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Reviewer
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Product
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 select-none"
                  onClick={() => toggleSort("overallRating")}
                >
                  <span className="inline-flex items-center gap-1">
                    Rating <SortIcon field="overallRating" currentSort={sort} />
                  </span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Review
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  🌱 Eco-Score
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th
                  className="cursor-pointer px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-500 select-none"
                  onClick={() => toggleSort("createdAt")}
                >
                  <span className="inline-flex items-center gap-1">
                    Date <SortIcon field="createdAt" currentSort={sort} />
                  </span>
                </th>
                <th className="px-4 py-3 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 bg-white">
              {/* Loading skeleton */}
              {loading &&
                [...Array(PAGE_SIZE)].map((_, i) => <SkeletonRow key={i} />)}

              {/* Error state */}
              {!loading && error && (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <FiAlertTriangle className="h-10 w-10 text-red-400" />
                      <p className="text-base font-semibold text-slate-700">
                        Error loading reviews
                      </p>
                      <p className="text-sm text-slate-400">{error}</p>
                      <button
                        onClick={fetchReviews}
                        className="mt-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                      >
                        Try Again
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {/* Empty state */}
              {!loading && !error && filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                        <FiMessageSquare className="h-8 w-8 text-emerald-400" />
                      </div>
                      <p className="text-base font-semibold text-slate-700">
                        No reviews found
                      </p>
                      <p className="text-sm text-slate-400">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              )}

              {/* Data rows */}
              {!loading &&
                !error &&
                paginated.map((review) => {
                  const user = review.user || {};
                  const product = review.product || {};
                  const ecoScore = product.sustainabilityScore ?? 0;
                  const ecoColors = ecoScoreColor(ecoScore);
                  const isSelected = selected.has(review._id);
                  const ecoMention = hasSustainabilityMention(review.reviewText);

                  return (
                    <tr
                      key={review._id}
                      className={`transition-colors hover:bg-slate-50/70 ${
                        isSelected ? "bg-emerald-50/40" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(review._id)}
                          className="h-4 w-4 rounded border-slate-300 accent-emerald-600"
                        />
                      </td>

                      {/* Reviewer */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <UserAvatar user={user} isAnonymous={review.isAnonymous} size="sm" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                              {review.isAnonymous
                                ? "Anonymous User"
                                : user && Object.keys(user).length > 0
                                  ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown User"
                                  : "Unknown User"}
                            </p>
                            {!review.isAnonymous && (
                              <p className="truncate text-xs text-slate-400">
                                {user?.email || "No email provided"}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]?.url || product.images[0]}
                              alt={product.name}
                              className="h-8 w-8 rounded-lg object-cover ring-1 ring-slate-200"
                            />
                          ) : (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                              <FiMessageSquare className="h-3.5 w-3.5 text-slate-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="max-w-[120px] truncate text-xs font-semibold text-slate-800">
                              {product.name || "—"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {product.brand || ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-3">
                        <StarRating rating={review.overallRating} />
                      </td>

                      {/* Review text */}
                      <td className="max-w-[200px] px-4 py-3">
                        <div className="flex items-start gap-1">
                          {ecoMention && (
                            <FiGlobe className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" title="Sustainability mention" />
                          )}
                          <p className="line-clamp-2 text-xs text-slate-600">
                            {review.reviewText}
                          </p>
                        </div>
                      </td>

                      {/* Eco-score */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={`h-full rounded-full ${ecoColors.bar}`}
                              style={{ width: `${ecoScore}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${ecoColors.text}`}>
                            {Math.round(ecoScore)}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <StatusBadge status={review.status} />
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                        {formatDate(review.createdAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View */}
                          <button
                            onClick={() => setViewReview(review)}
                            title="View Details"
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                          >
                            <FiEye className="h-3.5 w-3.5" />
                          </button>

                          {/* Approve */}
                          {review.status !== "APPROVED" && (
                            <button
                              onClick={() => handleApprove(review._id)}
                              disabled={actionLoading}
                              title="Approve"
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 transition hover:bg-emerald-200 disabled:opacity-50"
                            >
                              <FiCheck className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {/* Reject */}
                          {review.status !== "REJECTED" && (
                            <button
                              onClick={() => setRejectTarget(review._id)}
                              disabled={actionLoading}
                              title="Reject"
                              className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-100 text-amber-700 transition hover:bg-amber-200 disabled:opacity-50"
                            >
                              <FiX className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {/* Delete */}
                          <button
                            onClick={() => setConfirmDelete(review._id)}
                            disabled={actionLoading}
                            title="Delete"
                            className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-100 text-red-600 transition hover:bg-red-200 disabled:opacity-50"
                          >
                            <FiTrash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
            <p className="text-xs text-slate-500">
              Page {page} of {totalPages} &middot; {filtered.length} reviews
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>
              {[...Array(totalPages)].map((_, i) => {
                const pg = i + 1;
                if (
                  pg === 1 ||
                  pg === totalPages ||
                  (pg >= page - 1 && pg <= page + 1)
                ) {
                  return (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-semibold transition ${
                        page === pg
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {pg}
                    </button>
                  );
                }
                if (pg === page - 2 || pg === page + 2) {
                  return (
                    <span key={pg} className="px-1 text-slate-400">
                      …
                    </span>
                  );
                }
                return null;
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Modals & Dialogs */}
      <ReviewDetailsModal
        review={viewReview}
        onClose={() => setViewReview(null)}
      />

      <RejectModal
        isOpen={!!rejectTarget}
        loading={actionLoading}
        onSubmit={handleRejectSubmit}
        onClose={() => setRejectTarget(null)}
      />

      <ConfirmDialog
        isOpen={!!confirmDelete}
        title="Delete Review"
        message="Are you sure you want to permanently delete this review? This action cannot be undone."
        onConfirm={() => handleDelete(confirmDelete)}
        onCancel={() => setConfirmDelete(null)}
        danger
      />

      <ConfirmDialog
        isOpen={confirmBulkApprove}
        title={`Approve ${selected.size} Reviews`}
        message={`This will approve all ${selected.size} selected reviews and make them visible to users.`}
        onConfirm={handleBulkApprove}
        onCancel={() => setConfirmBulkApprove(false)}
        danger={false}
      />

      <ConfirmDialog
        isOpen={confirmBulkDelete}
        title={`Delete ${selected.size} Reviews`}
        message={`This will permanently delete all ${selected.size} selected reviews. This action cannot be undone.`}
        onConfirm={handleBulkDelete}
        onCancel={() => setConfirmBulkDelete(false)}
        danger
      />
    </div>
  );
}
