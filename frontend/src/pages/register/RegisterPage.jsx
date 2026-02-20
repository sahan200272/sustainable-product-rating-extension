import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/userService";

export default function RegisterPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await registerUser({
                email,
                firstName,
                lastName,
                password,
                address,
                phone
            });
            
            toast.success("Registration successful!");
            navigate("/login");
        } catch (error) {
            toast.error(error?.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="w-full h-screen flex justify-center items-center bg-cover bg-center relative"
            style={{ backgroundImage: "url('/Login_bg_Image.jpg')" }}
        >
            {/* Dark Overlay for better contrast */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>

            <div className="w-full max-w-[700px] mx-4 z-10 backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center">
                <img
                    src="/KV_Audio_Logo.png"
                    alt="Logo"
                    className="w-[100px] h-auto object-contain mb-6 drop-shadow-lg"
                />

                <h2 className="text-3xl font-bold text-white mb-6 tracking-wide">Create Account</h2>

                <form onSubmit={handleOnSubmit} className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="relative group">
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className="peer w-full px-4 py-3 border border-white/30 rounded-lg outline-none bg-white/10 text-white placeholder-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                            placeholder="First Name"
                        />
                        <label
                            htmlFor="firstName"
                            className="absolute left-4 -top-2.5 bg-transparent text-sm text-gray-200 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-300"
                        >
                            First Name
                        </label>
                    </div>

                    <div className="relative group">
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className="peer w-full px-4 py-3 border border-white/30 rounded-lg outline-none bg-white/10 text-white placeholder-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                            placeholder="Last Name"
                        />
                        <label
                            htmlFor="lastName"
                            className="absolute left-4 -top-2.5 bg-transparent text-sm text-gray-200 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-300"
                        >
                            Last Name
                        </label>
                    </div>

                    <div className="relative group">
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="peer w-full px-4 py-3 border border-white/30 rounded-lg outline-none bg-white/10 text-white placeholder-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                            placeholder="Email"
                        />
                        <label
                            htmlFor="email"
                            className="absolute left-4 -top-2.5 bg-transparent text-sm text-gray-200 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-300"
                        >
                            Email
                        </label>
                    </div>

                    <div className="relative group">
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="peer w-full px-4 py-3 border border-white/30 rounded-lg outline-none bg-white/10 text-white placeholder-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                            placeholder="Phone"
                        />
                        <label
                            htmlFor="phone"
                            className="absolute left-4 -top-2.5 bg-transparent text-sm text-gray-200 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-300"
                        >
                            Phone
                        </label>
                    </div>

                    <div className="col-span-1 md:col-span-2 relative group">
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                            className="peer w-full px-4 py-3 border border-white/30 rounded-lg outline-none bg-white/10 text-white placeholder-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                            placeholder="Address"
                        />
                        <label
                            htmlFor="address"
                            className="absolute left-4 -top-2.5 bg-transparent text-sm text-gray-200 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-300"
                        >
                            Address
                        </label>
                    </div>

                    <div className="col-span-1 md:col-span-2 relative group">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="new-password"
                            required
                            minLength="6"
                            className="peer w-full px-4 py-3 border border-white/30 rounded-lg outline-none bg-white/10 text-white placeholder-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                            placeholder="Password"
                        />
                        <label
                            htmlFor="password"
                            className="absolute left-4 -top-2.5 bg-transparent text-sm text-gray-200 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-300"
                        >
                            Password
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="col-span-1 md:col-span-2 w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transform transition hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/30 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p className="mt-8 text-sm text-gray-300">
                    Already have an account?{" "}
                    <a href="/login" className="text-white font-semibold hover:text-blue-300 underline-offset-2 hover:underline transition-all">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}
