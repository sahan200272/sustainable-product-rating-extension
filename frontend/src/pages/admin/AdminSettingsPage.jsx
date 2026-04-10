import { FiSettings } from "react-icons/fi";

/**
 * AdminSettingsPage
 *
 * Route: /admin/settings
 * Extracted from AdminDashboard — settings section stub.
 * No layout shell (AdminLayout provides sidebar + topbar).
 */
export default function AdminSettingsPage() {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <FiSettings className="h-5 w-5" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Settings</h2>
                    <p className="text-xs text-slate-500">Admin configuration and system preferences</p>
                </div>
            </div>
            <p className="text-sm text-slate-600">
                Settings section is ready for your future admin options.
            </p>
        </div>
    );
}
