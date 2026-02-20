/**
 * LoadingButton
 *
 * Reusable submit button with disabled + loading text state.
 *
 * Props:
 *   loading      {boolean} - Show loadingLabel and disable the button when true.
 *   label        {string}  - Button text when idle.
 *   loadingLabel {string}  - Button text when loading.
 *   colSpan      {string}  - Optional Tailwind col-span class for grid layouts.
 */
export default function LoadingButton({
    loading,
    label,
    loadingLabel,
    colSpan = "",
}) {
    return (
        <button
            type="submit"
            disabled={loading}
            className={`${colSpan} w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transform transition hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/30 mt-2 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
            {loading ? loadingLabel : label}
        </button>
    );
}
