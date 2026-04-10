import { useEffect, useRef, useState } from "react";
import { FiUserPlus, FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { useUserManagement } from "../../../context/UserManagementContext";

/**
 * FormInput — reusable labeled input with error state.
 */
function FormInput({ id, label, type = "text", value, onChange, error, placeholder, required, rightEl }) {
    return (
        <div>
            <label htmlFor={id} className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <input
                    id={id}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm text-slate-800 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 transition ${
                        error
                            ? "border-red-400 focus:border-red-400 focus:ring-red-400/20"
                            : "border-slate-200 focus:border-emerald-500 focus:ring-emerald-500/20"
                    }`}
                />
                {rightEl && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
                )}
            </div>
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
}

const INITIAL = { firstName: "", lastName: "", email: "", password: "", role: "Customer" };

/**
 * AddUserModal — admin form to create a new user account.
 */
export default function AddUserModal() {
    const { showAddModal, setShowAddModal, createUser } = useUserManagement();
    const overlayRef = useRef(null);
    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showPwd, setShowPwd] = useState(false);

    useEffect(() => {
        if (!showAddModal) { setForm(INITIAL); setErrors({}); }
    }, [showAddModal]);

    useEffect(() => {
        if (!showAddModal) return;
        const onKey = (e) => e.key === "Escape" && setShowAddModal(false);
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [showAddModal, setShowAddModal]);

    if (!showAddModal) return null;

    const field = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = "First name is required";
        if (!form.lastName.trim()) e.lastName = "Last name is required";
        if (!form.email.trim()) {
            e.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            e.email = "Enter a valid email address";
        }
        if (!form.password) {
            e.password = "Password is required";
        } else if (form.password.length < 6) {
            e.password = "Password must be at least 6 characters";
        }
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        setErrors({});
        setSubmitting(true);
        try {
            await createUser(form);
        } catch {
            // toast is shown in context
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={(e) => e.target === overlayRef.current && setShowAddModal(false)}
        >
            <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100">
                            <FiUserPlus className="h-4 w-4 text-emerald-700" />
                        </div>
                        <h2 className="text-base font-bold text-slate-800">Add New User</h2>
                    </div>
                    <button
                        onClick={() => setShowAddModal(false)}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100"
                    >
                        <FiX className="h-4 w-4" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
                    <div className="grid grid-cols-2 gap-3">
                        <FormInput
                            id="add-firstName"
                            label="First Name"
                            value={form.firstName}
                            onChange={field("firstName")}
                            error={errors.firstName}
                            placeholder="Jane"
                            required
                        />
                        <FormInput
                            id="add-lastName"
                            label="Last Name"
                            value={form.lastName}
                            onChange={field("lastName")}
                            error={errors.lastName}
                            placeholder="Doe"
                            required
                        />
                    </div>

                    <FormInput
                        id="add-email"
                        label="Email Address"
                        type="email"
                        value={form.email}
                        onChange={field("email")}
                        error={errors.email}
                        placeholder="jane.doe@example.com"
                        required
                    />

                    <FormInput
                        id="add-password"
                        label="Password"
                        type={showPwd ? "text" : "password"}
                        value={form.password}
                        onChange={field("password")}
                        error={errors.password}
                        placeholder="Min. 6 characters"
                        required
                        rightEl={
                            <button
                                type="button"
                                onClick={() => setShowPwd((v) => !v)}
                                className="text-slate-400 hover:text-slate-600"
                                tabIndex={-1}
                            >
                                {showPwd ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                            </button>
                        }
                    />

                    {/* Role */}
                    <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                            Role <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {["Customer", "Admin"].map((r) => (
                                <button
                                    key={r}
                                    type="button"
                                    onClick={() => setForm((f) => ({ ...f, role: r }))}
                                    className={`rounded-xl border-2 py-2.5 text-sm font-semibold transition ${
                                        form.role === r
                                            ? r === "Admin"
                                                ? "border-violet-400 bg-violet-50 text-violet-700"
                                                : "border-blue-400 bg-blue-50 text-blue-700"
                                            : "border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            disabled={submitting}
                            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                            <FiUserPlus className="h-4 w-4" />
                            {submitting ? "Creating…" : "Create User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
