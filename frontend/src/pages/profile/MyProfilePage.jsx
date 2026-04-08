/**
 * MyProfilePage.jsx
 *
 * Authenticated user's profile page.
 *
 * Features:
 *   - Pulls live profile data from GET /api/users/me on mount
 *   - Inline edit form (firstName, lastName, phone, address)
 *   - Avatar display with initials fallback
 *   - Member stats: review count, blogs written, account status
 *   - Quick-link sidebar to key platform pages
 *   - Fully responsive, modern SaaS design using Tailwind CSS
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getUser, updateProfile } from "../../services/userService";
import { getMyReviews } from "../../services/reviewService";
import toast from "react-hot-toast";
import {
  RiUserLine,
  RiEditLine,
  RiSaveLine,
  RiCloseLine,
  RiShieldCheckLine,
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiStarLine,
  RiLeafLine,
  RiArrowRightLine,
  RiLoader4Line,
  RiShieldUserLine,
  RiBookOpenLine,
  RiCheckLine,
} from "react-icons/ri";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/036/280/650/small_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";

const AVATAR_COLOURS = [
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
];

const avatarGradient = (name = "") =>
  AVATAR_COLOURS[(name.charCodeAt(0) || 0) % AVATAR_COLOURS.length];

const initials = (first = "", last = "") =>
  `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase() || "?";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ icon, label, value, accent = "emerald" }) {
  const accentMap = {
    emerald: "from-emerald-50 to-teal-50 border-emerald-100 text-emerald-600",
    indigo:  "from-indigo-50 to-purple-50 border-indigo-100 text-indigo-600",
    amber:   "from-amber-50 to-orange-50 border-amber-100 text-amber-600",
    sky:     "from-sky-50 to-blue-50 border-sky-100 text-sky-600",
  };
  return (
    <div className={`bg-gradient-to-br ${accentMap[accent]} border rounded-2xl p-5 flex flex-col gap-2 shadow-sm hover:shadow-md transition-shadow duration-200`}>
      <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
        <span className="text-lg">{icon}</span>
      </div>
      <p className="text-2xl font-black text-slate-800">{value}</p>
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
        <span className="text-slate-400 text-base">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-0.5">
          {label}
        </p>
        <p className="text-sm font-semibold text-slate-800 break-all">{value || "—"}</p>
      </div>
    </div>
  );
}

function EditField({ id, label, icon, value, onChange, placeholder, type = "text", required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
        {label}
        {required && <span className="text-rose-400 text-xs">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400
            focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent focus:bg-white
            hover:border-slate-300 transition-all duration-200"
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MyProfilePage() {
  const { user: authUser, login } = useAuth();

  const [profile, setProfile]     = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading]     = useState(true);
  const [editing, setEditing]     = useState(false);
  const [saving, setSaving]       = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    phone:     "",
    address:   "",
  });

  // ── Fetch on mount ───────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [userData, reviewData] = await Promise.all([
          getUser(),
          getMyReviews(),
        ]);
        if (cancelled) return;
        setProfile(userData);
        setReviewCount(reviewData?.count ?? reviewData?.data?.length ?? 0);
        setForm({
          firstName: userData.firstName || "",
          lastName:  userData.lastName  || "",
          phone:     userData.phone     || "",
          address:   userData.address   || "",
        });
      } catch {
        if (!cancelled) toast.error("Failed to load profile.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Save handler ─────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First name and last name are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        phone:     form.phone.trim(),
        address:   form.address.trim(),
      };
      const res = await updateProfile(payload);
      setProfile(res.user);
      if (authUser) {
        login({ ...authUser, ...res.user }, localStorage.getItem("token"));
      }
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!profile) return;
    setForm({
      firstName: profile.firstName || "",
      lastName:  profile.lastName  || "",
      phone:     profile.phone     || "",
      address:   profile.address   || "",
    });
    setEditing(false);
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const displayName = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : "—";

  const avatarUrl =
    profile?.profilePicture && profile.profilePicture !== DEFAULT_AVATAR
      ? profile.profilePicture
      : null;

  const isAdmin    = profile?.role === "Admin";
  const isVerified = profile?.emailVerified;
  const gradient   = avatarGradient(profile?.firstName || "");

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center animate-pulse">
            <RiLeafLine className="text-emerald-500 text-2xl" />
          </div>
          <p className="text-slate-500 text-sm font-medium">Loading your profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">My Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your personal information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-1 flex flex-col gap-6">

            {/* Avatar card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col items-center text-center gap-4">
              <div className="relative">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                    className="w-24 h-24 rounded-2xl object-cover ring-4 ring-white shadow-lg"
                  />
                ) : (
                  <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center ring-4 ring-white shadow-lg`}>
                    <span className="text-white text-3xl font-black tracking-tight">
                      {initials(profile?.firstName, profile?.lastName)}
                    </span>
                  </div>
                )}
                <div className={`absolute -bottom-2 -right-2 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-sm ${isAdmin ? "bg-slate-900 text-white" : "bg-emerald-500 text-white"}`}>
                  {isAdmin ? "Admin" : "Member"}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black text-slate-900">{displayName}</h2>
                <p className="text-sm text-slate-500 mt-0.5">{profile?.email}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${
                  isVerified
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-amber-50 text-amber-700 border-amber-100"
                }`}>
                  <RiShieldCheckLine className="text-sm" />
                  {isVerified ? "Email Verified" : "Email Unverified"}
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    <RiShieldUserLine className="text-sm" />
                    Admin
                  </span>
                )}
              </div>
            </div>

            {/* Quick links */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 flex flex-col gap-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 mb-2">Quick Links</p>
              {[
                { to: "/my-reviews", icon: <RiStarLine />,      label: "My Reviews",       sub: `${reviewCount} submitted` },
                { to: "/blogs",      icon: <RiBookOpenLine />,   label: "My Blogs",         sub: "View your posts" },
                { to: "/products",   icon: <RiLeafLine />,       label: "Browse Products",  sub: "Find sustainable picks" },
                { to: "/compare",    icon: <RiArrowRightLine />, label: "Compare Products", sub: "Side-by-side analysis" },
              ].map(({ to, icon, label, sub }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-base group-hover:bg-emerald-100 transition-colors flex-shrink-0">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors">{label}</p>
                    <p className="text-xs text-slate-400">{sub}</p>
                  </div>
                  <RiArrowRightLine className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* ── Right column ────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <StatCard icon={<RiStarLine />}        label="Reviews Written" value={reviewCount}                               accent="emerald" />
              <StatCard icon={<RiBookOpenLine />}     label="Blogs Written"   value={profile?.blogsCount ?? "—"}                accent="sky" />
              <StatCard icon={<RiShieldCheckLine />}  label="Account Status"  value={profile?.isBlocked ? "Blocked" : "Active"} accent={profile?.isBlocked ? "amber" : "indigo"} />
            </div>

            {/* Personal info / edit card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col flex-1 overflow-hidden">

              {/* Card header */}
              <div className="flex items-center gap-3 px-7 py-5 border-b border-slate-100">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <RiUserLine className="text-emerald-600 text-base" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {editing ? "Edit Information" : "Personal Information"}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {editing ? "Update your details below and save." : "Your saved account details."}
                  </p>
                </div>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="ml-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors"
                  >
                    <RiEditLine className="text-sm" />
                    Edit
                  </button>
                )}
              </div>

              {/* ── View mode ───────────────────────────────────────────────── */}
              {!editing && (
                <div className="px-7 py-2">
                  <InfoRow icon={<RiUserLine />}  label="First Name" value={profile?.firstName} />
                  <InfoRow icon={<RiUserLine />}  label="Last Name"  value={profile?.lastName} />
                  <InfoRow icon={<RiMailLine />}  label="Email"      value={profile?.email} />
                  <InfoRow icon={<RiPhoneLine />} label="Phone"      value={profile?.phone} />
                  <InfoRow icon={<RiMapPinLine />} label="Address"   value={profile?.address} />
                </div>
              )}

              {/* ── Edit mode ───────────────────────────────────────────────── */}
              {editing && (
                <div className="px-7 py-6 flex flex-col gap-6">

                  {/* Name group */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Name</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <EditField
                        id="profile-first-name"
                        label="First Name"
                        icon={<RiUserLine />}
                        value={form.firstName}
                        onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
                        placeholder="First name"
                        required
                      />
                      <EditField
                        id="profile-last-name"
                        label="Last Name"
                        icon={<RiUserLine />}
                        value={form.lastName}
                        onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
                        placeholder="Last name"
                        required
                      />
                    </div>
                  </div>

                  {/* Contact group */}
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Contact</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <EditField
                        id="profile-phone"
                        label="Phone"
                        icon={<RiPhoneLine />}
                        value={form.phone}
                        onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                        placeholder="+94 77 000 0000"
                        type="tel"
                      />
                      <EditField
                        id="profile-address"
                        label="Address"
                        icon={<RiMapPinLine />}
                        value={form.address}
                        onChange={(v) => setForm((f) => ({ ...f, address: v }))}
                        placeholder="City, Country"
                      />
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-400 flex items-center gap-1.5">
                      <RiMailLine className="text-sm" />
                      Email cannot be changed here.
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-xl text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-emerald-500 text-white
                          hover:bg-emerald-600 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                      >
                        {saving ? (
                          <><RiLoader4Line className="text-sm animate-spin" /> Saving…</>
                        ) : (
                          <><RiCheckLine className="text-sm" /> Save Changes</>
                        )}
                      </button>
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
