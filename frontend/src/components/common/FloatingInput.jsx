/**
 * FloatingInput
 *
 * Reusable glassmorphism text input with a floating label.
 * Previously copy-pasted into every form field — now a single source of truth.
 *
 * Props:
 *   id          {string}   - Unique input id (also used for htmlFor on label).
 *   name        {string}   - Field name (used by useForm's handleChange).
 *   type        {string}   - Input type (text, email, password, tel …).
 *   label       {string}   - Label text.
 *   value       {string}   - Controlled value.
 *   onChange    {function} - Change handler (e.g. useForm's handleChange).
 *   required    {boolean}  - HTML required attribute.
 *   minLength   {number}   - Optional minLength.
 *   autoComplete{string}   - Optional autocomplete hint.
 *   colSpan     {string}   - Optional Tailwind col-span class for grid layouts.
 */
export default function FloatingInput({
    id,
    name,
    type = "text",
    label,
    value,
    onChange,
    required = false,
    minLength,
    autoComplete,
    colSpan = "",
}) {
    return (
        <div className={`relative group ${colSpan}`}>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                minLength={minLength}
                autoComplete={autoComplete}
                className="peer w-full px-4 py-3 border border-white/30 rounded-lg outline-none bg-white/10 text-white placeholder-transparent focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 transition-all duration-300"
                placeholder={label}
            />
            <label
                htmlFor={id}
                className="absolute left-4 -top-2.5 bg-transparent text-sm text-gray-200 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-placeholder-shown:top-3 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-300"
            >
                {label}
            </label>
        </div>
    );
}
