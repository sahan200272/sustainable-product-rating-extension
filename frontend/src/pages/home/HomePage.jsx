import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Import modular sections
import HeroSection from "../../components/home/HeroSection";
import FeatureSection from "../../components/home/FeatureSection";
import ComparisonSection from "../../components/home/ComparisonSection";
import TopProductsSection from "../../components/home/TopProductsSection";
import ReviewsSection from "../../components/home/ReviewsSection";
import BlogSection from "../../components/home/BlogSection";
import CtaSection from "../../components/home/CtaSection";

/**
 * HomePage
 *
 * The landing page for the Greenvy platform. The global Navbar and Footer
 * are provided by MainLayout (see routes/index.jsx). This component owns
 * only the page-specific sections.
 */
export default function HomePage() {
    const location = useLocation();

    // Reset scroll position and ensure animations re-trigger properly on route change
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <div 
            key={location.key} 
            className="min-h-screen bg-white font-sans selection:bg-emerald-200 selection:text-emerald-900"
        >
            <main>
                <HeroSection />
                <FeatureSection />
                <ComparisonSection />
                <TopProductsSection />
                <ReviewsSection />
                <BlogSection />
                <CtaSection />
            </main>
        </div>
    );
}
