import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import {
    RiCloseLine,
    RiLeafLine,
    RiUserLine,
    RiStarLine,
    RiDashboardLine,
    RiLogoutBoxLine,
    RiEditLine,
} from "react-icons/ri";

export default function MobileNavbar({
    isOpen,
    setIsOpen,
    navLinks,
    isAuthenticated,
    fullName,
    email,
    profilePicture,
    isAdmin,
    handleLogout,
    onAvatarError,
}) {
    const location = useLocation();

    // Prevent body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const isActive = (path) =>
        location.pathname === path || location.pathname.startsWith(`${path}/`);

    return (
        <div className="md:hidden">
            {/* Backdrop Overlay */}
            <div
                className={`fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
                    isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsOpen(false)}
                aria-hidden="true"
            />

            {/* Sidebar Drawer */}
            <div
                className={`fixed top-0 left-0 bottom-0 z-[110] w-[80%] max-w-[340px] bg-white shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Header inside sidebar */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100/80">
                    <Link
                        to="/"
                        className="flex items-center gap-3 group active:scale-95 transition-transform duration-200"
                        onClick={() => setIsOpen(false)}
                        aria-label="Home"
                    >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md">
                            <RiLeafLine className="text-white text-lg" />
                        </div>
                        <span className="text-xl font-black text-slate-900 tracking-tight">
                            Greenvy
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-3 -mr-3 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors active:scale-95"
                        aria-label="Close menu"
                    >
                        <RiCloseLine className="w-6 h-6" />
                    </button>
                </div>

                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto py-6 flex flex-col">
                    
                    <div className="px-5 mb-2">
                        <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                            Menu
                        </span>
                    </div>
                    
                    <div className="flex flex-col gap-1 px-3">
                        {navLinks.map(({ label, to }) => {
                            const isLinkActive = isActive(to);
                            return (
                                <Link
                                    key={to}
                                    to={to}
                                    onClick={() => setIsOpen(false)}
                                    aria-label={label}
                                    className={`group flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200 active:scale-[0.98] ${
                                        isLinkActive
                                            ? "bg-emerald-50/80 text-emerald-700 border-l-[3px] border-emerald-500 shadow-sm shadow-emerald-100/50"
                                            : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900 border-l-[3px] border-transparent"
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    <hr className="border-slate-100 mx-5 my-6" />

                    {isAuthenticated ? (
                        <div className="flex flex-col flex-1">
                            <div className="px-5 mb-3">
                                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Account
                                </span>
                            </div>

                            <div className="px-5 mb-4">
                                {/* Mobile User Info Card */}
                                <div className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md">
                                    <img
                                        src={profilePicture}
                                        alt={fullName}
                                        onError={onAvatarError}
                                        loading="lazy"
                                        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-slate-900 truncate">{fullName}</p>
                                        <p className="text-[11px] font-medium text-slate-500 truncate">{email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 px-3">
                                <Link
                                    to="/blogs/create"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Create Blog"
                                    className="group flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-emerald-700 bg-emerald-50 border border-emerald-100/50 shadow-sm hover:shadow-md hover:bg-emerald-100 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                                >
                                    <RiEditLine className="w-5 h-5 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                                    <span>Create Blog</span>
                                </Link>
                                
                                <div className="h-2"></div>

                                <Link
                                    to="/profile"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="View Profile"
                                    className="group flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all duration-200"
                                >
                                    <RiUserLine className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                    <span>View Profile</span>
                                </Link>

                                <Link
                                    to="/my-reviews"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="My Reviews"
                                    className="group flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all duration-200"
                                >
                                    <RiStarLine className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                    <span>My Reviews</span>
                                </Link>

                                {isAdmin && (
                                    <Link
                                        to="/admin/dashboard"
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Admin Dashboard"
                                        className="group flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] transition-all duration-200"
                                    >
                                        <RiDashboardLine className="w-5 h-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                        <span>Admin Dashboard</span>
                                    </Link>
                                )}
                            </div>

                            <div className="mt-auto px-5 pb-6 pt-4">
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsOpen(false);
                                    }}
                                    aria-label="Logout"
                                    className="group w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium text-red-600 bg-red-50 hover:bg-red-100 active:scale-[0.98] transition-all duration-200"
                                >
                                    <RiLogoutBoxLine className="w-5 h-5" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 px-5 mt-2">
                            <Link
                                to="/login"
                                onClick={() => setIsOpen(false)}
                                aria-label="Log in"
                                className="block w-full px-4 py-3.5 text-center rounded-xl font-medium text-slate-700 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 active:scale-[0.98] transition-all duration-200"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setIsOpen(false)}
                                aria-label="Sign up free"
                                className="block w-full px-4 py-3.5 text-center rounded-xl font-bold bg-slate-900 text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200"
                            >
                                Sign up free
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
