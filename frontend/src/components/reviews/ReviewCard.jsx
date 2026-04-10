/**
 * ReviewCard.jsx
 *
 * Displays a single product review in a polished card layout.
 *
 * Author resolution priority:
 *   1. If review.isAnonymous === true  → display "Anonymous" with grey avatar
 *   2. If review.user is populated     → display firstName + lastName + profilePicture
 *   3. Fallback                        → "Anonymous"
 *
 * Features:
 *   - Real profile picture with graceful error fallback to initials avatar
 *   - Colour-coded initials avatar when no image is available
 *   - Read-only star display via RatingStars
 *   - Status badge (PENDING / APPROVED / REJECTED) — only shown to the review owner
 *   - Sustainability tags shown as compact chips
 *   - Relative timestamp (e.g. "3 days ago")
 *   - Soft entrance animation on mount
 *   - Custom delete confirmation modal (no window.confirm)
 *
 * Props:
 *   review        {object}          – Review document from the API
 *   currentUserId {string|null}     – Logged-in user's ID (to show delete/status)
 *   currentRole   {string|null}     – "Admin" | "Customer" | null
 *   onDelete      {(id)=>void}      – Called when user confirms deletion
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import RatingStars from "./RatingStars";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { FiTrash2, FiClock, FiLoader, FiUser } from "react-icons/fi";
import { FaLeaf } from "react-icons/fa";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build "First Last" from a populated user object */
const fullName = (userObj) => {
  if (!userObj || typeof userObj !== "object") return "";
  const first = userObj.firstName?.trim() ?? "";
  const last  = userObj.lastName?.trim()  ?? "";
  return [first, last].filter(Boolean).join(" ");
};

/** Generate up-to-2-letter initials from a full name string */
const initials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

/** Relative time formatter */
const relativeTime = (dateStr) => {
  const diff = (new Date(dateStr) - Date.now()) / 1000;
  const abs  = Math.abs(diff);
  const rtf  = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (abs < 60)          return rtf.format(Math.round(diff),              "second");
  if (abs < 3600)        return rtf.format(Math.round(diff / 60),         "minute");
  if (abs < 86400)       return rtf.format(Math.round(diff / 3600),       "hour");
  if (abs < 86400 * 30)  return rtf.format(Math.round(diff / 86400),      "day");
  if (abs < 86400 * 365) return rtf.format(Math.round(diff / (86400*30)), "month");
  return rtf.format(Math.round(diff / (86400 * 365)), "year");
};

const STATUS_STYLES = {
  APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  PENDING:  "bg-amber-100  text-amber-700  border-amber-200",
  REJECTED: "bg-red-100    text-red-700    border-red-200",
};
const STATUS_LABELS = {
  APPROVED: "✓ Approved",
  PENDING:  "⏳ Pending Review",
  REJECTED: "✕ Rejected",
};

// Deterministic colour from the first character of a name
const AVATAR_COLOURS = [
  "bg-emerald-500", "bg-teal-500",   "bg-sky-500",
  "bg-indigo-500",  "bg-violet-500", "bg-pink-500",
  "bg-amber-500",   "bg-rose-500",
];
const avatarColour = (name = "") =>
  AVATAR_COLOURS[(name.charCodeAt(0) || 0) % AVATAR_COLOURS.length];

// Default profile picture URL supplied by the backend
const DEFAULT_AVATAR =
  "https://static.vecteezy.com/system/resources/thumbnails/036/280/650/small_2x/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg";

/** Returns true when the URL is the placeholder or falsy */
const isDefaultAvatar = (url) =>
  !url || url === DEFAULT_AVATAR;

// ─── Sub-component: Avatar ────────────────────────────────────────────────────

/**
 * Renders a circular avatar.
 *   - When the user is anonymous → grey icon bubble
 *   - When a real profilePicture exists → <img> with error fallback to initials
 *   - Otherwise → coloured initials bubble
 */
