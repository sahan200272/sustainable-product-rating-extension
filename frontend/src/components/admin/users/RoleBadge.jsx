/**
 * RoleBadge — displays a colored pill badge for a user role.
 * Roles: "Admin" (purple), "Customer" (blue)
 */
const ROLE_CONFIG = {
    Admin: {
        label: "Admin",
        classes: "bg-violet-100 text-violet-700 ring-1 ring-violet-200",
        dot: "bg-violet-500",
    },
    Customer: {
        label: "Customer",
        classes: "bg-blue-100 text-blue-700 ring-1 ring-blue-200",
        dot: "bg-blue-500",
    },
};

export default function RoleBadge({ role }) {
    const config = ROLE_CONFIG[role] ?? {
        label: role ?? "Unknown",
        classes: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
        dot: "bg-slate-400",
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.classes}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
}
