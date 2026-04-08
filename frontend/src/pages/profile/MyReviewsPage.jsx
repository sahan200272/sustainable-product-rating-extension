/**
 * MyReviewsPage.jsx
 *
 * Shows all reviews submitted by the authenticated user, including:
 *   - Status badges (APPROVED / PENDING / REJECTED)
 *   - Admin rejection comment when status is REJECTED
 *   - Read-only star display
 *   - Sustainability tags
 *   - Delete with confirmation modal
 *   - Filter tabs (All / Approved / Pending / Rejected)
 *   - Empty state with CTA linking to Products page
 *
 * Fully responsive, modern SaaS-style design using Tailwind CSS v4.
 */

import { useState, useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import { getMyReviews, deleteReview } from "../../services/reviewService";
import { AuthContext } from "../../context/AuthContext";
import RatingStars from "../../components/reviews/RatingStars";
import DeleteConfirmModal from "../../components/reviews/DeleteConfirmModal";
import toast from "react-hot-toast";
import {
  RiStarLine,
  RiLeafLine,
  RiDeleteBinLine,
  RiTimeLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiLoader4Line,
  RiShoppingBagLine,
  RiArrowRightLine,
  RiSearchLine,
  RiFilterLine,
} from "react-icons/ri";
import { FaLeaf } from "react-icons/fa";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const relativeTime = (dateStr) => {
  const diff = (new Date(dateStr) - Date.now()) / 1000;
  const abs  = Math.abs(diff);
  const rtf  = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (abs < 60)          return rtf.format(Math.round(diff),              "second");
  if (abs < 3600)        return rtf.format(Math.round(diff / 60),         "minute");
  if (abs < 86400)       return rtf.format(Math.round(diff / 3600),       "hour");
  if (abs < 86400 * 30)  return rtf.format(Math.round(diff / 86400),      "day");
  if (abs < 86400 * 365) return rtf.format(Math.round(diff / (86400*30)), "month");
  return rtf.format(Math.round(diff / (86400 * 365)), "year");
};

const STATUS_CONFIG = {
  APPROVED: {
    label: "Approved",
    icon: <RiCheckboxCircleLine />,
    card:  "border-l-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot:   "bg-emerald-400",
  },
  PENDING: {
    label: "Pending Review",
    icon: <RiTimeLine />,
    card:  "border-l-amber-400",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    dot:   "bg-amber-400",
  },
  REJECTED: {
    label: "Rejected",
    icon: <RiCloseCircleLine />,
    card:  "border-l-rose-400",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
    dot:   "bg-rose-400",
  },
};

const FILTER_TABS = ["All", "Approved", "Pending", "Rejected"];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SummaryPill({ count, label, status }) {
  const cfg = STATUS_CONFIG[status] ?? {};
  return (
    <div className={`flex flex-col items-center gap-1 px-5 py-4 rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow ${cfg.badge || "border-slate-100"}`}>
      <span className="text-2xl font-black text-slate-800">{count}</span>
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}

function ReviewCard({ review, onDelete }) {
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting]   = useState(false);

  const cfg = STATUS_CONFIG[review.status] ?? STATUS_CONFIG.PENDING;
  const productName = review.product?.name || "Unknown Product";
  const productId   = review.product?._id  || review.product;

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await onDelete(review._id);
      setShowModal(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <DeleteConfirmModal
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={deleting}
      />

      <article
        className={`bg-white rounded-2xl border border-l-4 ${cfg.card} border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 animate-[fadeIn_0.3s_ease]`}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Product icon */}
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0">
              <RiShoppingBagLine className="text-slate-400 text-base" />
            </div>
            <div className="flex-1 min-w-0">
              {/* Product link */}
              {productId ? (
                <Link
                  to={`/products/${productId}`}
                  className="text-sm font-bold text-slate-800 hover:text-emerald-600 transition-colors truncate block leading-tight"
                >
                  {productName}
                </Link>
              ) : (
                <p className="text-sm font-bold text-slate-800 truncate leading-tight">{productName}</p>
              )}
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <RiTimeLine className="text-xs" />
                {relativeTime(review.createdAt)}
              </p>
            </div>
          </div>

          {/* Status badge + delete */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cfg.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
            <button
              id={`delete-review-${review._id}`}
              onClick={() => setShowModal(true)}
              disabled={deleting}
              aria-label="Delete review"
              className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {deleting
                ? <RiLoader4Line className="text-base animate-spin" />
                : <RiDeleteBinLine className="text-base" />
              }
            </button>
          </div>
        </div>

        {/* ── Stars ───────────────────────────────────────────────────── */}
        <div className="mb-3">
          <RatingStars rating={review.overallRating} readOnly showLabel={false} size="w-4 h-4" />
        </div>

        {/* ── Review text ─────────────────────────────────────────────── */}
        <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {review.reviewText}
        </p>

        {/* ── Admin rejection comment ──────────────────────────────────── */}
        {review.status === "REJECTED" && review.adminComment && (
          <div className="bg-rose-50 border border-rose-100 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs font-bold text-rose-600 mb-0.5 uppercase tracking-wide">
              Admin Feedback
            </p>
            <p className="text-xs text-rose-700 leading-relaxed">{review.adminComment}</p>
          </div>
        )}

        {/* ── Sustainability tags ──────────────────────────────────────── */}
        {review.sustainabilityTags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {review.sustainabilityTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full"
              >
                <FaLeaf className="w-2.5 h-2.5" />
                {tag.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}

        {/* ── Footer link ─────────────────────────────────────────────── */}
        {productId && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <Link
              to={`/products/${productId}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              View Product <RiArrowRightLine />
            </Link>
          </div>
        )}
      </article>
    </>
  );
}

function EmptyState({ filter }) {
  const message =
    filter === "All"
      ? "You haven't written any reviews yet. Start sharing your sustainability insights!"
      : `No ${filter.toLowerCase()} reviews found.`;
  return (
    <div className="col-span-full flex flex-col items-center gap-5 py-20 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center border border-emerald-100 shadow-sm">
        <RiStarLine className="text-emerald-400 text-3xl" />
      </div>
      <div>
        <h3 className="text-lg font-black text-slate-800 mb-1">{filter === "All" ? "No reviews yet" : `No ${filter} reviews`}</h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">{message}</p>
      </div>
      {filter === "All" && (
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm shadow-emerald-200 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <RiLeafLine />
          Browse Sustainable Products
        </Link>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyReviewsPage() {
  const { user } = useContext(AuthContext);

  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("All");
  const [search, setSearch]     = useState("");

  // ── Fetch reviews on mount ───────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getMyReviews();
        if (!cancelled) {
          setReviews(res?.data ?? []);
        }
      } catch (err) {
        if (!cancelled) toast.error("Failed to load your reviews.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Delete handler ───────────────────────────────────────────────────────
  const handleDelete = useCallback(async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
      toast.success("Review deleted successfully.");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to delete review.");
    }
  }, []);

  // ── Derived values ───────────────────────────────────────────────────────
  const counts = {
    All:      reviews.length,
    Approved: reviews.filter((r) => r.status === "APPROVED").length,
    Pending:  reviews.filter((r) => r.status === "PENDING").length,
    Rejected: reviews.filter((r) => r.status === "REJECTED").length,
  };

  const filtered = reviews
    .filter((r) => filter === "All" || r.status === filter.toUpperCase())
    .filter((r) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        r.reviewText?.toLowerCase().includes(q) ||
        r.product?.name?.toLowerCase().includes(q)
      );
    });

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center">
            <RiLoader4Line className="text-emerald-500 text-2xl animate-spin" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Loading your reviews…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Page header ──────────────────────────────────────────────────── */}
        <div className="mb-8">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
                  <RiStarLine className="text-white text-lg" />
                </span>
                My Reviews
              </h1>
              <p className="text-slate-500 text-sm mt-2 ml-[52px]">
                Track all your product reviews and their moderation status
              </p>
            </div>
            <Link
              to="/products"
              id="my-reviews-browse-btn"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              <RiLeafLine />
              Browse Products
            </Link>
          </div>

          {/* Summary pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <SummaryPill count={counts.All}      label="Total"    />
            <SummaryPill count={counts.Approved} label="Approved" status="APPROVED" />
            <SummaryPill count={counts.Pending}  label="Pending"  status="PENDING"  />
            <SummaryPill count={counts.Rejected} label="Rejected" status="REJECTED" />
          </div>

          {/* ── Controls: filter tabs + search ─────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            {/* Filter tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab}
                  id={`filter-tab-${tab.toLowerCase()}`}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200 ${
                    filter === tab
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${filter === tab ? "bg-slate-100 text-slate-600" : "bg-slate-200/0"}`}>
                    {counts[tab]}
                  </span>
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative flex-1 sm:max-w-xs">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-base" />
              <input
                id="reviews-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by product or text…"
                className="w-full pl-9 pr-4 py-2.5 text-sm font-medium bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent hover:border-slate-300 transition-all duration-200"
              />
            </div>

            <p className="text-xs text-slate-400 font-medium sm:ml-auto">
              <RiFilterLine className="inline mr-1" />
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* ── Review grid ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.length === 0 ? (
            <EmptyState filter={filter} />
          ) : (
            filtered.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>

      </div>
    </div>
  );
}
