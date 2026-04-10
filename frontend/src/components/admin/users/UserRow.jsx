import { useState } from "react";
import { FiEye, FiEdit2, FiTrash2, FiSlash, FiUnlock } from "react-icons/fi";
import { useUserManagement } from "../../../context/UserManagementContext";
import RoleBadge from "./RoleBadge";
import StatusIndicator from "./StatusIndicator";
import { sanitizeAvatarUrl, getAvatarColor, getInitials } from "../../../utils/avatarUtils";

/**
 * AvatarCell — profile picture with a guaranteed initials fallback.
 *
 * Flow:
 *  1. sanitizeAvatarUrl()  →  null (placeholder/empty)  →  show initials
 *  2. sanitizeAvatarUrl()  →  clean URL (incl. Google =s96-c)  →  try <img>
 *  3. <img> onError fires  →  setImgFailed(true)  →  show initials
 *     (covers expired tokens, CORS failures, 403s, etc.)
 */
function AvatarCell({ user }) {
    const [imgFailed, setImgFailed] = useState(false);

    const initials       = getInitials(user);
    const { bg }         = getAvatarColor(user.email);
    const sanitizedUrl   = sanitizeAvatarUrl(user.profilePicture, 96);
    const showImage      = !imgFailed && sanitizedUrl !== null;

    const ringClasses = "ring-2 ring-white shadow-sm";

    if (showImage) {
        return (
            <div className="h-9 w-9 flex-shrink-0">
                <img
                    src={sanitizedUrl}
                    alt={initials}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className={`h-9 w-9 rounded-full object-cover ${ringClasses}`}
                    onError={() => setImgFailed(true)}
                />
            </div>
        );
    }

    return (
        <div
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${ringClasses} ${bg}`}
            aria-label={`Avatar for ${initials}`}
        >
            {initials}
        </div>
    );
}

/**
 * Tooltip wrapper — simple CSS-based tooltip.
 */
function Tip({ label, children }) {
    return (
        <span className="group relative">
            {children}
            <span className="pointer-events-none absolute -top-8 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[10px] font-medium text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                {label}
            </span>
        </span>
    );
}

function formatDate(dateStr) {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/**
 * UserRow — a single user row in the management table.
 */
export default function UserRow({ user }) {
    const { selectedUsers, toggleSelect, setViewUser, setEditUser, setDeleteTarget, toggleBlock } =
        useUserManagement();

    const isSelected = selectedUsers.has(user.email);

    return (
        <tr
            className={`group border-b border-slate-100 transition-colors ${
                isSelected ? "bg-emerald-50/70" : "hover:bg-slate-50/80"
            }`}
        >
            {/* Checkbox */}
            <td className="px-4 py-3">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(user.email)}
                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-emerald-600"
                />
            </td>

            {/* Avatar + Name + Email */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <AvatarCell user={user} />
                    <div>
                        <p className="text-sm font-semibold text-slate-800">
                            {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                </div>
            </td>

            {/* Role */}
            <td className="px-4 py-3">
                <RoleBadge role={user.role} />
            </td>

            {/* Status */}
            <td className="px-4 py-3">
                <StatusIndicator isBlocked={user.isBlocked} />
            </td>

            {/* Phone */}
            <td className="px-4 py-3 text-sm text-slate-600">
                {user.phone || "—"}
            </td>

            {/* Created Date */}
            <td className="px-4 py-3 text-sm text-slate-500">
                {formatDate(user.createdAt)}
            </td>

            {/* Actions */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <Tip label="View Details">
                        <button
                            onClick={() => setViewUser(user)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-slate-200"
                        >
                            <FiEye className="h-3.5 w-3.5" />
                        </button>
                    </Tip>

                    <Tip label="Edit Role">
                        <button
                            onClick={() => setEditUser(user)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100"
                        >
                            <FiEdit2 className="h-3.5 w-3.5" />
                        </button>
                    </Tip>

                    <Tip label={user.isBlocked ? "Unblock" : "Block"}>
                        <button
                            onClick={() => toggleBlock(user.email)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
                                user.isBlocked
                                    ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                    : "bg-amber-50 text-amber-600 hover:bg-amber-100"
                            }`}
                        >
                            {user.isBlocked ? (
                                <FiUnlock className="h-3.5 w-3.5" />
                            ) : (
                                <FiSlash className="h-3.5 w-3.5" />
                            )}
                        </button>
                    </Tip>

                    <Tip label="Delete User">
                        <button
                            onClick={() => setDeleteTarget(user.email)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 text-red-500 transition hover:bg-red-100"
                        >
                            <FiTrash2 className="h-3.5 w-3.5" />
                        </button>
                    </Tip>
                </div>
            </td>
        </tr>
    );
}
