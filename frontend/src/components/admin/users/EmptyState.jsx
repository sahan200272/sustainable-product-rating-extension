import { FiUsers } from "react-icons/fi";

/**
 * EmptyState — shown when there are no users to display.
 */
export default function EmptyState({ hasFilters, onClear }) {
    return (
        <tr>
            <td colSpan={7}>
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                        <FiUsers className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-base font-semibold text-slate-700">
                        {hasFilters ? "No users match your filters" : "No users found"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                        {hasFilters
                            ? "Try adjusting your search or filter criteria."
                            : "Users will appear here once they register."}
                    </p>
                    {hasFilters && (
                        <button
                            onClick={onClear}
                            className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}
