import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../../services/userService";
import { useForm } from "../../hooks/useForm";
import FormField from "../../components/common/FormField";
import appLogo from "../../assets/icons/app_logo.png";
import bgImage from "../../assets/images/backGround_image.png";

const INITIAL_VALUES = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    password: "",
};

const STATS = [
    { value: "10K+", label: "Products rated" },
    { value: "98%", label: "Eco accuracy" },
    { value: "4.8★", label: "Avg rating" },
];

const TRUST_ICONS = ["🌿", "🌍", "♻️"];

export default function RegisterPage() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { values, handleChange, resetForm } = useForm(INITIAL_VALUES);

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await registerUser(values);
            toast.success("Account created successfully!");
            resetForm();
            navigate("/login");
        } catch (error) {
            toast.error(error?.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
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

                {/* Brand */}
                <div className="relative z-10 px-10 py-8 flex items-center gap-3">
                    <img src={appLogo} alt="Greenvy Logo" className="w-11 h-11 lg:w-14 lg:h-14 object-contain drop-shadow-lg" />
                    <span className="text-white font-extrabold text-2xl lg:text-3xl tracking-tight drop-shadow-md">Greenvy</span>
                </div>

                {/* Headline + stats */}
                <div className="relative z-10 px-10 flex-1 flex flex-col justify-center gap-6 lg:gap-8">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-200 text-xs lg:text-sm font-semibold tracking-wide">
                            Responsible Consumption &amp; Production
                        </span>
                    </div>
                    <div>
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight">
                            Shop smarter.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">
                                Live greener.
                            </span>
                        </h1>
                        <p className="mt-4 lg:mt-5 text-sm lg:text-base text-emerald-100/80 leading-relaxed max-w-sm lg:max-w-md">
                            Discover sustainability scores for everyday products and make choices that matter — for you and the planet.
                        </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 lg:gap-4 max-w-sm lg:max-w-md">
                        {STATS.map(({ value, label }) => (
                            <div key={label} className="bg-white/10 border border-white/15 backdrop-blur-sm rounded-2xl px-3 py-4 lg:py-5 text-center">
                                <p className="text-xl lg:text-2xl font-black text-emerald-300">{value}</p>
                                <p className="text-[10px] lg:text-xs text-emerald-100/70 mt-1 leading-tight">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust row */}
                <div className="relative z-10 px-10 py-8 flex items-center gap-4">
                    <div className="flex -space-x-2">
                        {TRUST_ICONS.map((emoji, i) => (
                            <div key={i} className="w-9 h-9 rounded-full bg-emerald-700 border-2 border-emerald-400/30 flex items-center justify-center text-base">
                                {emoji}
                            </div>
                        ))}
                    </div>
                    <p className="text-emerald-200/70 text-xs lg:text-sm">Trusted by eco-conscious consumers worldwide</p>
                </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex-1 flex flex-col justify-center items-center bg-gradient-to-b from-emerald-50 to-white px-6 lg:px-12 overflow-hidden">
                <div className="w-full max-w-md lg:max-w-lg">

                    {/* Mobile brand */}
                    <div className="flex lg:hidden items-center gap-2 mb-5">
                        <img src={appLogo} alt="Greenvy Logo" className="w-8 h-8 object-contain" />
                        <span className="font-extrabold text-emerald-800 text-lg tracking-tight">Greenvy</span>
                    </div>

                    <div className="mb-5 lg:mb-7">
                        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-[11px] lg:text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-widest">
                            <span>🌱</span> Create your free account
                        </div>
                        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-black text-gray-900 leading-tight tracking-tight">
                            Join the green <span className="text-emerald-600">revolution</span>
                        </h2>
                        <p className="text-sm lg:text-base text-gray-500 mt-1.5">
                            Already have an account?{" "}
                            <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-800 transition-colors">
                                Sign in →
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleOnSubmit} className="flex flex-col gap-3 lg:gap-4">
                        <div className="grid grid-cols-2 gap-3 lg:gap-4">
                            <FormField id="firstName" name="firstName" label="First Name"
                                value={values.firstName} onChange={handleChange} required />
                            <FormField id="lastName" name="lastName" label="Last Name"
                                value={values.lastName} onChange={handleChange} required />
                        </div>

                        <FormField id="email" name="email" type="email" label="Email Address"
                            value={values.email} onChange={handleChange} required />

                        <FormField id="phone" name="phone" type="tel" label="Phone"
                            value={values.phone} onChange={handleChange} required />

                        <FormField id="address" name="address" label="Address"
                            value={values.address} onChange={handleChange} required />

                        <FormField id="password" name="password" type="password" label="Password"
                            value={values.password} onChange={handleChange} required minLength={6}
                            autoComplete="new-password" />

                        <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3 lg:p-4">
                            <span className="text-lg mt-0.5">🌍</span>
                            <p className="text-xs lg:text-sm text-emerald-700 leading-relaxed">
                                I pledge to make more <strong>sustainable consumption choices</strong> and help protect our planet.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 lg:py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm lg:text-base tracking-wide shadow-lg shadow-emerald-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-4 w-4 lg:h-5 lg:w-5" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Creating your account…
                                </span>
                            ) : "Create Account →"}
                        </button>

                        <p className="text-center text-xs lg:text-sm text-gray-400">
                            🔒 Your data is safe. We never sell your information.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