function Avatar({ name, imageUrl, isAnon, size = "w-11 h-11" }) {
  const [imgError, setImgError] = useState(false);

  // 1. Anonymous bubble
  if (isAnon) {
    return (
      <div
        aria-hidden
        className={`${size} rounded-full bg-gray-200 flex items-center justify-center shrink-0 ring-2 ring-white shadow-sm`}
      >
        <FiUser className="w-5 h-5 text-gray-400" />
      </div>
    );
  }

  // 2. Real profile picture (not the placeholder, and no load error)
  const hasRealImage = !isDefaultAvatar(imageUrl) && !imgError;
  if (hasRealImage) {
    return (
      <img
        src={imageUrl}
        alt={name || "Reviewer"}
        onError={() => setImgError(true)}
        className={`${size} rounded-full object-cover shrink-0 ring-2 ring-white shadow-sm`}
      />
    );
  }

  // 3. Coloured initials fallback
  const label = initials(name) || "?";
  return (
    <div
      aria-hidden
      className={`${avatarColour(name)} ${size} rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold ring-2 ring-white shadow-sm`}
    >
      {label}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReviewCard({ review, currentUserId, currentRole, onDelete }) {
  const [deleting,  setDeleting]  = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // ── Author resolution ──────────────────────────────────────────────────────
  const isAnon = review.isAnonymous === true;

  // review.user is a populated object when fetched via getApprovedReviews
  const userObj    = typeof review.user === "object" ? review.user : null;
  const authorName = isAnon ? "Anonymous" : (fullName(userObj) || "Anonymous");
  const avatarUrl  = userObj?.profilePicture ?? null;

  // Owner check: compare against populated _id or raw string id
  const isOwner =
    !!currentUserId &&
    (userObj?._id?.toString() === currentUserId ||
      review.user === currentUserId);

  const canDelete = isOwner || currentRole === "Admin";

  // ── Delete handlers ────────────────────────────────────────────────────────
  const handleDeleteClick    = () => setShowModal(true);
  const handleCancelDelete   = () => setShowModal(false);
  const handleConfirmDelete  = async () => {
    setDeleting(true);
    try {
      await onDelete(review._id);
      setShowModal(false);
    } finally {
      setDeleting(false);
    }
  };

  const textLimit = 150;
  const isLongText = review.reviewText?.length > textLimit;
  const displayText = isLongText && !isExpanded 
    ? `${review.reviewText.substring(0, textLimit)}...` 
    : review.reviewText;

  return (
    <>
      {/* ── Delete Confirmation Modal ── */}
      <DeleteConfirmModal
        isOpen={showModal}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isDeleting={deleting}
      />

      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        whileHover={{ scale: 1.02, boxShadow: "0px 10px 30px -10px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.3 }}
        className="bg-white border border-gray-100 rounded-2xl p-6 relative z-0"
      >

        {/* ── Header: avatar + meta + actions ── */}
        <div className="flex items-start gap-3.5 mb-4">

          {/* Avatar */}
          <Avatar
            name={authorName}
            imageUrl={avatarUrl}
            isAnon={isAnon}
          />

          {/* Name + timestamp */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-gray-900 truncate leading-tight">
                {authorName}
              </p>
              {/* "You" badge — only visible to the review owner, not on anon posts */}
              {isOwner && !isAnon && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-indigo-50 text-indigo-500 border border-indigo-100 rounded-full leading-none">
                  You
                </span>
              )}
              {/* Anonymous label shown to the author so they know it's their review */}
              {isOwner && isAnon && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-gray-100 text-gray-500 border border-gray-200 rounded-full leading-none">
                  Posted anonymously
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <FiClock className="w-3 h-3 shrink-0" />
              {relativeTime(review.createdAt)}
            </p>
          </div>

          {/* Right: status badge + delete */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Status badge — only visible to the review owner */}
            {isOwner && review.status && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  STATUS_STYLES[review.status] ?? ""
                }`}
              >
                {STATUS_LABELS[review.status] ?? review.status}
              </span>
            )}

            {/* Delete button */}
            {canDelete && (
              <button
                onClick={handleDeleteClick}
                disabled={deleting}
                aria-label="Delete review"
                className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors disabled:cursor-not-allowed"
              >
                {deleting
                  ? <FiLoader className="w-4 h-4 animate-spin" />
                  : <FiTrash2 className="w-4 h-4" />
                }
              </button>
            )}
          </div>
        </div>

        {/* ── Star Rating ── */}
        <div className="flex items-center gap-2 mb-3">
          <RatingStars
            rating={review.overallRating}
            readOnly
            showLabel={false}
            size="w-4 h-4"
          />
          <span className="text-sm font-bold text-gray-700">
            {Number(review.overallRating).toFixed(1)}
            <span className="text-gray-400 font-medium">/5</span>
          </span>
        </div>

        {/* ── Review text ── */}
        <div className="mb-4">
          <motion.p layout className="text-[15px] text-gray-700 leading-relaxed">
            {displayText}
          </motion.p>
          {isLongText && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors focus:outline-none"
            >
              {isExpanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        {/* ── Admin rejection comment ── */}
        {isOwner && review.status === "REJECTED" && review.adminComment && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-3">
            <p className="text-xs font-semibold text-red-600 mb-0.5">Admin Note</p>
            <p className="text-xs text-red-700">{review.adminComment}</p>
          </div>
        )}

        {/* ── Sustainability tags ── */}
        {review.sustainabilityTags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {review.sustainabilityTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full"
              >
                <FaLeaf className="w-2.5 h-2.5" />
                {tag.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        )}
      </motion.article>
    </>
  );
}
