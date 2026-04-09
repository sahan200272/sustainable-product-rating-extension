import React, { useState, useEffect } from "react";
import { Star, MessageCircle, ShieldCheck, Loader, Quote, Clock, Leaf } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import Modal from "../common/Modal";

/** Relative time formatter */
const relativeTime = (dateStr) => {
    if (!dateStr) return "";
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

export default function ReviewsSection() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReview, setSelectedReview] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentReviews = async () => {
            try {
                const response = await api.get('/api/reviews/recent');
                if (response.data.success) {
                    setReviews(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching recent reviews:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecentReviews();
    }, []);

    const handleOpenModal = (review) => {
        setSelectedReview(review);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedReview(null);
        setIsModalOpen(false);
    };

    return (
        <section className="py-24 bg-slate-50 border-t border-slate-100 relative overflow-hidden">
            {/* Subtle Gradient Background Decors */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-emerald-100/50 rounded-full blur-3xl"></div>
                <div className="absolute top-[40%] -left-32 w-[400px] h-[400px] bg-teal-50/70 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-emerald-100 text-emerald-700 text-sm font-bold mb-6 tracking-wide uppercase">
                        <Star size={14} className="fill-emerald-600 text-emerald-600" />
                        Trusted by Conscious Shoppers
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Community Voice
                    </h2>
                    <p className="text-xl text-slate-600 leading-relaxed">
                        Real experiences from mindful consumers, curated by AI moderation to ensure authenticity and prevent fake claims.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader className="animate-spin text-emerald-500 w-12 h-12" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div 
                                    key={review._id} 
                                    onClick={() => handleOpenModal(review)}
                                    title="Click to view full review"
                                    className="bg-white/70 backdrop-blur-md rounded-[2rem] p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group flex flex-col relative overflow-hidden cursor-pointer hover:scale-[1.02]"
                                >
                                    {/* Accent Top Line */}
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-400 to-teal-400 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
                                    
                                    {/* Decorative Quote Icon */}
                                    <div className="absolute top-8 right-8 bg-slate-50 p-3 rounded-2xl group-hover:bg-emerald-50 transition-colors duration-300">
                                        <MessageCircle className="w-6 h-6 text-slate-300 group-hover:text-emerald-400 transition-colors duration-300" />
                                    </div>
                                    
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={18} 
                                                fill={i < review.overallRating ? "currentColor" : "none"} 
                                                className={i < review.overallRating ? "text-amber-400" : "text-slate-200"}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-1 mb-6 text-xs font-semibold text-slate-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>{relativeTime(review.createdAt)}</span>
                                    </div>
                                    
                                    <p className="text-slate-700 leading-relaxed mb-6 flex-grow text-lg font-medium relative z-10 line-clamp-3">
                                        "{review.reviewText}"
                                    </p>

                                    {review.sustainabilityTags?.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-6">
                                            {review.sustainabilityTags.slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 bg-emerald-50/80 border border-emerald-100/50 text-emerald-700 rounded-full"
                                                >
                                                    <Leaf className="w-2.5 h-2.5" />
                                                    {tag.replace(/_/g, " ")}
                                                </span>
                                            ))}
                                            {review.sustainabilityTags.length > 2 && (
                                                <span className="flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 bg-slate-100/80 border border-slate-200/50 text-slate-500 rounded-full">
                                                    +{review.sustainabilityTags.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    
                                    <div className="mt-auto border-t border-slate-100 pt-6">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-100 relative shrink-0">
                                                    <img 
                                                        src={review.user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user?.firstName || 'A')}+${encodeURIComponent(review.user?.lastName || 'U')}&background=0D8ABC&color=fff&bold=true`} 
                                                        alt={`${review.user?.firstName} ${review.user?.lastName}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                                                    <ShieldCheck size={18} className="text-white fill-emerald-500" />
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-slate-900 text-lg leading-tight truncate">
                                                    {review.user ? `${review.user.firstName} ${review.user.lastName}` : "Anonymous User"}
                                                </h4>
                                                <div className="flex justify-start items-center flex-wrap gap-x-2 gap-y-1 mt-1">
                                                    <span className="text-sm font-semibold text-emerald-600">
                                                        {review.user?.role === "Customer" ? "Verified Purchaser" : (review.user?.role || "Verified")}
                                                    </span>
                                                    {review.product?.name && (
                                                        <>
                                                            <span className="text-slate-300 text-[10px]">•</span>
                                                            <span className="text-sm text-slate-500 truncate max-w-[140px]">
                                                                {review.product.name}
                                                            </span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center text-slate-500 py-12 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                                <MessageCircle className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                                <h3 className="text-lg font-medium text-slate-900">No reviews yet</h3>
                                <p className="mt-1 text-slate-500">Be the first to share your mindful shopping experience!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Review Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title="Review Details"
            >
                {selectedReview && (
                    <div className="flex flex-col gap-6">
                        {/* Modal Header: User Info */}
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-slate-100 relative shrink-0">
                                    <img 
                                        src={selectedReview.user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedReview.user?.firstName || 'A')}+${encodeURIComponent(selectedReview.user?.lastName || 'U')}&background=0D8ABC&color=fff&bold=true`} 
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
                                <div className="flex justify-start items-center flex-wrap gap-x-2 gap-y-1 mt-1">
                                    <span className="text-sm font-semibold text-emerald-600">
                                        {selectedReview.user?.role === "Customer" ? "Verified Purchaser" : (selectedReview.user?.role || "Verified")}
                                    </span>
                                    {selectedReview.product?._id && selectedReview.product?.name && (
                                        <>
                                            <span className="text-slate-300 text-[10px]">•</span>
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCloseModal();
                                                    navigate(`/products/${selectedReview.product._id}`);
                                                }}
                                                className="text-sm font-medium text-slate-500 hover:text-emerald-600 hover:underline cursor-pointer transition-colors focus:outline-none text-left"
                                                title={`View ${selectedReview.product.name} details`}
                                            >
                                                {selectedReview.product.name}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Body: Rating & Text */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-1.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star 
                                            key={i} 
                                            size={22} 
                                            fill={i < selectedReview.overallRating ? "currentColor" : "none"} 
                                            className={i < selectedReview.overallRating ? "text-amber-400" : "text-slate-200"}
                                        />
                                    ))}
                                    <span className="ml-2 font-bold text-slate-700 text-lg">{selectedReview.overallRating}.0</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm font-semibold text-slate-400">
                                    <Clock className="w-4 h-4" />
                                    <span>{new Date(selectedReview.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                </div>
                            </div>

                            <div className="relative">
                                <Quote className="absolute -top-2 -left-2 w-10 h-10 text-slate-100 -z-10" />
                                <p className="text-slate-700 leading-relaxed text-[15px] p-2">
                                    {selectedReview.reviewText}
                                </p>
                            </div>
                        </div>

                        {/* Modal Footer: Sustainability Tags */}
                        {selectedReview.sustainabilityTags?.length > 0 && (
                            <div className="pt-4 border-t border-gray-100">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Sustainability Highlights</h5>
                                <div className="flex flex-wrap gap-2">
                                    {selectedReview.sustainabilityTags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="flex items-center gap-1 text-xs font-extrabold px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full shadow-sm"
                                        >
                                            <Leaf className="w-3.5 h-3.5" />
                                            {tag.replace(/_/g, " ")}
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
