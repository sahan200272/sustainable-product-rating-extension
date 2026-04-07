import Footer from "./Footer";

/**
 * MainLayout
 *
 * Shell layout for all public / authenticated pages that should
 * display the site-wide footer.  Auth pages (Login, Register, OTP)
 * use AuthLayout instead and do NOT use MainLayout.
 *
 * Usage:
 *   <MainLayout>
 *     <YourPage />
 *   </MainLayout>
 */
export default function MainLayout({ children }) {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
