import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * MainLayout
 *
 * Shell layout for all public / authenticated pages. Renders the global
 * Navbar at the top and the Footer at the bottom. Auth pages (Login,
 * Register, OTP) use AuthLayout instead and do NOT use MainLayout.
 *
 * Usage:
 *   <MainLayout>
 *     <YourPage />
 *   </MainLayout>
 */
export default function MainLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            {/* pt-[68px] offsets the fixed navbar height so content isn't hidden behind it */}
            <main className="flex-1 pt-[68px]">{children}</main>
            <Footer />
        </div>
    );
}
