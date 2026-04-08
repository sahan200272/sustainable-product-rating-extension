/**
 * ReviewForm.jsx
 *
 * Production-level form for submitting a product review.
 *
 * Architecture decisions:
 *   - Reads auth state from AuthContext (no prop drilling)
 *   - Delegates API calls to reviewService (clean separation of concerns)
 *   - Child components: RatingStars, SustainabilityTags (single-responsibility)
 *   - All side-effects gated after user interaction — no auto-fetch on mount
 *   - Calls `onSuccess(review)` after successful submission so the parent
 *     ReviewList can prepend the new item optimistically without a full reload.
 *
 * Props:
 *   productId  {string}              – MongoDB ObjectId of the product being reviewed
 *   onSuccess  {(review: obj)=>void} – Called with the new review data on success
 */

import { useState, useContext, useId } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { createReview } from "../../services/reviewService";
import RatingStars from "./RatingStars";
import SustainabilityTags from "./SustainabilityTags";
import toast from "react-hot-toast";
import {
  FiSend, FiAlertCircle, FiCheckCircle, FiLock,
  FiLoader, FiArrowRight, FiEyeOff
} from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

// ─── Constants ───────────────────────────────────────────────────────────────

const MAX_CHARS = 1000; // mirrors reviewSchema.reviewText.maxlength

// Inline error helper
const FieldError = ({ msg }) =>
  msg ? (
    <p role="alert" className="flex items-center gap-1 text-xs text-red-500 mt-1 animate-[fadeIn_0.2s_ease]">
      <FiAlertCircle className="shrink-0" /> {msg}
    </p>
  ) : null;

// ─── Component ───────────────────────────────────────────────────────────────

