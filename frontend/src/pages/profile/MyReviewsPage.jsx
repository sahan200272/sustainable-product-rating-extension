import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { getMyReviews, deleteReview } from "../../services/reviewService";
import { AuthContext } from "../../context/AuthContext";
import DeleteConfirmModal from "../../components/reviews/DeleteConfirmModal";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiStarFill,
  RiLeafLine,
  RiDeleteBinLine,
  RiTimeLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiShoppingBagLine,
  RiEdit2Line,
  RiSearchLine,
  RiMore2Fill,
  RiWindyLine
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

// Generate deterministic random score based on ID string
const getSustainabilityScore = (id = "") => {
  if (!id) return 8.0;
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  const score = 7.0 + (Math.abs(hash) % 30) / 10; 
  return parseFloat(score.toFixed(1));
};

const STATUS_CONFIG = {
  APPROVED: {
    label: "Approved",
    icon: <RiCheckboxCircleFill className="w-3.5 h-3.5" />,
    color: "emerald",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  PENDING: {
    label: "Under Review",
    icon: <RiTimeLine className="w-3.5 h-3.5" />,
    color: "amber",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  REJECTED: {
    label: "Needs Improvement",
    icon: <RiCloseCircleFill className="w-3.5 h-3.5" />,
    color: "rose",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
};

const FILTER_TABS = ["All Stories", "Published", "Drafts / Pending"];

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReviewStoryCard({ review, onDelete, onClickCard, highlighted = false }) {
  const cfg = STATUS_CONFIG[review.status] ?? STATUS_CONFIG.PENDING;
  const productName = review.product?.name || "Unknown Product";
  const productId   = review.product?._id  || review.product;
  const sustainabilityScore = getSustainabilityScore(review._id);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onClickCard(review)}
      className={`group cursor-pointer bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 overflow-hidden ${
        highlighted ? "p-6 sm:p-8 sm:pb-6" : "p-5 sm:p-6"
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
        {/* Left: Optional distinct product visual */}
        <div className={`shrink-0 ${highlighted ? "hidden sm:block" : ""}`}>
           <div className={`rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 overflow-hidden ${
              highlighted ? "w-28 h-28" : "w-16 h-16"
           }`}>
            {review.product?.images?.length > 0 ? (
              <img src={review.product.images[0].url || review.product.images[0]} alt={productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : review.product?.image ? (
              <img src={review.product.image} alt={productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <RiShoppingBagLine className="text-slate-300 text-3xl" />
            )}
           </div>
        </div>

        {/* Right: Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
             <div>
                <h3 className={`font-bold text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors ${
                  highlighted ? "text-xl sm:text-2xl" : "text-lg"
                }`}>
                  {productName}
                </h3>
                <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                  <div className="flex text-amber-400 gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      i < review.overallRating ? <RiStarFill key={i} className={highlighted ? "w-4 h-4" : "w-3.5 h-3.5"} /> : <div key={i} className={`text-slate-200 ${highlighted ? "w-4 h-4" : "w-3.5 h-3.5"}`}><RiStarFill/></div>
                    ))}
                  </div>
                  <span className="text-slate-400 text-xs sm:text-sm font-medium flex items-center gap-1.5">
                    <RiTimeLine /> {relativeTime(review.createdAt)}
                  </span>
                </div>
             </div>
             
             {/* Status Badge */}
             <div className={`flex flex-col sm:flex-row items-end sm:items-center gap-1.5 px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} shrink-0`}>
                {cfg.icon}
                <span className="text-[11px] font-bold uppercase tracking-wider">{cfg.label}</span>
             </div>
          </div>

          {/* Body */}
          <p className={`text-slate-600 leading-relaxed font-normal mb-4 ${
             highlighted ? "line-clamp-4 text-base" : "line-clamp-2 text-sm"
          }`}>
            {review.reviewText}
          </p>

          {/* Footer details */}
          <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-50">
            <div className="flex items-center gap-2 overflow-hidden">
               <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg shrink-0">
                  <FaLeaf className="w-3 h-3" />
                  <span className="text-xs font-bold leading-none">{sustainabilityScore}/10 Impact</span>
               </div>
               {review.sustainabilityTags?.[0] && (
                 <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg truncate max-w-[120px] sm:max-w-[200px]">
                   {review.sustainabilityTags[0].replace(/_/g, " ")}
                 </span>
               )}
            </div>

            <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
               <button onClick={() => onDelete(review)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors tooltip" title="Delete Review">
                 <RiDeleteBinLine className="w-4.5 h-4.5" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ReviewDetailModal({ review, isOpen, onClose }) {
  if (!review) return null;
  const cfg = STATUS_CONFIG[review.status] ?? STATUS_CONFIG.PENDING;
  const productName = review.product?.name || "Unknown Product";
  const sustainabilityScore = getSustainabilityScore(review._id);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Your Review Story">
      <div className="space-y-8 pb-4">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 p-6 bg-slate-50 rounded-3xl border border-slate-100 text-center sm:text-left">
           <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
            {review.product?.images?.length > 0 ? (
              <img src={review.product.images[0].url || review.product.images[0]} alt={productName} className="w-full h-full object-cover" />
            ) : review.product?.image ? (
              <img src={review.product.image} alt={productName} className="w-full h-full object-cover" />
            ) : (
              <RiShoppingBagLine className="text-slate-400 text-4xl" />
            )}
           </div>
           <div>
             <h3 className="font-extrabold text-slate-900 text-xl leading-tight mb-2">{productName}</h3>
             <div className="flex flex-col sm:flex-row items-center gap-3 text-sm text-slate-500">
               <div className="flex text-amber-400 text-lg">
                  {[...Array(5)].map((_, i) => (
                    i < review.overallRating ? <RiStarFill key={i} /> : <div key={i} className="text-slate-200"><RiStarFill/></div>
                  ))}
               </div>
               <span className="hidden sm:inline">•</span>
               <span>{new Date(review.createdAt).toLocaleDateString("en-US", { month: 'long', day: 'numeric', year: 'numeric' })}</span>
             </div>
           </div>
        </div>

        {/* Narrative Block */}
        <div className="px-2">
           <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center justify-between">
             The Review
             <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} shadow-sm`}>
               {cfg.icon}
               <span className="text-[10px] font-bold uppercase tracking-wider">{cfg.label}</span>
             </div>
           </h4>
           <div className="bg-white border border-slate-100 shadow-sm p-6 rounded-3xl relative">
             <div className="absolute top-0 left-6 -mt-3 text-4xl text-slate-200 font-serif leading-none">"</div>
             <p className="text-slate-700 text-base leading-relaxed whitespace-pre-wrap pt-2 relative z-10 font-medium">
               {review.reviewText}
             </p>
           </div>
        </div>

        {/* Admin Feedback */}
        {review.status === "REJECTED" && review.adminComment && (
          <div className="mx-2 bg-rose-50 border border-rose-200 rounded-3xl p-5">
            <h4 className="text-xs font-extrabold text-rose-700 uppercase tracking-wider flex items-center gap-2 mb-2">
              <RiCloseCircleFill className="w-4 h-4" /> Moderator Note
            </h4>
            <p className="text-sm text-rose-800 leading-relaxed font-medium">{review.adminComment}</p>
          </div>
        )}

        {/* Impact Block */}
        <div className="px-2">
          <h4 className="text-sm font-semibold text-slate-900 mb-4">Sustainability Highlights</h4>
          <div className="flex flex-wrap gap-3">
             <div className="flex items-center gap-3 p-3 pr-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                 <FaLeaf className="text-emerald-500 text-xl" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-emerald-600/70 tracking-widest leading-none mb-1">Impact Score</p>
                <p className="font-extrabold text-emerald-900 text-lg leading-none">{sustainabilityScore}/10</p>
              </div>
            </div>
            {review.sustainabilityTags?.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 text-sm font-medium px-4 py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl"
              >
                {tag.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>

      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyReviewsPage() {
  const { user } = useContext(AuthContext);

  const [reviews, setReviews]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("All Stories");
  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 300);

  const [selectedReview, setSelectedReview] = useState(null);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch reviews ────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const loadReviews = async () => {
      try {
        const res = await getMyReviews();
        if (!cancelled) {
          // Sort reviews by date descending immediately so latest is first
          const sorted = (res?.data ?? []).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
          setReviews(sorted);
        }
      } catch (err) {
        if (!cancelled) toast.error("Failed to load your review history.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadReviews();
    return () => { cancelled = true; };
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!reviewToDelete) return;
    setIsDeleting(true);
    try {
      await deleteReview(reviewToDelete._id);
      setReviews((prev) => prev.filter((r) => r._id !== reviewToDelete._id));
      toast.success("Review removed successfully.");
      setReviewToDelete(null);
      if (selectedReview?._id === reviewToDelete._id) setSelectedReview(null);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to remove review.");
    } finally {
      setIsDeleting(false);
    }
  }, [reviewToDelete, selectedReview]);

  // ── Helpers for impact banner ────────────────────────────────────────────
  const avgSustainability = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((acc, r) => acc + getSustainabilityScore(r._id), 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const mockCarbonSaved = (reviews.length * 2.4).toFixed(1);

  // ── Apply Status Filter mapping ──────────────────────────────────────────
  const mappedFilter = filter === "All Stories" ? "ALL" 
                     : filter === "Published"   ? "APPROVED" 
                     : "PENDING_OR_REJECTED";

  const filteredData = useMemo(() => {
    return reviews
      .filter((r) => {
         if (mappedFilter === "ALL") return true;
         if (mappedFilter === "APPROVED") return r.status === "APPROVED";
         return r.status === "PENDING" || r.status === "REJECTED";
      })
      .filter((r) => {
        if (!debouncedSearch.trim()) return true;
        const q = debouncedSearch.toLowerCase();
        return (
          r.reviewText?.toLowerCase().includes(q) ||
          r.product?.name?.toLowerCase().includes(q)
        );
      });
  }, [reviews, mappedFilter, debouncedSearch]);

  const latestReview = reviews.length > 0 ? reviews[0] : null;

  const userName = user?.name?.split(' ')[0] || "Friend";
  const avatarInitial = userName.charAt(0).toUpperCase();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 flex justify-center">
        <div className="max-w-4xl w-full space-y-10 animate-pulse">
          <div className="flex items-center gap-4">
             <div className="w-16 h-16 rounded-full bg-slate-200" />
             <div className="space-y-2"><div className="h-8 w-48 bg-slate-200 rounded-lg" /><div className="h-4 w-64 bg-slate-200 rounded" /></div>
          </div>
          <div className="h-40 w-full bg-slate-200 rounded-3xl" />
          <div className="h-64 w-full bg-slate-200 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] py-12 px-4 sm:px-6 lg:px-8 font-inter text-slate-800">
      <DeleteConfirmModal
        isOpen={!!reviewToDelete}
        onCancel={() => setReviewToDelete(null)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      <ReviewDetailModal 
        isOpen={!!selectedReview} 
        onClose={() => setSelectedReview(null)} 
        review={selectedReview} 
      />

      {/* Main container: Centered, readable width */}
      <div className="max-w-3xl mx-auto">
        
        {/* ── Welcome Header ── */}
        <header className="flex items-center gap-5 mb-10">
          <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center text-emerald-700 font-extrabold text-2xl sm:text-3xl border-2 border-white shadow-md overflow-hidden">
             {user?.profilePicture ? (
               <img src={user.profilePicture} alt="Avatar" className="w-full h-full object-cover" />
             ) : avatarInitial}
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Welcome back, {userName} <span className="animate-[m-wave_2.5s_infinite] origin-[70%_70%] inline-block">👋</span>
            </h1>
            <p className="text-slate-500 mt-1 sm:mt-2 text-sm sm:text-base font-medium">
              Here’s how your voice is shaping a more sustainable world.
            </p>
          </div>
        </header>

        {/* ── Sustainability Story Section ── */}
        {reviews.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-14 relative bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 rounded-[2rem] p-8 sm:p-10 shadow-xl shadow-emerald-900/10 overflow-hidden text-white overflow-hidden"
          >
            {/* Soft background decor */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-emerald-500/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-48 h-48 bg-teal-500/30 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
               <div className="max-w-xs">
                 <h2 className="text-xl font-bold tracking-tight mb-2 flex items-center gap-2 text-emerald-50">
                   <FaLeaf className="text-emerald-300" /> Your Impact
                 </h2>
                 <p className="text-emerald-100/90 text-base leading-relaxed">
                   You are an active advocate. By rating products honestly, you guide others toward conscious consumerism.
                 </p>
               </div>

               <div className="flex items-center gap-6 p-5 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                  <div className="text-center px-2">
                     <p className="text-emerald-200 text-[11px] uppercase tracking-widest font-bold mb-1">Avg Score</p>
                     <p className="text-4xl font-black text-white">{avgSustainability}</p>
                  </div>
                  <div className="w-px h-12 bg-white/20" />
                  <div className="text-center px-2">
                     <p className="text-emerald-200 text-[11px] uppercase tracking-widest font-bold mb-1 flex items-center gap-1 justify-center">
                       <RiWindyLine className="text-sm border-b" /> CO₂ Offset
                     </p>
                     <p className="text-4xl font-black text-white">{mockCarbonSaved}<span className="text-xl text-emerald-200 font-bold ml-1">kg</span></p>
                  </div>
               </div>
            </div>
          </motion.section>
        )}

        {/* ── Highlighted Latest Story ── */}
        {latestReview && !debouncedSearch && filter === "All Stories" && (
           <div className="mb-14">
             <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
               Your latest story ✨
             </h3>
             <ReviewStoryCard
               review={latestReview}
               onDelete={() => setReviewToDelete(latestReview)}
               onClickCard={setSelectedReview}
               highlighted={true}
             />
           </div>
        )}

        {/* ── Main Feed Controls ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
           <h3 className="text-lg font-bold text-slate-800">
             {debouncedSearch ? "Search Results" : 
              filter === "All Stories" && latestReview ? "Previous Stories" : "Your Stories"}
           </h3>
           
           <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Soft Text Tabs */}
              <div className="flex items-center gap-4 px-2">
                {FILTER_TABS.map((tab) => {
                  const isActive = filter === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`relative text-sm font-semibold transition-colors py-1 ${
                        isActive ? "text-slate-900" : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {tab}
                      {isActive && (
                        <motion.div
                          layoutId="feedTabIndicator"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-slate-900 rounded-full"
                          initial={false}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Minimal Search */}
              <div className="relative w-full sm:w-auto mt-3 sm:mt-0">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Find a review..."
                  className="w-full sm:w-48 pl-9 pr-4 py-2 text-sm font-medium bg-slate-100/50 border border-slate-200 rounded-full text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all duration-300"
                />
              </div>
           </div>
        </div>

        {/* ── Story Feed ── */}
        <div className="space-y-5">
           {filteredData.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                className="py-16 text-center"
              >
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <RiMore2Fill className="text-3xl" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">It's quiet here</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto">
                   {debouncedSearch 
                    ? "We couldn't find any stories matching your search." 
                    : "You haven't written any reviews in this category yet. Start sharing to see them here!"}
                </p>
              </motion.div>
           ) : (
             <AnimatePresence>
               {filteredData.map((review) => {
                 // Skip latest mapping if it's already highlighted
                 if (filter === "All Stories" && !debouncedSearch && review._id === latestReview?._id) return null;
                 
                 return (
                   <ReviewStoryCard
                     key={review._id}
                     review={review}
                     onDelete={() => setReviewToDelete(review)}
                     onClickCard={setSelectedReview}
                   />
                 )
               })}
             </AnimatePresence>
           )}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes m-wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
      `}} />
    </div>
  );
}
