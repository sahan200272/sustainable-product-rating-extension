/**
 * AuthLayout
 *
 * Shared layout for authentication pages (Login, Register).
 * Renders the full-screen background image, dark overlay, and centred glass card.
 *
 * Props:
 *   children  {ReactNode} - Page-specific form content rendered inside the card.
 *   maxWidth  {string}    - Tailwind max-w-* class (e.g. "max-w-[500px]").
 */
export default function AuthLayout({ children, maxWidth = "max-w-[500px]" }) {
    return (
        <div
            className="w-full h-screen flex justify-center items-center bg-cover bg-center relative"
            style={{ backgroundImage: "url('/Login_bg_Image.jpg')" }}
        >
            {/* Dark overlay for better contrast */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

            <div
                className={`w-full ${maxWidth} mx-4 z-10 backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center`}
            >
                {children}
            </div>
        </div>
    );
}