export default function ReviewForm({ productId, onSuccess }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const formId = useId(); // Stable unique ID prefix for a11y

  // ── Form state ──────────────────────────────────────────────────────────
  const [rating, setRating]           = useState(0);
  const [text, setText]               = useState("");
  const [tags, setTags]               = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // ── UI state ────────────────────────────────────────────────────────────
  const [loading, setLoading]     = useState(false);
  const [submitted, setSubmitted] = useState(false);   // success banner
  const [apiError, setApiError]   = useState("");      // server-level error

  // ── Field-level validation errors ──────────────────────────────────────
  const [errors, setErrors] = useState({ rating: "", text: "" });

  const charCount   = text.length;
  const charPercent = Math.min((charCount / MAX_CHARS) * 100, 100);

  // Progress ring colour
  const ringColour =
    charPercent >= 100 ? "text-red-500" :
    charPercent >= 80  ? "text-amber-500" :
    "text-emerald-500";

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const e = { rating: "", text: "" };
    let ok = true;

    if (!rating) {
      e.rating = "Please select a star rating.";
      ok = false;
    }
    if (!text.trim()) {
      e.text = "Review text is required.";
      ok = false;
    } else if (text.trim().length < 10) {
      e.text = "Review must be at least 10 characters.";
      ok = false;
    } else if (text.length > MAX_CHARS) {
      e.text = `Review cannot exceed ${MAX_CHARS} characters.`;
      ok = false;
    }

    setErrors(e);
    return ok;
  };

  // ── Submit handler ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        product:            productId,
        overallRating:      rating,
        reviewText:         text.trim(),
        sustainabilityTags: tags,
        isAnonymous,          // let the user choose to post anonymously
      };

      const result = await createReview(payload);

      // Ensure the review's user field is a populated object so ReviewCard
      // can display the correct name immediately (defensive fallback in case
      // the backend didn't populate — the primary fix is in review.service.js).
      const reviewData = result.data;
      if (reviewData && typeof reviewData.user !== "object") {
        reviewData.user = {
          _id:            user?._id ?? user?.id,
          firstName:      user?.firstName ?? "",
          lastName:       user?.lastName  ?? "",
          profilePicture: user?.profilePicture ?? null,
        };
      }

      // Notify parent (optimistic list update)
      if (typeof onSuccess === "function") onSuccess(reviewData);

      setSubmitted(true);
      // Reset form
      setRating(0);
      setText("");
      setTags([]);
      setIsAnonymous(false);
      setErrors({ rating: "", text: "" });

      toast.success(
        result.message || "Review submitted! It will appear after moderation.",
        { duration: 4000 }
      );
    } catch (err) {
      const serverMsg = err?.response?.data?.error;

      // 401 / 403 — token expired or user blocked
      if (err?.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        navigate("/login");
        return;
      }
      if (err?.response?.status === 403) {
        setApiError(serverMsg || "Your account has been restricted from submitting reviews.");
        return;
      }

      setApiError(serverMsg || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Guard: not authenticated ─────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-emerald-50 border border-emerald-100 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
          <FiLock className="w-7 h-7 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Sign in to leave a review</h3>
          <p className="text-sm text-gray-500">
            Share your sustainability experience with the community — log in to get started.
          </p>
        </div>
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-emerald-200 hover:shadow-lg"
        >
          Log In <FiArrowRight />
        </button>
      </div>
    );
  }

  // ── Guard: user is Admin (admins don't post reviews) ─────────────────────
  if (user?.role === "Admin") {
    return (
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
        <p className="text-sm text-indigo-600 font-medium">
          Admins can read but not submit reviews.
        </p>
      </div>
    );
  }

  // ── Success banner ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-8 flex flex-col items-center text-center gap-4 animate-[fadeIn_0.4s_ease]">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
          <FiCheckCircle className="w-9 h-9 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Thank you for your review! 🌿</h3>
          <p className="text-sm text-gray-500 max-w-xs">
            Your feedback has been submitted for moderation and will appear once approved.
          </p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm text-emerald-600 hover:underline font-medium"
        >
          Write another review
        </button>
      </div>
    );
  }

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 flex items-center gap-3">
        <FaLeaf className="text-white/80 w-5 h-5" />
        <h2 className="text-white font-bold text-lg">Write a Review</h2>
        <span className="ml-auto text-white/60 text-xs">
          Reviewing as <span className="text-white font-semibold">{user?.name || user?.email}</span>
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Product review form"
        className="p-6 space-y-6"
      >
        {/* ── Server-level error ── */}
        {apiError && (
          <div
            role="alert"
            className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl animate-[fadeIn_0.2s_ease]"
          >
            <FiAlertCircle className="text-red-500 shrink-0 mt-0.5 w-5 h-5" />
            <p className="text-sm text-red-700">{apiError}</p>
          </div>
        )}

        {/* ── Star Rating ── */}
        <div>
          <label
            id={`${formId}-rating-label`}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Overall Rating <span className="text-red-500">*</span>
          </label>
          <RatingStars
            rating={rating}
            onChange={(val) => {
              setRating(val);
              if (errors.rating) setErrors((e) => ({ ...e, rating: "" }));
            }}
            size="w-9 h-9"
            showLabel
          />
          <FieldError msg={errors.rating} />
        </div>

        {/* ── Review Text ── */}
        <div>
          <div className="flex justify-between items-baseline mb-2">
            <label
              htmlFor={`${formId}-review-text`}
              className="block text-sm font-semibold text-gray-700"
            >
              Your Review <span className="text-red-500">*</span>
            </label>

            {/* Character counter with progress ring */}
            <span
              aria-live="polite"
              aria-label={`${charCount} of ${MAX_CHARS} characters used`}
              className={`text-xs font-mono font-medium tabular-nums transition-colors ${ringColour}`}
            >
              {charCount} / {MAX_CHARS}
            </span>
          </div>

          {/* Character progress bar */}
          <div className="w-full h-1 rounded-full bg-gray-100 mb-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-200 ${
                charPercent >= 100 ? "bg-red-400" :
                charPercent >= 80  ? "bg-amber-400" :
                "bg-emerald-400"
              }`}
              style={{ width: `${charPercent}%` }}
            />
          </div>

          <textarea
            id={`${formId}-review-text`}
            name="reviewText"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (errors.text) setErrors((err) => ({ ...err, text: "" }));
            }}
            rows={5}
            maxLength={MAX_CHARS}
            placeholder="Share your honest experience — packaging quality, sustainability, product effectiveness..."
            aria-describedby={errors.text ? `${formId}-text-err` : undefined}
            aria-invalid={!!errors.text}
            className={[
              "w-full px-4 py-3 rounded-xl border text-sm text-gray-800 placeholder-gray-400",
              "resize-none leading-relaxed transition-all duration-200 outline-none",
              "focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400",
              errors.text
                ? "border-red-400 bg-red-50 focus:ring-red-200"
                : "border-gray-200 bg-gray-50 hover:border-gray-300",
            ].join(" ")}
          />
          <span id={`${formId}-text-err`}>
            <FieldError msg={errors.text} />
          </span>
        </div>

        {/* ── Sustainability Tags ── */}
        <SustainabilityTags selected={tags} onChange={setTags} />

        {/* ── Anonymous Toggle ── */}
        <label
          htmlFor={`${formId}-anon-toggle`}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* Custom checkbox */}
          <div className="relative shrink-0">
            <input
              id={`${formId}-anon-toggle`}
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-10 h-6 bg-gray-200 rounded-full peer-checked:bg-indigo-500 transition-colors duration-200" />
            <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-4" />
          </div>
          {/* Label text */}
          <div className="flex items-center gap-2">
            <FiEyeOff className="w-4 h-4 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            <span className="text-sm font-medium text-gray-600">
              Post as <span className="font-semibold text-gray-800">Anonymous</span>
            </span>
          </div>
          {isAnonymous && (
            <span className="ml-auto text-[10px] font-semibold text-indigo-500 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
              Your name will be hidden
            </span>
          )}
        </label>

        {/* ── Submit button ── */}
        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className={[
            "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl",
            "text-white font-bold text-sm tracking-wide transition-all duration-200",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2",
            loading
              ? "bg-emerald-400 cursor-not-allowed opacity-70"
              : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md hover:shadow-lg hover:shadow-emerald-200 active:scale-[0.98]",
          ].join(" ")}
        >
          {loading ? (
            <>
              <FiLoader className="animate-spin w-4 h-4" />
              Submitting…
            </>
          ) : (
            <>
              <FiSend className="w-4 h-4" />
              Submit Review
            </>
          )}
        </button>

        {/* Moderation notice */}
        <p className="text-center text-xs text-gray-400">
          All reviews go through AI-assisted moderation before appearing publicly.
        </p>
      </form>
    </div>
  );
}
