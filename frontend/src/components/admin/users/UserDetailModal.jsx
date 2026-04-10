import { useEffect, useRef, useState } from "react";
import { FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiX, FiCheck, FiSlash } from "react-icons/fi";
import { useUserManagement } from "../../../context/UserManagementContext";
import RoleBadge from "./RoleBadge";
import StatusIndicator from "./StatusIndicator";
import { sanitizeAvatarUrl, getAvatarColor, getInitials } from "../../../utils/avatarUtils";

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <Icon className="h-4 w-4 text-slate-500" />
            </div>
            <div>
                <p className="text-xs font-medium text-slate-500">{label}</p>
                <p className="text-sm font-semibold text-slate-800">{value || "—"}</p>
            </div>
        </div>
    );
}

function formatDate(d) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric",
    });
}


/**
 * UserDetailModal — full user info panel.
 */
export default function UserDetailModal() {
    const { viewUser, setViewUser, toggleBlock, setDeleteTarget } = useUserManagement();
    const overlayRef = useRef(null);
    const [imgFailed, setImgFailed] = useState(false);

    // Reset imgFailed whenever a different user is opened
    useEffect(() => { setImgFailed(false); }, [viewUser?._id]);

    useEffect(() => {
        if (!viewUser) return;
        const onKey = (e) => e.key === "Escape" && setViewUser(null);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [viewUser, setViewUser]);

    if (!viewUser) return null;

    const initials      = getInitials(viewUser);
    const { bg: color } = getAvatarColor(viewUser.email);
    const sanitizedUrl  = sanitizeAvatarUrl(viewUser.profilePicture, 200);
    const showImg       = !imgFailed && sanitizedUrl !== null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={(e) => e.target === overlayRef.current && setViewUser(null)}
        >
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header gradient */}
                <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 px-6 py-5">
                    <button
                        onClick={() => setViewUser(null)}
                        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
                    >
                        <FiX className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-4">
                        {showImg ? (
                            <img
                                src={sanitizedUrl}
                                alt={initials}
                                referrerPolicy="no-referrer"
                                crossOrigin="anonymous"
                                className="h-16 w-16 rounded-2xl object-cover ring-4 ring-white/20"
                                onError={() => setImgFailed(true)}
                            />
                        ) : (
                            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-xl font-bold text-white ring-4 ring-white/20 ${color}`}>
                                {initials}
                            </div>
                        )}
                        <div>
                            <h2 className="text-lg font-bold text-white">
                                {viewUser.firstName} {viewUser.lastName}
                            </h2>
                            <p className="text-sm text-slate-400">{viewUser.email}</p>
                            <div className="mt-2 flex items-center gap-2">
                                <RoleBadge role={viewUser.role} />
                                <StatusIndicator isBlocked={viewUser.isBlocked} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-4 p-6">
                    <InfoRow icon={FiUser} label="First Name" value={viewUser.firstName} />
                    <InfoRow icon={FiUser} label="Last Name" value={viewUser.lastName} />
                    <InfoRow icon={FiMail} label="Email" value={viewUser.email} />
                    <InfoRow icon={FiPhone} label="Phone" value={viewUser.phone} />
                    <InfoRow icon={FiMapPin} label="Address" value={viewUser.address} />
                    <InfoRow
                        icon={FiCheck}
                        label="Email Verified"
                        value={viewUser.emailVerified ? "Verified ✓" : "Not Verified"}
                    />
                    <div className="col-span-2">
                        <InfoRow icon={FiCalendar} label="Member Since" value={formatDate(viewUser.createdAt)} />
                    </div>
                </div>

                {/* Footer actions */}
                <div className="flex justify-end gap-2 border-t border-slate-100 px-6 pb-5 pt-4">
                    <button
                        onClick={() => { toggleBlock(viewUser.email); setViewUser(null); }}
                        className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                            viewUser.isBlocked
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                        }`}
                    >
                        <FiSlash className="h-4 w-4" />
                        {viewUser.isBlocked ? "Unblock User" : "Block User"}
                    </button>
                    <button
                        onClick={() => { setDeleteTarget(viewUser.email); setViewUser(null); }}
                        className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                        Delete User
                    </button>
                </div>
            </div>
        </div>
    );
}
