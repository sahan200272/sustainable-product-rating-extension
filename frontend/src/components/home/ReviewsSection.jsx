import React, { useState, useEffect } from "react";
import { Star, MessageCircle, ShieldCheck, Loader } from "lucide-react";
import api from "../../services/api";

export default function ReviewsSection() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <section className="py-24 bg-white border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Community Voice
                    </h2>
                    <p className="text-lg text-slate-600">
                        Real experiences from conscious shoppers, curated by AI moderation to prevent fake claims.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader className="animate-spin text-emerald-500 w-12 h-12" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review._id} className="bg-slate-50 rounded-3xl p-8 border border-slate-100 relative items-stretch flex flex-col">
                                    {/* Quote Icon watermark */}
                                    <MessageCircle className="absolute top-6 right-8 w-16 h-16 text-slate-200 opacity-50 pointer-events-none" />
                                    
                                    <div className="flex items-center gap-1 mb-4 text-emerald-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star 
                                                key={i} 
                                                size={18} 
                                                fill={i < review.overallRating ? "currentColor" : "none"} 
                                                className={i < review.overallRating ? "text-emerald-500" : "text-slate-300"}
                                            />
                                        ))}
                                    </div>
                                    
                                    <p className="text-slate-700 leading-relaxed mb-6 italic relative z-10 flex-grow line-clamp-4">
                                        "{review.reviewText}"
                                    </p>
                                    
                                    <div className="mt-auto">
                                        <h4 className="font-bold text-slate-900">
                                            {review.user ? `${review.user.firstName} ${review.user.lastName}` : "Anonymous User"}
                                        </h4>
                                        <div className="text-sm font-semibold text-emerald-600 flex items-center gap-1 mt-1">
                                            <ShieldCheck size={14} />
                                            {review.user?.role === "Customer" ? "Verified Purchaser" : (review.user?.role || "Verified")}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-2 truncate">
                                            Reviewing: {review.product?.name || "Sustainable Product"}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center text-slate-500 py-8">
                                No recent reviews available. Be the first to share your mindful shopping experience!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
