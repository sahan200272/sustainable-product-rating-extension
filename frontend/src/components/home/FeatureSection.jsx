import React from "react";
import { Leaf, BarChart2, ShieldCheck } from "lucide-react";

export default function FeatureSection() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Engineered for Impact
                    </h2>
                    <p className="text-lg text-slate-600">
                        We provide the data and insights necessary to align your purchasing 
                        habits with true sustainability goals.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-500">
                            <Leaf size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                            AI Sustainability Score
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            High-precision assessment scoring across key data points: 
                            resource supply chains, carbon footprint, and ethical labor practices.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-500">
                            <BarChart2 size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                            Comparison Engine
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            Detailed side-by-side analysis of material specs and ecological 
                            impact with automated alternative suggestions.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-500">
                            <ShieldCheck size={28} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">
                            Verified Intelligence
                        </h3>
                        <p className="text-slate-600 leading-relaxed">
                            Community feedback built on personal moderation ensures 
                            transparency and filters out greenwashing.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
