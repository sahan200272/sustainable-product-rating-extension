import React, { useState, useEffect } from "react";
import { Star, MessageCircle, ShieldCheck, Loader, Clock, Leaf, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import Modal from "../common/Modal";

// ── Helpers ───────────────────────────────────────────────────────────────────
const relativeTime = (dateStr) => {
  if (!dateStr) return "";
  const diff = (new Date(dateStr) - Date.now()) / 1000;
  const abs  = Math.abs(diff);
  const rtf  = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (abs < 60)          return rtf.format(Math.round(diff), "second");
  if (abs < 3600)        return rtf.format(Math.round(diff / 60), "minute");
  if (abs < 86400)       return rtf.format(Math.round(diff / 3600), "hour");
  if (abs < 86400 * 30)  return rtf.format(Math.round(diff / 86400), "day");
  if (abs < 86400 * 365) return rtf.format(Math.round(diff / (86400 * 30)), "month");
  return rtf.format(Math.round(diff / (86400 * 365)), "year");
};

// ── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonReview() {
  return (
    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
      <div className="flex gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-4 h-4 rounded animate-shimmer" />
        ))}
      </div>
      <div className="space-y-2 mb-6">
        <div className="h-4 rounded animate-shimmer w-full" />
        <div className="h-4 rounded animate-shimmer w-5/6" />
        <div className="h-4 rounded animate-shimmer w-4/6" />
      </div>
      <div className="flex gap-2 mb-6">
        <div className="h-6 w-24 rounded-full animate-shimmer" />
        <div className="h-6 w-20 rounded-full animate-shimmer" />
      </div>
      <div className="border-t border-slate-100 pt-5 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full animate-shimmer" />
        <div className="space-y-2 flex-1">
          <div className="h-3 w-28 rounded animate-shimmer" />
          <div className="h-3 w-20 rounded animate-shimmer" />
        </div>
      </div>
    </div>
  );
}

// ── Star row with stagger ─────────────────────────────────────────────────────
function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: false }}
          transition={{ delay: i * 0.07, type: "spring", stiffness: 400 }}
        >
          <Star
            size={16}
            fill={i < rating ? "currentColor" : "none"}
            className={i < rating ? "text-amber-400" : "text-slate-200"}
          />
        </motion.span>
      ))}
    </div>
  );
}

