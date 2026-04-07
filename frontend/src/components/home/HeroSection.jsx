import React from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight, ShieldCheck } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative pt-20 pb-32 overflow-hidden bg-white">
            {/* Background decorative blob */}
            <div className="absolute top-0 left-1/2 w-full -translate-x-1/2 h-[600px] bg-linear-to-b from-emerald-50 to-white -z-10 blur-3xl opacity-60 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold mb-8">
                    <ShieldCheck size={16} />
                    <span>Empowering Sustainable Choices</span>
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
                    Make Smarter, <br className="hidden md:block" />
                    <span className="text-emerald-500">Greener Buying Decisions</span>
                </h1>

                <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    AI-powered sustainability insights, transparent comparisons, and 
                    authentic community reviews to help you shop with purpose.
                </p>

                {/* Conceptual Search Bar - Can be fully functional later */}
                <div className="mt-10 max-w-2xl mx-auto">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search products or brands..."
                            className="block w-full pl-12 pr-4 py-4 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent shadow-sm hover:shadow-md transition-all text-lg"
                        />
                        <div className="absolute inset-y-0 right-2 flex items-center">
                            <button className="px-6 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors">
                                Search
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        to="/compare"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all font-semibold text-lg hover:-translate-y-0.5 shadow-lg shadow-emerald-500/30"
                    >
                        Compare Products
                    </Link>
                    <Link
                        to="/products"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-semibold text-lg hover:-translate-y-0.5"
                    >
                        Browse all
                        <ArrowRight size={20} />
                    </Link>
                </div>

                <div className="mt-12 flex items-center justify-center gap-8 text-sm font-medium text-slate-500">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        10k+ Products
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        50k+ Reviews
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        SDG 12 Aligned
                    </div>
                </div>
            </div>
        </section>
    );
}
