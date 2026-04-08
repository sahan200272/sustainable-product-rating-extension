/**
 * ReviewList.jsx
 *
 * Fetches and displays all APPROVED reviews for a product.
 *
 * Lifecycle:
 *   1. On mount (or when productId changes), fetch approved reviews.
 *   2. Parent ReviewSection can prepend a newly submitted review via
 *      the `prependedReview` prop — this enables optimistic UI without
 *      a full refetch (the server will still moderate it, but we show
 *      it to the reviewer immediately with a PENDING badge).
 *
 * Props:
 *   productId      {string}       – Product to load reviews for
 *   prependedReview {object|null}  – Freshly submitted review to show at top
 *   currentUserId  {string|null}
 *   currentRole    {string|null}
 */

import { useEffect, useState, useContext } from "react";
import { getReviewsByProduct, deleteReview } from "../../services/reviewService";
import { AuthContext } from "../../context/AuthContext";
import ReviewCard from "./ReviewCard";
import RatingStars from "./RatingStars";
import { FiLoader, FiMessageSquare, FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="h-2 bg-gray-100 rounded w-1/5" />
        </div>
      </div>
      <div className="h-2 bg-gray-100 rounded mb-2 w-1/4" />
      <div className="space-y-1.5">
        <div className="h-2.5 bg-gray-100 rounded" />
        <div className="h-2.5 bg-gray-100 rounded w-5/6" />
        <div className="h-2.5 bg-gray-100 rounded w-3/4" />
      </div>
    </div>
  );
}

// ─── Rating summary bar ───────────────────────────────────────────────────────
function RatingBar({ count, total, star }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="text-gray-500 w-4 text-right shrink-0">{star}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-gray-400 w-8 shrink-0">{count}</span>
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ReviewList({ productId, prependedReview, currentUserId, currentRole }) {
  const { user } = useContext(AuthContext);

  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // ── Fetch approved reviews ────────────────────────────────────────────────
  useEffect(() => {
    if (!productId) return;

    let cancelled = false;
    setLoading(true);
    setError("");

    getReviewsByProduct(productId)
      .then((res) => {
        if (!cancelled) setReviews(res.data || []);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load reviews. Please refresh the page.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [productId]);

  // ── Optimistic prepend (new review from ReviewForm) ───────────────────────
  useEffect(() => {
    if (!prependedReview) return;
    // Avoid duplicates if the list already refreshed
    setReviews((prev) =>
      prev.some((r) => r._id === prependedReview._id)
        ? prev
        : [prependedReview, ...prev]
    );
  }, [prependedReview]);

  // ── Delete handler ─────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted.");
    } catch {
      toast.error("Could not delete review.");
    }
  };

  // ── Rating analytics ──────────────────────────────────────────────────────
  const totalApproved = reviews.filter((r) => r.status === "APPROVED" || !r.status).length;
  const avgRating =
    totalApproved > 0
      ? reviews
          .filter((r) => r.status === "APPROVED" || !r.status)
          .reduce((sum, r) => sum + r.overallRating, 0) / totalApproved
      : 0;

  // Distribution count per star
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter(
      (r) => r.overallRating === star && (r.status === "APPROVED" || !r.status)
    ).length,
  }));

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        role="alert"
        className="flex items-center gap-3 p-5 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-700"
      >
        <FiAlertCircle className="shrink-0 w-5 h-5" />
        {error}
      </div>
    );
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  const visibleReviews = reviews; // show all — card handles status badge per owner
  if (visibleReviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl gap-3">
        <FiMessageSquare className="w-10 h-10 opacity-40" />
        <p className="font-medium text-gray-500">No reviews yet</p>
        <p className="text-sm">Be the first to share your sustainability experience!</p>
      </div>
    );
  }

  return (
    <div>
      {/* ── Rating Summary Widget ── */}
      {totalApproved > 0 && (
        <div className="bg-gradient-to-br from-gray-50 to-emerald-50 border border-gray-100 rounded-2xl p-5 mb-6 flex flex-col sm:flex-row gap-5 items-center">
          {/* Average score */}
          <div className="flex flex-col items-center text-center shrink-0 min-w-[90px]">
            <span className="text-5xl font-black text-gray-900 leading-none">
              {avgRating.toFixed(1)}
            </span>
            <RatingStars
              rating={Math.round(avgRating)}
              readOnly
              showLabel={false}
              size="w-4 h-4"
            />
            <span className="text-xs text-gray-400 mt-1">{totalApproved} review{totalApproved !== 1 ? "s" : ""}</span>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px h-16 bg-gray-200" />

          {/* Distribution bars */}
          <div className="flex-1 w-full space-y-1.5">
            {dist.map(({ star, count }) => (
              <RatingBar key={star} star={star} count={count} total={totalApproved} />
            ))}
          </div>
        </div>
      )}

      {/* ── Review cards ── */}
      <div className="space-y-4">
        {visibleReviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
            currentUserId={currentUserId ?? user?._id ?? user?.id}
            currentRole={currentRole ?? user?.role}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
