import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * TablePagination — prev/next navigation with page numbers and page-size selector.
 */
export default function TablePagination({
    currentPage,
    totalPages,
    pageSize,
    totalItems,
    onPageChange,
    onPageSizeChange,
}) {
    const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);

    // Generate visible page numbers (max 5 around current)
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 ||
            i === totalPages ||
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "…") {
            pages.push("…");
        }
    }

    return (
        <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-600">
                <span>
                    Showing <span className="font-semibold text-slate-800">{start}–{end}</span> of{" "}
                    <span className="font-semibold text-slate-800">{totalItems}</span> users
                </span>
                <span className="text-slate-300">|</span>
                <label className="flex items-center gap-1.5">
                    Rows:
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            onPageSizeChange(Number(e.target.value));
                            onPageChange(1);
                        }}
                        className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700 focus:border-emerald-500 focus:outline-none"
                    >
                        {[5, 10, 20, 50].map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <FiChevronLeft className="h-4 w-4" />
                </button>

                {pages.map((p, i) =>
                    p === "…" ? (
                        <span key={`ellipsis-${i}`} className="px-1 text-xs text-slate-400">…</span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium transition ${
                                p === currentPage
                                    ? "bg-emerald-600 text-white shadow-sm"
                                    : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    <FiChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
