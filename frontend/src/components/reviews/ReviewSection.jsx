/**
 * ReviewSection.jsx
 *
 * Top-level orchestrator that combines ReviewForm and ReviewList.
 * Placed at the bottom of ProductDetailsPage.
 *
 * Responsibilities:
 *   - Owns `prependedReview` state — receives the new review from ReviewForm
 *     and passes it down to ReviewList for optimistic display.
 *   - Provides a visually cohesive section with a divider and heading.
 *   - Adapts the two-column layout on large screens (form left, list right).
 *
 * Props:
 *   productId {string} – MongoDB ObjectId of the product
 */

import { useState, useContext } from "react";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { AuthContext } from "../../context/AuthContext";
import { FiMessageSquare } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

export default function ReviewSection({ productId }) {
  const { user } = useContext(AuthContext);

  /**
   * When ReviewForm succeeds, it calls onReviewSubmit(review).
   * We store that here and pass it to ReviewList as `prependedReview`.
   * ReviewList will insert it at the top of the card stack immediately,
   * giving the user instant visual feedback without waiting for moderation.
   */
  const [prependedReview, setPrependedReview] = useState(null);

  const handleReviewSubmit = (newReview) => {
    setPrependedReview(newReview);
  };

  return (
    <section
      id="reviews"
      aria-label="Product Reviews"
      className="mt-10 pt-10 border-t border-gray-100"
    >
      {/* ── Section heading ── */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          <FiMessageSquare className="w-4 h-4 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">Community Reviews</h2>
        {/* SDG 12 badge */}
        <span className="ml-auto flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
          <FaLeaf className="w-3 h-3" /> SDG 12
        </span>
      </div>

      {/*
        ── Responsive layout ──
        - Mobile: stacked (form on top, list below)
        - Desktop ≥lg: side-by-side (form 40%, list 60%)
      */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* ── Left column: Review Form ── */}
        <div className="lg:col-span-2 lg:sticky lg:top-24">
          <ReviewForm
            productId={productId}
            onSuccess={handleReviewSubmit}
          />
        </div>

        {/* ── Right column: Review List ── */}
        <div className="lg:col-span-3">
          <ReviewList
            productId={productId}
            prependedReview={prependedReview}
            currentUserId={user?._id ?? user?.id}
            currentRole={user?.role}
          />
        </div>
      </div>
    </section>
  );
}
