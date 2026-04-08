/**
 * RatingStars.jsx
 *
 * Interactive 5-star rating selector.
 *
 * Features:
 *   - Hover preview (highlights stars as the cursor moves)
 *   - Click to lock in a rating
 *   - Full keyboard accessibility (Arrow keys, Enter, Space)
 *   - Visual label describing the selected rating
 *   - Read-only display mode (for ReviewCard)
 *   - Smooth scale + colour transition per star
 *
 * Props:
 *   rating       {number}            – Current selected rating (1–5)
 *   onChange     {(n: number)=>void} – Called when user selects a star (omit for read-only)
 *   size         {string}            – Tailwind size class, e.g. "w-8 h-8". Default "w-9 h-9"
 *   readOnly     {boolean}           – Disable interaction (display only)
 *   showLabel    {boolean}           – Show text label below stars (default true in edit mode)
 */

import { useState } from "react";
import { FaStar } from "react-icons/fa";

const LABELS = ["", "Poor", "Fair", "Good", "Great", "Excellent"];
const COLOURS = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#10b981"];

export default function RatingStars({
  rating = 0,
  onChange,
  size = "w-9 h-9",
  readOnly = false,
  showLabel = true,
}) {
  // hovered tracks which star the cursor is currently over
  const [hovered, setHovered] = useState(0);

  const active = hovered || rating; // highlighted stars = hover preview OR locked selection
  const isInteractive = !readOnly && typeof onChange === "function";

  /** Keyboard handler — arrow keys shift rating, enter/space confirm */
  const handleKeyDown = (e, starValue) => {
    if (!isInteractive) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(starValue);
    }
    if (e.key === "ArrowRight" && rating < 5) onChange(Math.min(rating + 1, 5));
    if (e.key === "ArrowLeft" && rating > 1) onChange(Math.max(rating - 1, 1));
  };

  return (
    <div className="flex flex-col items-start gap-1">
      {/* ── Star row ── */}
      <div
        role={isInteractive ? "radiogroup" : undefined}
        aria-label="Product rating"
        className="flex items-center gap-1"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= active;
          return (
            <button
              key={star}
              type="button"
              role={isInteractive ? "radio" : undefined}
              aria-checked={isInteractive ? rating === star : undefined}
              aria-label={`${star} star${star > 1 ? "s" : ""}`}
              disabled={!isInteractive}
              onClick={() => isInteractive && onChange(star)}
              onMouseEnter={() => isInteractive && setHovered(star)}
              onMouseLeave={() => isInteractive && setHovered(0)}
              onKeyDown={(e) => handleKeyDown(e, star)}
              tabIndex={isInteractive ? (rating === star || (!rating && star === 1) ? 0 : -1) : -1}
              className={[
                size,
                "transition-all duration-150 ease-in-out",
                isInteractive
                  ? "cursor-pointer hover:scale-125 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:rounded"
                  : "cursor-default",
              ].join(" ")}
              style={{
                // Dynamic colour based on rating value
                color: isFilled ? COLOURS[active] : "#d1d5db",
                // Star scales up slightly when hovered
                transform: isFilled && isInteractive ? "scale(1.15)" : "scale(1)",
              }}
            >
              <FaStar className="w-full h-full drop-shadow-sm" />
            </button>
          );
        })}
      </div>

      {/* ── Text label (only in interactive mode) ── */}
      {showLabel && isInteractive && (
        <p
          className="text-sm font-semibold transition-all duration-200"
          style={{ color: active ? COLOURS[active] : "#9ca3af" }}
        >
          {active ? LABELS[active] : "Select a rating"}
        </p>
      )}
    </div>
  );
}
