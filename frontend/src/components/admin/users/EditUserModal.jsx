import { useEffect, useRef, useState } from "react";
import { FiX, FiShield } from "react-icons/fi";
import { useUserManagement } from "../../../context/UserManagementContext";
import RoleBadge from "./RoleBadge";
import StatusIndicator from "./StatusIndicator";

/**
 * EditUserModal — allows updating a user's role and viewing/toggling status.
 */
export default function EditUserModal() {
    const { editUser, setEditUser, updateRole, toggleBlock } = useUserManagement();
    const overlayRef = useRef(null);
    const [selectedRole, setSelectedRole] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editUser) setSelectedRole(editUser.role ?? "Customer");
    }, [editUser]);

    useEffect(() => {
        if (!editUser) return;
        const onKey = (e) => e.key === "Escape" && setEditUser(null);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [editUser, setEditUser]);

    if (!editUser) return null;

    const handleSave = async () => {
        setSaving(true);
        try {
            if (selectedRole !== editUser.role) {
                await updateRole(editUser.email, selectedRole);
            } else {
                setEditUser(null);
            }
        } finally {
            setSaving(false);
        }
    };

    const ROLES = ["Admin", "Customer"];

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={(e) => e.target === overlayRef.current && setEditUser(null)}
        >
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100">
                            <FiShield className="h-4 w-4 text-indigo-600" />
                        </div>
                        <h2 className="text-base font-bold text-slate-800">Edit User</h2>
                    </div>
                    <button
                        onClick={() => setEditUser(null)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                </div>

                {/* User info */}
                <div className="px-6 pt-5">
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 text-sm font-bold text-white">
                            {`${editUser.firstName?.[0] ?? ""}${editUser.lastName?.[0] ?? ""}`.toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-800">
                                {editUser.firstName} {editUser.lastName}
                            </p>
                            <p className="text-xs text-slate-500">{editUser.email}</p>
                        </div>
                        <div className="ml-auto">
                            <StatusIndicator isBlocked={editUser.isBlocked} />
                        </div>
                    </div>
                </div>

                {/* Role selector */}
                <div className="px-6 py-5">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">
                        User Role
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {ROLES.map((role) => (
                            <button
                                key={role}
                                onClick={() => setSelectedRole(role)}
                                className={`flex items-center gap-2 rounded-xl border-2 p-3 text-sm font-semibold transition ${
                                    selectedRole === role
                                        ? role === "Admin"
                                            ? "border-violet-400 bg-violet-50 text-violet-700"
                                            : "border-blue-400 bg-blue-50 text-blue-700"
                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                                }`}
                            >
                                <RoleBadge role={role} />
                                {selectedRole === role && (
                                    <span className="ml-auto h-2 w-2 rounded-full bg-current" />
                                )}
                            </button>
                        ))}
                    </div>

                    {selectedRole !== editUser.role && (
                        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                            ⚠ Changing from <strong>{editUser.role}</strong> to <strong>{selectedRole}</strong>. This affects the user's permissions.
                        </p>
                    )}
                </div>

                {/* Status toggle */}
                <div className="border-t border-slate-100 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-slate-700">Account Status</p>
                            <p className="text-xs text-slate-500">
                                {editUser.isBlocked ? "User is currently blocked from accessing the platform." : "User has full access to the platform."}
                            </p>
                        </div>
                        <button
                            onClick={() => { toggleBlock(editUser.email); setEditUser(null); }}
                            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition ${
                                editUser.isBlocked
                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                    : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                            }`}
                        >
                            {editUser.isBlocked ? "Unblock" : "Block"}
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t border-slate-100 px-6 pb-5 pt-3">
                    <button
                        onClick={() => setEditUser(null)}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || selectedRole === editUser.role}
                        className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? "Saving…" : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}
