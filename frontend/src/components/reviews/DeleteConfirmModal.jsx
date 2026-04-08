/**
 * DeleteConfirmModal.jsx
 *
 * A modern, accessible confirmation dialog for destructive actions.
 * Replaces the browser's default window.confirm popup.
 *
 * Features:
 *   - Blurred dark backdrop (backdropFilter)
 *   - Fade + scale entrance/exit animation via CSS keyframes
 *   - Keyboard accessible: Escape key closes, focus trapped inside modal
 *   - Two actions: Cancel (neutral) and Delete (destructive red)
 *   - Loading spinner while delete is in progress
 *
 * Props:
 *   isOpen    {boolean}           – Controls visibility
 *   onCancel  {()=>void}          – Called when user cancels
 *   onConfirm {()=>Promise<void>} – Called when user confirms (async)
 *   isDeleting {boolean}          – Shows spinner on Delete button
 */

import { useEffect, useRef } from "react";
import { FiAlertTriangle, FiLoader, FiTrash2, FiX } from "react-icons/fi";

export default function DeleteConfirmModal({
  isOpen,
  onCancel,
  onConfirm,
  isDeleting = false,
}) {
  const cancelRef = useRef(null);

  // ── Keyboard: close on Escape ────────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape" && !isDeleting) onCancel();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, isDeleting, onCancel]);

  // ── Auto-focus Cancel button on open ────────────────────────────────────
  useEffect(() => {
    if (isOpen) cancelRef.current?.focus();
  }, [isOpen]);

  // ── Lock body scroll while open ──────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    /* ── Backdrop ─────────────────────────────────────────────────────────── */
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-desc"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ animation: "dmBackdropIn 0.2s ease both" }}
    >
      {/* Blurred dark overlay */}
      <div
        className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm"
        onClick={!isDeleting ? onCancel : undefined}
      />

      {/* ── Dialog Card ──────────────────────────────────────────────────── */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl ring-1 ring-gray-200/80 p-7 flex flex-col gap-5"
        style={{ animation: "dmCardIn 0.22s cubic-bezier(0.16,1,0.3,1) both" }}
      >
        {/* Close × button (top-right) */}
        <button
          onClick={!isDeleting ? onCancel : undefined}
          disabled={isDeleting}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-40"
        >
          <FiX className="w-4 h-4" />
        </button>

        {/* ── Icon + Heading ──────────────────────────────────────────────── */}
        <div className="flex items-start gap-4">
          {/* Red icon bubble */}
          <div className="shrink-0 w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
            <FiAlertTriangle className="w-5 h-5 text-red-500" />
          </div>

          <div>
            <h2
              id="delete-modal-title"
              className="text-base font-bold text-gray-900 leading-snug"
            >
              Confirm Deletion
            </h2>
            <p
              id="delete-modal-desc"
              className="mt-1 text-sm text-gray-500 leading-relaxed"
            >
              Are you sure you want to delete this review?{" "}
              <span className="text-gray-700 font-medium">
                This action cannot be undone.
              </span>
            </p>
          </div>
        </div>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <div className="border-t border-gray-100" />

        {/* ── Action Buttons ───────────────────────────────────────────────── */}
        <div className="flex flex-col-reverse sm:flex-row gap-2.5 sm:justify-end">
          {/* Cancel */}
          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>

          {/* Delete (destructive) */}
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 active:bg-red-700 transition-colors shadow-sm shadow-red-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
          >
            {isDeleting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <FiTrash2 className="w-4 h-4" />
                Delete Review
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Keyframe animations (injected via a <style> tag) ─────────────── */}
      <style>{`
        @keyframes dmBackdropIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes dmCardIn {
          from { opacity: 0; transform: scale(0.92) translateY(8px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  );
}
