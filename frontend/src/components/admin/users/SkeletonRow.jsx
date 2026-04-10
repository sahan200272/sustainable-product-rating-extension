/**
 * SkeletonRow — animated shimmer rows used during data loading.
 */
function SkeletonCell({ wide }) {
    return (
        <td className="px-4 py-3">
            <div className={`h-4 animate-pulse rounded-md bg-slate-200 ${wide ? "w-32" : "w-20"}`} />
        </td>
    );
}

export default function SkeletonRow() {
    return (
        <tr className="border-b border-slate-100">
            {/* Checkbox */}
            <td className="px-4 py-3">
                <div className="h-4 w-4 animate-pulse rounded bg-slate-200" />
            </td>
            {/* Avatar + name */}
            <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
                    <div className="space-y-1.5">
                        <div className="h-3.5 w-28 animate-pulse rounded bg-slate-200" />
                        <div className="h-3 w-36 animate-pulse rounded bg-slate-200" />
                    </div>
                </div>
            </td>
            <SkeletonCell wide />
            <SkeletonCell />
            <SkeletonCell />
            <SkeletonCell wide />
            {/* Actions */}
            <td className="px-4 py-3">
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-8 w-8 animate-pulse rounded-lg bg-slate-200" />
                    ))}
                </div>
            </td>
        </tr>
    );
}
