/**
 * ReviewSection.jsx
 *
 * Top-level orchestrator that combines ReviewForm and ReviewList.
 * Placed at the bottom of ProductDetailsPage.
 *
 * Responsibilities:
 *   - Owns `prependedReview` state — receives the new review from ReviewForm
 *     and passes it down to ReviewList for optimistic display.
 *   - Manages state for the "Write a Review" modal.
 *   - Provides a visually cohesive section with a divider and heading.
 */

import { useState, useContext } from "react";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import Modal from "../common/Modal";
import { AuthContext } from "../../context/AuthContext";
import { FiMessageSquare, FiEdit3 } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

export default function ReviewSection({ productId }) {
  const { user } = useContext(AuthContext);

  const [prependedReview, setPrependedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReviewSubmit = (newReview) => {
    setPrependedReview(newReview);
    setIsModalOpen(false); // Close modal on success
  };

  return (
    <section
      id="reviews"
      aria-label="Product Reviews"
      className="mt-10 pt-10 border-t border-gray-100"
    >
      {/* ── Section heading & Actions ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
            <FiMessageSquare className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Community Reviews</h2>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mt-1">
              <FaLeaf className="w-3 h-3" /> <span>SDG 12: Responsible Consumption</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
        >
          <FiEdit3 className="w-4 h-4" />
          Write a Review
        </button>
      </div>

      {/* ── Right column: Review List (now full width) ── */}
      <div className="w-full">
        <ReviewList
          productId={productId}
          prependedReview={prependedReview}
          currentUserId={user?._id ?? user?.id}
          currentRole={user?.role}
        />
      </div>

      {/* ── Write Review Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Write a Review"
      >
        <ReviewForm
          productId={productId}
          onSuccess={handleReviewSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </section>
  );
}
