export default function FormField({
    label,
    id,
    name,
    type = "text",
    value,
    onChange,
    required,
    minLength,
    autoComplete,
}) {
    return (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-[11px] lg:text-xs font-semibold uppercase tracking-widest text-emerald-700">
                {label}{required && <span className="text-emerald-500 ml-0.5">*</span>}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                minLength={minLength}
                autoComplete={autoComplete}
                className="w-full px-4 py-2.5 lg:py-3 rounded-xl border border-emerald-200 bg-white/80 text-gray-800 text-sm lg:text-base placeholder-gray-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300/50 transition-all duration-200"
                placeholder={`Enter your ${label.toLowerCase()}`}
            />
        </div>
    );
}
