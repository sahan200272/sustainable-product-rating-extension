import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getUser } from "../../services/userService";
import toast from "react-hot-toast";
import {
    RiLeafLine,
    RiUserLine,
    RiLogoutBoxLine,
    RiDashboardLine,
    RiEditLine,
    RiNotification3Line,
    RiMenuLine,
    RiCloseLine,
    RiCheckboxCircleLine,
    RiCloseCircleLine,
    RiArrowDownSLine,
    RiStarLine,
    RiShieldUserLine,
} from "react-icons/ri";
import { getMyBlogs } from "../../services/blogService";
import MobileNavbar from "./MobileNavbar";

// ─── Default avatar fallback ──────────────────────────────────────────────────
const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/thumbnails/036/280/650/small_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";

// ─── Nav links configuration ──────────────────────────────────────────────────
const NAV_LINKS = [
    { label: "Products", to: "/products" },
    { label: "Compare", to: "/compare" },
    { label: "Insights", to: "/blogs" },
];

export default function Navbar() {
    const { user, token, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // ── Live user data fetched from API ──
    const [liveUser, setLiveUser] = useState(null);
    const [avatarError, setAvatarError] = useState(false);

    // ── Dropdown / panel state ──
    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [scrolled, setScrolled] = useState(false);

    const profileRef = useRef(null);
    const notifRef = useRef(null);

    // ── Scroll shadow ──────────────────────────────────────────────────────────
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 8);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // ── Fetch fresh user from API when authenticated ───────────────────────────
    useEffect(() => {
        if (!isAuthenticated || !token) {
            setLiveUser(null);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const data = await getUser();
                if (!cancelled) setLiveUser(data);
            } catch {
                // Fall back to stored user data — no toast needed
                if (!cancelled) setLiveUser(null);
            }
        })();
        return () => { cancelled = true; };
    }, [isAuthenticated, token]);

    // ── Fetch notifications from blogs ────────────────────────────────────────
    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const data = await getMyBlogs({ page: 1, limit: 30 });
                if (cancelled) return;
                const blogs = data?.blogs || [];
                const list = [];
                blogs
                    .filter((b) => b.status === "REJECTED")
                    .forEach((b) =>
                        list.push({
                            id: `rejection-${b._id}`,
                            type: "rejection",
                            title: b.title,
                            message: b.rejectionReason || "No reason provided",
                            timestamp: b.updatedAt,
                        })
                    );
                blogs
                    .filter((b) => b.status === "PUBLISHED")
                    .forEach((b) =>
                        list.push({
                            id: `approval-${b._id}`,
                            type: "approval",
                            title: b.title,
                            message: "Your blog has been approved and published!",
                            timestamp: b.approvedAt,
                        })
                    );
                setNotifications(list);
            } catch {
                // notifications are optional — fail silently
            }
        })();
        return () => { cancelled = true; };
    }, [isAuthenticated]);

    // ── Close dropdowns on outside click ─────────────────────────────────────
    useEffect(() => {
        const handler = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(e.target)) {
                setNotifOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // ── Close mobile menu on route change ────────────────────────────────────
    useEffect(() => {
        setMobileOpen(false);
        setProfileOpen(false);
        setNotifOpen(false);
    }, [location.pathname]);

    // ── Derived display data (live API > localStorage) ────────────────────────
    const displayUser = liveUser || user;
    const firstName = displayUser?.firstName || displayUser?.name?.split(" ")[0] || "User";
    const lastName = displayUser?.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim();
    const email = displayUser?.email || "";
    const profilePicture = avatarError ? DEFAULT_AVATAR : (displayUser?.profilePicture || DEFAULT_AVATAR);
    const isAdmin = displayUser?.role === "Admin";
    const unreadCount = notifications.length;

    const handleLogout = useCallback(() => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
    }, [logout, navigate]);

    const dismissNotif = useCallback(
        (id) => setNotifications((prev) => prev.filter((n) => n.id !== id)),
        []
    );

    const isActive = (path) =>
        location.pathname === path || location.pathname.startsWith(`${path}/`);

    return (
        <>
            {/* ─────────────────────────────── NAVBAR ─────────────────────────── */}
            <nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    scrolled
                        ? "bg-white/90 backdrop-blur-xl shadow-[0_2px_24px_rgba(0,0,0,0.08)] border-b border-slate-100/80"
                        : "bg-white/75 backdrop-blur-lg border-b border-slate-100/50"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-[68px]">

                        {/* ── Brand ─────────────────────────────────────────── */}
                        <Link
                            to="/"
                            id="nav-brand"
                            className="flex items-center gap-2 group flex-shrink-0"
                        >
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-emerald-200 transition-shadow">
                                <RiLeafLine className="text-white text-lg" />
                            </div>
                            <span className="text-xl font-black text-slate-900 tracking-tight group-hover:text-emerald-600 transition-colors">
                                Greenvy
                            </span>
                        </Link>

                        {/* ── Desktop Nav Links ──────────────────────────────── */}
                        <div className="hidden md:flex items-center gap-1">
                            {NAV_LINKS.map(({ label, to }) => (
                                <Link
                                    key={to}
                                    to={to}
                                    id={`nav-link-${label.toLowerCase()}`}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                        isActive(to)
                                            ? "bg-emerald-50 text-emerald-600"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                    }`}
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>

                        {/* ── Right Actions ──────────────────────────────────── */}
                        <div className="flex items-center gap-2">
                            {isAuthenticated ? (
                                <>
                                    {/* Create Blog Button */}
                                    <Link
                                        to="/blogs/create"
                                        id="nav-create-blog"
                                        className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-200 hover:shadow-md hover:shadow-emerald-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                                    >
                                        <RiEditLine className="text-base" />
                                        Create Blog
                                    </Link>

                                    {/* Admin Dashboard Badge */}
                                    {isAdmin && (
                                        <Link
                                            to="/admin/dashboard"
                                            id="nav-admin-dashboard"
                                            className="hidden lg:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
                                        >
                                            <RiShieldUserLine className="text-base" />
                                            Dashboard
                                        </Link>
                                    )}

                                    {/* Notification Bell */}
                                    <div className="relative" ref={notifRef}>
                                        <button
                                            id="nav-notifications"
                                            onClick={() => {
                                                setNotifOpen((v) => !v);
                                                setProfileOpen(false);
                                            }}
                                            className="relative p-2.5 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
                                            aria-label="Notifications"
                                        >
                                            <RiNotification3Line className="text-xl" />
                                            {unreadCount > 0 && (
                                                <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
                                                    {unreadCount > 9 ? "9+" : unreadCount}
                                                </span>
                                            )}
                                        </button>

                                        {/* Notification Panel */}
                                        {notifOpen && (
                                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-slate-100 z-50 overflow-hidden animate-[fadeIn_0.15s_ease]">
                                                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                                                    <h3 className="text-sm font-bold text-slate-900">
                                                        Notifications
                                                        {unreadCount > 0 && (
                                                            <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                                                                {unreadCount}
                                                            </span>
                                                        )}
                                                    </h3>
                                                </div>
                                                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                                                    {notifications.length === 0 ? (
                                                        <div className="py-10 flex flex-col items-center gap-2 text-slate-400 text-sm">
                                                            <RiCheckboxCircleLine className="text-3xl text-emerald-300" />
                                                            <span>You're all caught up!</span>
                                                        </div>
                                                    ) : (
                                                        notifications.map((notif) => (
                                                            <div
                                                                key={notif.id}
                                                                className={`flex items-start gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors ${
                                                                    notif.type === "rejection"
                                                                        ? "border-l-[3px] border-l-red-400"
                                                                        : "border-l-[3px] border-l-emerald-400"
                                                                }`}
                                                            >
                                                                <div className="mt-0.5 flex-shrink-0">
                                                                    {notif.type === "rejection" ? (
                                                                        <RiCloseCircleLine className="text-red-400 text-base" />
                                                                    ) : (
                                                                        <RiCheckboxCircleLine className="text-emerald-500 text-base" />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-semibold text-slate-800 truncate">
                                                                        {notif.title}
                                                                    </p>
                                                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">
                                                                        {notif.message}
                                                                    </p>
                                                                </div>
                                                                <button
                                                                    onClick={() => dismissNotif(notif.id)}
                                                                    className="flex-shrink-0 p-1 text-slate-300 hover:text-slate-500 rounded-lg transition-colors"
                                                                    aria-label="Dismiss"
                                                                >
                                                                    <RiCloseLine className="text-sm" />
                                                                </button>
                                                            </div>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Profile Dropdown */}
                                    <div className="relative" ref={profileRef}>
                                        <button
                                            id="nav-profile-trigger"
                                            onClick={() => {
                                                setProfileOpen((v) => !v);
                                                setNotifOpen(false);
                                            }}
                                            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
                                            aria-label="User menu"
                                            aria-expanded={profileOpen}
                                        >
                                            {/* Avatar */}
                                            <div className="relative">
                                                <img
                                                    src={profilePicture}
                                                    alt={fullName}
                                                    onError={() => setAvatarError(true)}
                                                    loading="lazy"
                                                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm ring-2 ring-transparent group-hover:ring-emerald-300 transition-all duration-200"
                                                />
                                                {/* Online indicator */}
                                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                                            </div>
                                            <div className="hidden lg:block text-left">
                                                <p className="text-sm font-semibold text-slate-800 leading-none">
                                                    {firstName}
                                                </p>
                                                {isAdmin && (
                                                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide mt-0.5">
                                                        Admin
                                                    </p>
                                                )}
                                            </div>
                                            <RiArrowDownSLine
                                                className={`hidden lg:block text-slate-400 text-base transition-transform duration-200 ${
                                                    profileOpen ? "rotate-180" : ""
                                                }`}
                                            />
                                        </button>

                                        {/* Profile Dropdown Menu */}
                                        {profileOpen && (
                                            <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.14)] border border-slate-100 z-50 overflow-hidden animate-[fadeIn_0.15s_ease]">
                                                {/* User Info Header */}
                                                <div className="px-4 py-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-b border-slate-100">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={profilePicture}
                                                            alt={fullName}
                                                            onError={() => setAvatarError(true)}
                                                            loading="lazy"
                                                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-bold text-slate-900 truncate">
                                                                {fullName}
                                                            </p>
                                                            <p className="text-xs text-slate-500 truncate">
                                                                {email}
                                                            </p>
                                                            {isAdmin && (
                                                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wide">
                                                                    <RiShieldUserLine className="text-xs" />
                                                                    Admin
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="py-1.5">
                                                    <DropdownLink
                                                        to="/profile"
                                                        icon={<RiUserLine />}
                                                        label="View Profile"
                                                        id="nav-profile-view"
                                                    />
                                                    <DropdownLink
                                                        to="/my-reviews"
                                                        icon={<RiStarLine />}
                                                        label="My Reviews"
                                                        id="nav-my-reviews"
                                                    />
                                                    {isAdmin && (
                                                        <DropdownLink
                                                            to="/admin/dashboard"
                                                            icon={<RiDashboardLine />}
                                                            label="Admin Dashboard"
                                                            id="nav-admin-dash"
                                                        />
                                                    )}
                                                </div>

                                                {/* Logout */}
                                                <div className="border-t border-slate-100 py-1.5">
                                                    <button
                                                        id="nav-logout"
                                                        onClick={handleLogout}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                    >
                                                        <RiLogoutBoxLine className="text-base" />
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        id="nav-login"
                                        className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-50 transition-all"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        to="/register"
                                        id="nav-signup"
                                        className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                                    >
                                        Sign up free
                                    </Link>
                                </>
                            )}

                            {/* Mobile Hamburger */}
                            <button
                                id="nav-mobile-toggle"
                                className="md:hidden p-2.5 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
                                onClick={() => setMobileOpen(true)}
                                aria-label="Open menu"
                            >
                                <RiMenuLine className="text-xl" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <MobileNavbar
                isOpen={mobileOpen}
                setIsOpen={setMobileOpen}
                navLinks={NAV_LINKS}
                isAuthenticated={isAuthenticated}
                fullName={fullName}
                email={email}
                profilePicture={profilePicture}
                isAdmin={isAdmin}
                handleLogout={handleLogout}
                onAvatarError={() => setAvatarError(true)}
            />
        </>
    );
}

// ─── Internal helper: dropdown link item ──────────────────────────────────────
function DropdownLink({ to, icon, label, id }) {
    return (
        <Link
            to={to}
            id={id}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition-colors"
        >
            <span className="text-base text-slate-400 group-hover:text-emerald-500">{icon}</span>
            {label}
        </Link>
    );
}

