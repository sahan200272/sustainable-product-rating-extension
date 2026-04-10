/**
 * ReviewForm.jsx
 *
 * Production-level form for submitting a product review.
 * Designed to be rendered inside a Modal.
 *
 * Architecture decisions:
 *   - Reads auth state from AuthContext (no prop drilling)
 *   - Delegates API calls to reviewService (clean separation of concerns)
 *   - Child components: RatingStars, SustainabilityTags (single-responsibility)
 */

import { useState, useContext, useId } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { createReview } from "../../services/reviewService";
import RatingStars from "./RatingStars";
import SustainabilityTags from "./SustainabilityTags";
import toast from "react-hot-toast";
import {
  FiSend, FiAlertCircle, FiLock, FiLoader, FiArrowRight, FiEyeOff
} from "react-icons/fi";

const MAX_CHARS = 1000;

const FieldError = ({ msg }) =>
  msg ? (
    <p role="alert" className="flex items-center gap-1 text-xs text-red-500 mt-1 animate-[fadeIn_0.2s_ease]">
      <FiAlertCircle className="shrink-0" /> {msg}
    </p>
  ) : null;

export default function ReviewForm({ productId, onSuccess, onCancel }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const formId = useId();

  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [tags, setTags] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [errors, setErrors] = useState({ rating: "", text: "" });

  const charCount = text.length;
  const charPercent = Math.min((charCount / MAX_CHARS) * 100, 100);

  const ringColour =
    charPercent >= 100 ? "text-red-500" :
    charPercent >= 80  ? "text-amber-500" :
    "text-emerald-500";

  // Check form validity dynamically
  const isFormValid = rating > 0 && text.trim().length >= 10 && text.length <= MAX_CHARS;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        product: productId,
        overallRating: rating,
        reviewText: text.trim(),
        sustainabilityTags: tags,
        isAnonymous,
      };

      const result = await createReview(payload);
      const reviewData = result.data;
      
      if (reviewData && typeof reviewData.user !== "object") {
        reviewData.user = {
          _id: user?._id ?? user?.id,
          firstName: user?.firstName ?? "",
          lastName: user?.lastName ?? "",
          profilePicture: user?.profilePicture ?? null,
        };
      }

      // Reset form just in case
      setRating(0);
      setText("");
      setTags([]);
      setIsAnonymous(false);
      
      toast.success(result.message || "Review submitted successfully!");
      if (typeof onSuccess === "function") onSuccess(reviewData);

    } catch (err) {
      const serverMsg = err?.response?.data?.error;
      
      if (err?.response?.status === 401) {
        toast.error("Your session has expired. Please log in again.");
        if (onCancel) onCancel();
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

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-emerald-50 rounded-2xl p-8 flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
          <FiLock className="w-7 h-7 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Sign in to leave a review</h3>
          <p className="text-sm text-gray-500">
            Share your sustainability experience with the community.
          </p>
        </div>
        <button
          onClick={() => {
            if (onCancel) onCancel();
            navigate("/login");
          }}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md"
        >
          Log In <FiArrowRight />
        </button>
      </div>
    );
  }

  if (user?.role === "Admin") {
    return (
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
        <p className="text-sm text-indigo-600 font-medium">
          Admins can read but not submit reviews.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Product review form"
      className="space-y-6"
    >
      {/* User Info Header */}
      <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
        <div className="w-10 h-10 rounded-full bg-emerald-100 overflow-hidden shrink-0 flex items-center justify-center">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-emerald-600 font-bold text-lg">
              {(user?.firstName?.[0] || user?.name?.[0] || user?.email?.[0] || "?").toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Reviewing as</p>
          <p className="text-sm font-bold text-gray-900">
            {user?.firstName ? `${user.firstName} ${user.lastName}` : (user?.name || user?.email)}
          </p>
        </div>
      </div>

      {apiError && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl"
        >
          <FiAlertCircle className="text-red-500 shrink-0 w-5 h-5" />
          <p className="text-sm text-red-700">{apiError}</p>
        </div>
      )}

      {/* Star Rating */}
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

      {/* Review Text */}
      <div>
        <div className="flex justify-between items-baseline mb-2">
          <label
            htmlFor={`${formId}-review-text`}
            className="block text-sm font-semibold text-gray-700"
          >
            Your Review <span className="text-red-500">*</span>
          </label>
          <span
            aria-live="polite"
            className={`text-xs font-mono font-medium tabular-nums transition-colors ${ringColour}`}
          >
            {charCount} / {MAX_CHARS}
          </span>
        </div>
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
          placeholder="Share your experience — packaging quality, sustainability, effectiveness..."
          aria-invalid={!!errors.text}
          className={[
            "w-full px-4 py-3 rounded-xl border text-sm text-gray-800 placeholder-gray-400 bg-white shadow-sm",
            "resize-none outline-none transition-all duration-200",
            "focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 focus:bg-white",
            errors.text ? "border-red-400 bg-red-50 focus:ring-red-200" : "border-gray-200 hover:border-gray-300",
          ].join(" ")}
        />
        <FieldError msg={errors.text} />
      </div>

      {/* Sustainability Tags */}
      <SustainabilityTags selected={tags} onChange={setTags} />

      {/* Anonymous Toggle */}
      <label
        htmlFor={`${formId}-anon-toggle`}
        className="flex items-center gap-3 cursor-pointer select-none group w-max"
      >
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
        <div className="flex items-center gap-2">
          <FiEyeOff className={`w-4 h-4 transition-colors ${isAnonymous ? "text-indigo-500" : "text-gray-400"}`} />
          <span className="text-sm font-medium text-gray-600">
            Post as <span className="font-semibold text-gray-800">Anonymous</span>
          </span>
        </div>
      </label>

      {/* Submit Button */}
      <div className="pt-2 sticky sm:static bottom-0 bg-white pb-0 sm:pb-0">
        <button
          type="submit"
          disabled={loading || !isFormValid}
          aria-busy={loading}
          className={[
            "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl",
            "text-white font-bold text-sm tracking-wide transition-all duration-200 shadow-sm",
            "focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2",
            loading || !isFormValid
              ? "bg-gray-200 cursor-not-allowed shadow-none text-gray-400"
              : "bg-emerald-600 hover:bg-emerald-700 hover:shadow-md active:scale-[0.98]",
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
      </div>
    </form>
  );
}
