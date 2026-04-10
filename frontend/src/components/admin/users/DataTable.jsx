import { FiChevronUp, FiChevronDown, FiMinus } from "react-icons/fi";
import { useUserManagement } from "../../../context/UserManagementContext";
import SkeletonRow from "./SkeletonRow";
import EmptyState from "./EmptyState";
import UserRow from "./UserRow";
import TablePagination from "./TablePagination";

/**
 * SortIcon — shows up/down/neutral sort icon in column headers.
 */
function SortIcon({ field, sortField, sortDir }) {
    if (sortField !== field)
        return <FiMinus className="ml-1 inline h-3.5 w-3.5 text-slate-400" />;
    return sortDir === "asc" ? (
        <FiChevronUp className="ml-1 inline h-3.5 w-3.5 text-emerald-600" />
    ) : (
        <FiChevronDown className="ml-1 inline h-3.5 w-3.5 text-emerald-600" />
    );
}

const COLUMNS = [
    { label: "User", field: "firstName", sortable: true },
    { label: "Role", field: "role", sortable: true },
    { label: "Status", field: "isBlocked", sortable: true },
    { label: "Phone", field: "phone", sortable: false },
    { label: "Created", field: "createdAt", sortable: true },
    { label: "Actions", field: null, sortable: false },
];

/**
 * DataTable — the main user table component.
 * Renders sticky header, skeleton loaders, empty state, and user rows.
 */
export default function DataTable() {
    const {
        paginatedUsers,
        filteredUsers,
        loading,
        sortField,
        sortDir,
        handleSort,
        selectedUsers,
        toggleSelectAll,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        handleSearchChange,
        setRoleFilter,
        setStatusFilter,
        debouncedSearch,
        roleFilter,
        statusFilter,
    } = useUserManagement();

    const hasFilters = debouncedSearch !== "" || roleFilter !== "all" || statusFilter !== "all";

    const pageEmails = paginatedUsers.map((u) => u.email);
    const allPageSelected =
        pageEmails.length > 0 && pageEmails.every((e) => selectedUsers.has(e));
    const somePageSelected = pageEmails.some((e) => selectedUsers.has(e)) && !allPageSelected;

    const clearFilters = () => {
        handleSearchChange("");
        setRoleFilter("all");
        setStatusFilter("all");
        setCurrentPage(1);
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                    {/* Sticky header */}
                    <thead className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50">
                        <tr>
                            {/* Select-all checkbox */}
                            <th className="w-10 px-4 py-3">
                                <input
                                    type="checkbox"
                                    checked={allPageSelected}
                                    ref={(el) => {
                                        if (el) el.indeterminate = somePageSelected;
                                    }}
                                    onChange={toggleSelectAll}
                                    disabled={loading || paginatedUsers.length === 0}
                                    className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-emerald-600 disabled:cursor-not-allowed"
                                />
                            </th>

                            {COLUMNS.map(({ label, field, sortable }) => (
                                <th
                                    key={label}
                                    className={`px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500 ${
                                        sortable ? "cursor-pointer select-none hover:text-slate-700" : ""
                                    }`}
                                    onClick={sortable ? () => handleSort(field) : undefined}
                                >
                                    {label}
                                    {sortable && (
                                        <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                        ) : paginatedUsers.length === 0 ? (
                            <EmptyState hasFilters={hasFilters} onClear={clearFilters} />
                        ) : (
                            paginatedUsers.map((user) => (
                                <UserRow key={user._id ?? user.email} user={user} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {!loading && filteredUsers.length > 0 && (
                <TablePagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredUsers.length / pageSize)}
                    pageSize={pageSize}
                    totalItems={filteredUsers.length}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                />
            )}
        </div>
    );
}
