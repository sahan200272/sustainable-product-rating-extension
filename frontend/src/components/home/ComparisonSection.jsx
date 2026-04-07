import React from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

export default function ComparisonSection() {
    return (
        <section className="py-24 bg-white overflow-hidden relative">
            {/* Background embellishment */}
            <div className="absolute top-1/2 right-0 w-[800px] h-[800px] bg-slate-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                        Battle of Products
                    </h2>
                    <p className="text-lg text-slate-600">
                        See how common choices stack up against sustainable leaders.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 max-w-5xl mx-auto">
                    {/* Eco Product */}
                    <div className="flex-1 w-full bg-white rounded-3xl p-8 shadow-xl border border-emerald-100 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                            Sustainable Pick
                        </div>
                        <div className="aspect-square rounded-2xl bg-slate-50 mb-6 flex items-center justify-center border border-slate-100 overflow-hidden">
                            {/* Placeholder for Product Image */}
                            <div className="text-slate-300 flex flex-col items-center">
                                <span className="text-4xl">🧴</span>
                                <span className="text-sm mt-2 font-medium">Eco-Max</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Eco-Max Liquid</h3>
                            <p className="text-sm text-emerald-600 font-semibold mb-6">Zero Waste Refill</p>
                            
                            <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full border-4 border-emerald-500 bg-emerald-50 mb-6">
                                <span className="text-2xl font-bold text-emerald-600">94</span>
                            </div>

                            <ul className="space-y-3 text-sm text-slate-600 text-left">
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                    <span>Plant-based biodegradable ingredients</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                    <span>Carbon neutral shipping</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                    <span>Infinitely recyclable packaging</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* VS Badge */}
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-900 text-white font-bold text-xl shadow-lg z-10 shrink-0 lg:-my-8">
                        VS
                    </div>

                    {/* Standard Product */}
                    <div className="flex-1 w-full bg-white rounded-3xl p-8 shadow-md border border-slate-200 opacity-90 grayscale-[20%]">
                        <div className="aspect-square rounded-2xl bg-slate-50 mb-6 flex items-center justify-center border border-slate-100 overflow-hidden">
                            {/* Placeholder for Product Image */}
                            <div className="text-slate-300 flex flex-col items-center">
                                <span className="text-4xl">🧴</span>
                                <span className="text-sm mt-2 font-medium">Standard</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Market Standard X</h3>
                            <p className="text-sm text-slate-500 font-semibold mb-6">Standard Performance</p>
                            
                            <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full border-4 border-red-400 bg-red-50 mb-6">
                                <span className="text-2xl font-bold text-red-500">42</span>
                            </div>

                            <ul className="space-y-3 text-sm text-slate-600 text-left opacity-80">
                                <li className="flex items-start gap-2">
                                    <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <span>Contains synthetic microplastics</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <span>High supply chain emissions</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                                    <span>Single-use plastic container</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <Link
                        to="/compare"
                        className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                    >
                        Analyze More Products Side-by-Side
                    </Link>
                </div>
            </div>
        </section>
    );
}
