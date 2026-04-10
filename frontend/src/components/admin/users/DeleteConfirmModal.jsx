import { useEffect, useRef, useState } from "react";
import { FiAlertTriangle, FiX, FiTrash2 } from "react-icons/fi";
import { useUserManagement } from "../../../context/UserManagementContext";

/**
 * DeleteConfirmModal — confirmation dialog for single or bulk delete.
 */
export default function DeleteConfirmModal() {
    const { deleteTarget, setDeleteTarget, deleteUser, bulkDelete, selectedUsers } = useUserManagement();
    const overlayRef = useRef(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (!deleteTarget) return;
        const onKey = (e) => e.key === "Escape" && setDeleteTarget(null);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [deleteTarget, setDeleteTarget]);

    if (!deleteTarget) return null;

    const isBulk = deleteTarget === "bulk";
    const count = selectedUsers.size;

    const handleConfirm = async () => {
        setDeleting(true);
        try {
            if (isBulk) {
                await bulkDelete();
            } else {
                await deleteUser(deleteTarget);
            }
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={(e) => e.target === overlayRef.current && setDeleteTarget(null)}
        >
            <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-start justify-between p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                            <FiAlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-800">
                                {isBulk ? `Delete ${count} Users` : "Delete User"}
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-500">This action cannot be undone.</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setDeleteTarget(null)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100"
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="border-t border-slate-100 px-5 py-4">
                    <p className="text-sm text-slate-600">
                        {isBulk
                            ? `You're about to permanently delete ${count} selected ${
                                count === 1 ? "user" : "users"
                            }. All their data will be removed from the system.`
                            : `You're about to permanently delete the user with email `}
                        {!isBulk && (
                            <span className="font-semibold text-slate-800">{deleteTarget}</span>
                        )}
                        {!isBulk && ". This will remove all their data from the system."}
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 border-t border-slate-100 px-5 pb-5 pt-3">
                    <button
                        onClick={() => setDeleteTarget(null)}
                        disabled={deleting}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={deleting}
                        className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 disabled:opacity-60"
                    >
                        <FiTrash2 className="h-4 w-4" />
                        {deleting ? "Deleting…" : isBulk ? `Delete ${count} Users` : "Delete User"}
                    </button>
                </div>
            </div>
        </div>
    );
}