// ── Review card ───────────────────────────────────────────────────────────────
function ReviewCard({ review, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8
                 border border-white/80 shadow-md hover:shadow-xl cursor-pointer
                 flex flex-col overflow-hidden transition-shadow duration-300"
    >
      {/* Accent top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-t-3xl origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out" />

      {/* Quote icon */}
      <div className="absolute top-7 right-7 p-2.5 rounded-2xl bg-slate-50 group-hover:bg-emerald-50 transition-colors duration-300">
        <MessageCircle className="w-5 h-5 text-slate-300 group-hover:text-emerald-400 transition-colors duration-300" />
      </div>

      {/* Stars */}
      <div className="mb-2">
        <StarRow rating={review.overallRating} />
      </div>

      {/* Time */}
      <div className="flex items-center gap-1 mb-5 text-xs font-semibold text-slate-400">
        <Clock className="w-3.5 h-3.5" />
        <span>{relativeTime(review.createdAt)}</span>
      </div>

      {/* Review text */}
      <div className="relative flex-grow mb-5">
        <Quote className="absolute -top-1 -left-1 w-8 h-8 text-emerald-100" />
        <p className="text-slate-700 leading-relaxed text-[15px] font-medium line-clamp-4 pl-3">
          {review.reviewText}
        </p>
      </div>

      {/* Tags */}
      {review.sustainabilityTags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {review.sustainabilityTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full"
            >
              <Leaf className="w-2.5 h-2.5" />
              {tag.replace(/_/g, " ")}
            </span>
          ))}
          {review.sustainabilityTags.length > 2 && (
            <span className="text-[10px] font-bold px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full">
              +{review.sustainabilityTags.length - 2}
            </span>
          )}
        </div>
      )}

      {/* Author */}
      <div className="mt-auto border-t border-slate-100 pt-5 flex items-center gap-3">
        <div className="relative shrink-0">
          <motion.div
            className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-transparent group-hover:ring-emerald-300 transition-all duration-300"
          >
            <img
              src={
                review.user?.profilePicture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.firstName || "A")}+${encodeURIComponent(review.user?.lastName || "U")}&background=10b981&color=fff&bold=true`
              }
              alt={`${review.user?.firstName} ${review.user?.lastName}`}
              className="w-full h-full object-cover"
            />
          </motion.div>
          <motion.div
            className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
          >
            <ShieldCheck size={16} className="text-white fill-emerald-500" />
          </motion.div>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-slate-900 text-sm leading-tight truncate">
            {review.user ? `${review.user.firstName} ${review.user.lastName}` : "Anonymous User"}
          </h4>
          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
            <span className="text-xs font-semibold text-emerald-600">
              {review.user?.role === "Customer" ? "Verified Purchaser" : review.user?.role || "Verified"}
            </span>
            {review.product?.name && (
              <>
                <span className="text-slate-300 text-[8px]">•</span>
                <span className="text-xs text-slate-400 truncate max-w-[120px]">{review.product.name}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentReviews = async () => {
      try {
        const response = await api.get("/api/reviews/recent");
        if (response.data.success) setReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching recent reviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentReviews();
  }, []);

  const handleOpenModal = (review) => { setSelectedReview(review); setIsModalOpen(true); };
  const handleCloseModal = () => { setSelectedReview(null); setIsModalOpen(false); };

  return (
    <section className="py-28 bg-gradient-to-br from-slate-50 to-emerald-50/30 border-t border-slate-100 relative overflow-hidden">
      {/* Blobs */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-emerald-100/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-teal-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-emerald-100 text-emerald-700 text-xs font-bold mb-6 uppercase tracking-wider">
            <Star size={13} className="fill-emerald-500 text-emerald-500" />
            Trusted by Conscious Shoppers
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-5 tracking-tight leading-tight">
            Community{" "}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Voice
            </span>
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed">
            Real experiences from mindful consumers, curated by AI moderation to ensure authenticity.
          </p>
        </motion.div>

        {/* Cards */}
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <SkeletonReview key={i} />)}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard key={review._id} review={review} onClick={() => handleOpenModal(review)} />
              ))
            ) : (
              <div className="col-span-3 text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <MessageCircle className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-900">No reviews yet</h3>
                <p className="mt-1 text-slate-500 text-sm">Be the first to share your mindful shopping experience!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Review Details">
        {selectedReview && (
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-100 shrink-0">
                  <img
                    src={selectedReview.user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedReview.user?.firstName || "A")}+${encodeURIComponent(selectedReview.user?.lastName || "U")}&background=10b981&color=fff&bold=true`}
                    alt={`${selectedReview.user?.firstName} ${selectedReview.user?.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-emerald-50">
                  <ShieldCheck size={20} className="text-white fill-emerald-500" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-extrabold text-slate-900 text-xl leading-tight">
                  {selectedReview.user ? `${selectedReview.user.firstName} ${selectedReview.user.lastName}` : "Anonymous User"}
                </h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-sm font-semibold text-emerald-600">
                    {selectedReview.user?.role === "Customer" ? "Verified Purchaser" : selectedReview.user?.role || "Verified"}
                  </span>
                  {selectedReview.product?._id && selectedReview.product?.name && (
                    <>
                      <span className="text-slate-300 text-xs">•</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleCloseModal(); navigate(`/products/${selectedReview.product._id}`); }}
                        className="text-sm font-medium text-slate-500 hover:text-emerald-600 hover:underline transition-colors"
                      >
                        {selectedReview.product.name}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={22} fill={i < selectedReview.overallRating ? "currentColor" : "none"} className={i < selectedReview.overallRating ? "text-amber-400" : "text-slate-200"} />
                  ))}
                  <span className="ml-2 font-bold text-slate-700 text-lg">{selectedReview.overallRating}.0</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>{new Date(selectedReview.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                </div>
              </div>
              <div className="relative">
                <Quote className="absolute -top-2 -left-2 w-10 h-10 text-slate-100 -z-10" />
                <p className="text-slate-700 leading-relaxed text-[15px] p-2">{selectedReview.reviewText}</p>
              </div>
            </div>

            {selectedReview.sustainabilityTags?.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Sustainability Highlights</h5>
                <div className="flex flex-wrap gap-2">
                  {selectedReview.sustainabilityTags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full shadow-sm">
                      <Leaf className="w-3.5 h-3.5" />{tag.replace(/_/g, " ")}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
