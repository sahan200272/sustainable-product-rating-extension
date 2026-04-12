import { FiSearch, FiDownload, FiX } from "react-icons/fi";
import { useUserManagement } from "../../../context/UserManagementContext";

/**
 * UserTableFilters — search, role filter, status filter, and CSV export.
 */
export default function UserTableFilters() {
    const {
        searchQuery,
        handleSearchChange,
        roleFilter,
        setRoleFilter,
        statusFilter,
        setStatusFilter,
        setCurrentPage,
        exportCSV,
        filteredUsers,
        users,
    } = useUserManagement();

    const hasFilters =
        searchQuery !== "" || roleFilter !== "all" || statusFilter !== "all";

    const clearFilters = () => {
        handleSearchChange("");
        setRoleFilter("all");
        setStatusFilter("all");
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Left: search + filters */}
            <div className="flex flex-1 flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative min-w-[220px] flex-1">
                    <FiSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search by name or email…"
                        className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-8 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => handleSearchChange("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <FiX className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Role filter */}
                <select
                    value={roleFilter}
                    onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                >
                    <option value="all">All Roles</option>
                    <option value="Admin">Admin</option>
                    <option value="Customer">Customer</option>
                </select>

                {/* Status filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="blocked">Blocked</option>
                </select>

                {/* Clear button */}
                {hasFilters && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-emerald-600 transition"
                    >
                        <FiX className="h-3.5 w-3.5" />
                        Clear filters
                    </button>
                )}
            </div>

            {/* Right: result count + export */}
            <div className="flex items-center gap-2">
                {hasFilters && (
                    <span className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">{filteredUsers.length}</span> of {users.length} users
                    </span>
                )}
                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-emerald-400 hover:text-emerald-700"
                    title="Export to CSV"
                >
                    <FiDownload className="h-4 w-4" />
                    Export CSV
                </button>
            </div>
        </div>
    );
}
