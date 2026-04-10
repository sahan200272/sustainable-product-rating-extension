/**
 * StatusIndicator — shows a pulsing dot and label for Active / Blocked status.
 */
export default function StatusIndicator({ isBlocked }) {
    return (
        <span className="inline-flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
                {!isBlocked && (
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                    className={`relative inline-flex h-2 w-2 rounded-full ${
                        isBlocked ? "bg-red-500" : "bg-emerald-500"
                    }`}
                />
            </span>
            <span
                className={`text-xs font-semibold ${
                    isBlocked ? "text-red-600" : "text-emerald-700"
                }`}
            >
                {isBlocked ? "Blocked" : "Active"}
            </span>
        </span>
    );
}
