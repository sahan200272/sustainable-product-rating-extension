import { FiTrash2, FiSlash, FiX } from "react-icons/fi";
import { useUserManagement } from "../../../context/UserManagementContext";

/**
 * BulkActionBar — slides up from bottom when users are selected.
 * Provides bulk delete and bulk block actions.
 */
export default function BulkActionBar() {
    const { selectedUsers, bulkDelete, bulkBlock, setDeleteTarget, setSelectedUsers } = useUserManagement();
    const count = selectedUsers.size;

    if (count === 0) return null;

    return (
        <div
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in slide-in-from-bottom-4 fade-in duration-300"
            style={{ animation: "slideUp 0.25s ease-out" }}
        >
            <style>{`
                @keyframes slideUp {
                    from { transform: translateX(-50%) translateY(20px); opacity: 0; }
                    to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
                }
            `}</style>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-700/50 bg-slate-900/95 px-5 py-3 shadow-2xl backdrop-blur-sm">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                    {count}
                </span>
                <span className="text-sm font-medium text-slate-200">
                    {count === 1 ? "1 user selected" : `${count} users selected`}
                </span>

                <div className="mx-1 h-5 w-px bg-slate-700" />

                <button
                    onClick={bulkBlock}
                    className="flex items-center gap-1.5 rounded-lg bg-amber-500/20 px-3 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/30"
                >
                    <FiSlash className="h-3.5 w-3.5" />
                    Block All
                </button>

                <button
                    onClick={() => setDeleteTarget("bulk")}
                    className="flex items-center gap-1.5 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:bg-red-500/30"
                >
                    <FiTrash2 className="h-3.5 w-3.5" />
                    Delete All
                </button>

                <button
                    onClick={() => setSelectedUsers(new Set())}
                    className="ml-1 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-700 hover:text-white"
                    title="Clear selection"
                >
                    <FiX className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
