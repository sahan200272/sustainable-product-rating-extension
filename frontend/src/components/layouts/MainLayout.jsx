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
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
