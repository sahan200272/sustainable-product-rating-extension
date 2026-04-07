import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { sendOtp, verifyOtp } from "../../services/authService";
import { useAuth } from "../../hooks/useAuth";
import OtpInput from "../../components/common/OtpInput";
import { GREENVY_LOGO_URL, GREENVY_LOGO_ALT } from "../../config/env";
import bgImage from "../../assets/images/backGround_image.png";

export default function VerifyOtpPage() {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const { user, verifyEmail, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        } else if (user.emailVerified) {
            navigate(user.role === "Admin" ? "/admin/dashboard" : "/");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        
        if (otp.length < 6) {
            toast.error("Please enter the 6-digit OTP code.");
            return;
        }

        setLoading(true);
        try {
            await verifyOtp(otp);
            toast.success("Email verified successfully!");
            verifyEmail();
            navigate(user?.role === "Admin" ? "/admin/dashboard" : "/");
        } catch (error) {
            toast.error(error?.response?.data?.error || "Invalid OTP code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        if (timer > 0) return;
        setResendLoading(true);
        try {
            console.log("Sending OTP...");
            const response = await sendOtp();
            console.log(response);
            toast.success("A new OTP has been sent to your email.");
            setTimer(60);
        } catch (error) {
            console.error("OTP send error:", error);
            toast.error(error?.response?.data?.error || "Failed to resend OTP.");
        } finally {
            setResendLoading(false);
        }
    };

    const handleBackToLogin = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="h-screen flex overflow-hidden">
            {/* LEFT PANEL */}
            <div
                className="hidden lg:flex lg:w-[55%] relative flex-col justify-between overflow-hidden"
                style={{ backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/85 via-green-900/75 to-teal-800/65" />
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl" />

                <div className="relative z-10 px-10 py-8 flex items-center gap-3">
                    <img src={GREENVY_LOGO_URL} alt={GREENVY_LOGO_ALT} loading="lazy" className="w-11 h-11 lg:w-14 lg:h-14 object-contain drop-shadow-lg" />
                    <span className="text-white font-extrabold text-2xl lg:text-3xl tracking-tight drop-shadow-md">Greenvy</span>
                </div>

                <div className="relative z-10 px-10 flex-1 flex flex-col justify-center gap-6 lg:gap-8">
                    <div>
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight">
                            Verify your<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">Email Address.</span>
                        </h1>
                        <p className="mt-4 lg:mt-5 text-sm lg:text-base text-emerald-100/80 leading-relaxed max-w-sm lg:max-w-md">
                            We've sent a 6-digit verification code to your email address. Please enter it to continue.
                        </p>
                    </div>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-b from-emerald-50 to-white px-6 lg:px-12 overflow-hidden">
                <div className="w-full max-w-md lg:max-w-lg">

                    {/* Mobile brand */}
                    <div className="flex lg:hidden items-center gap-2 mb-8">
                        <img src={GREENVY_LOGO_URL} alt={GREENVY_LOGO_ALT} loading="lazy" className="w-8 h-8 object-contain" />
                        <span className="font-extrabold text-emerald-800 text-lg tracking-tight">Greenvy</span>
                    </div>

                    <div className="mb-7 lg:mb-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-[11px] lg:text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-widest mx-auto lg:mx-0">
                            <span>🛡️</span> Security Verification
                        </div>
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 leading-tight tracking-tight">
                            Enter OTP <span className="text-emerald-600">Code</span>
                        </h2>
                        <p className="text-sm lg:text-base text-gray-500 mt-1.5">
                            Sent to <span className="font-semibold text-gray-700">{user?.email}</span>
                        </p>
                    </div>

                    <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6 lg:gap-7 items-center lg:items-start w-full">
                        <OtpInput length={6} value={otp} onChange={setOtp} disabled={loading} />

                        <button
                            type="submit"
                            disabled={loading || otp.length < 6}
                            className="w-full py-3 lg:py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm lg:text-base tracking-wide shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 lg:h-5 lg:w-5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Verifying…
                                </span>
                            ) : "Verify Account →"}
                        </button>
                    </form>

                    <div className="mt-8 flex flex-col items-center gap-4">
                        <p className="text-sm text-gray-500 text-center">
                            Didn't receive the code?{" "}
                            {timer > 0 ? (
                                <span className="text-emerald-600 font-semibold">Resend in {timer}s</span>
                            ) : (
                                <button
                                    onClick={handleResendOtp}
                                    disabled={resendLoading}
                                    className="text-emerald-600 font-semibold hover:text-emerald-800 transition-colors disabled:opacity-50"
                                >
                                    {resendLoading ? "Sending..." : "Resend OTP"}
                                </button>
                            )}
                        </p>
                        
                        <button 
                            onClick={handleBackToLogin}
                            className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors"
                        >
                            ← Back to Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
