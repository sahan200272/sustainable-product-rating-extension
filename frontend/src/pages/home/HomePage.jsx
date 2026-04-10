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
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200">
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
