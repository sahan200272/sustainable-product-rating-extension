import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function CtaSection() {
    const { isAuthenticated, user } = useAuth();

    return (
        <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
            {/* Background design elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-[120px] opacity-20 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] opacity-20 -translate-x-1/3 translate-y-1/3" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                {!isAuthenticated ? (
                    <>
                        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">
                            Every purchase is a vote for <br className="hidden md:block"/>
                            <span className="text-emerald-400">the future.</span>
                        </h2>
                        <p className="text-xl text-slate-300 font-medium mb-12 max-w-2xl mx-auto">
                            Join 50,000+ conscious shoppers making a quantifiable difference every single day.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-white font-bold text-lg rounded-2xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
                            >
                                Start Exploring Now
                            </Link>
                            <Link
                                to="/login"
                                className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white font-bold text-lg rounded-2xl border border-slate-700 hover:bg-slate-700 transition-colors"
                            >
                                Login with Google
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">
                            Ready to make an <br className="hidden md:block"/>
                            <span className="text-emerald-400">Impact today, {user?.name?.split(' ')[0] || "Eco-Warrior"}?</span>
                        </h2>
                        <p className="text-xl text-slate-300 font-medium mb-12 max-w-2xl mx-auto">
                            Continue your journey by discovering top-rated sustainable alternatives and making informed decisions.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                to="/products"
                                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-white font-bold text-lg rounded-2xl hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30"
                            >
                                Browse Products
                            </Link>
                            <Link
                                to="/compare"
                                className="w-full sm:w-auto px-8 py-4 bg-slate-800 text-white font-bold text-lg rounded-2xl border border-slate-700 hover:bg-slate-700 transition-colors"
                            >
                                Compare Items
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}
