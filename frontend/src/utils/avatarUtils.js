/**
 * avatarUtils.js — shared avatar URL sanitization utilities.
 *
 * Google profile picture URLs from lh3.googleusercontent.com are public
 * but can be unreliable if the size parameter is missing or set too large.
 * This utility normalises them and screens out known placeholder URLs so
 * components always get either a clean, loadable URL or null (→ show initials).
 */

// ── Placeholder / Default image detection ─────────────────────────────────

/**
 * URL fragments that identify a "no real photo" placeholder.
 * Matches the vecteezy default stored by the backend, plus other common cases.
 */
const PLACEHOLDER_PATTERNS = [
    "vecteezy.com",          // Backend default avatar host
    "default-avatar",
    "/placeholder",
    "gravatar.com/avatar/0", // Gravatar mystery-man (hash = 0)
    "example.com",
];

/**
 * Returns true if the URL is empty, not a string, or points to a known
 * placeholder image — meaning we should show the initials fallback instead.
 *
 * @param {string|null|undefined} url
 * @returns {boolean}
 */
export function isPlaceholderUrl(url) {
    if (!url || typeof url !== "string" || url.trim() === "") return true;
    return PLACEHOLDER_PATTERNS.some((p) => url.includes(p));
}

// ── Google profile picture sanitization ───────────────────────────────────

const GOOGLE_HOSTS = ["googleusercontent.com", "googleapis.com/drive"];

/**
 * Detects whether a URL is a Google-hosted profile picture.
 *
 * @param {string} url
 * @returns {boolean}
 */
function isGoogleProfileUrl(url) {
    return GOOGLE_HOSTS.some((h) => url.includes(h));
}

/**
 * Sanitizes a Google profile picture URL.
 *
 * Google's image server accepts a trailing `=s{N}-c` modifier:
 *   =s96-c  →  96 × 96 px, cropped to circle mask (fastest/smallest)
 *   =s200   →  200 px on the long edge, no crop
 *
 * Without a size param the server can return enormous images (800 px+),
 * causing slow loads and occasional 403s in some network configs.
 *
 * @param {string} url    - Raw Google URL from the database.
 * @param {number} [size] - Desired pixel size (default 96 for table rows).
 * @returns {string}      - Sanitized, reliable URL.
 */
function sanitizeGoogleUrl(url, size = 96) {
    // Strip any existing size/crop modifier (=s…, =w…, =h…, =rw, etc.)
    const base = url
        .replace(/[?&]sz=\d+/g, "")             // legacy ?sz=NNN query param
        .replace(/=(?:s\d+|w\d+|h\d+|rw)(-c)?$/, ""); // trailing =s96-c style

    return `${base}=s${size}-c`;
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Returns a sanitized, load-ready avatar URL or `null` when the caller
 * should render the initials fallback instead.
 *
 * @param {string|null|undefined} url  - Raw profile picture URL from the DB.
 * @param {number} [size=96]           - Requested image size in pixels.
 * @returns {string|null}
 */
export function sanitizeAvatarUrl(url, size = 96) {
    if (isPlaceholderUrl(url)) return null;

    if (isGoogleProfileUrl(url)) {
        return sanitizeGoogleUrl(url, size);
    }

    // For all other URLs (Cloudinary, S3, direct uploads, etc.) return as-is.
    return url;
}

// ── Deterministic avatar colour ────────────────────────────────────────────

const AVATAR_COLORS = [
    { bg: "bg-violet-500", ring: "ring-violet-400/30" },
    { bg: "bg-blue-500",   ring: "ring-blue-400/30"   },
    { bg: "bg-emerald-500",ring: "ring-emerald-400/30"},
    { bg: "bg-amber-500",  ring: "ring-amber-400/30"  },
    { bg: "bg-rose-500",   ring: "ring-rose-400/30"   },
    { bg: "bg-cyan-600",   ring: "ring-cyan-400/30"   },
    { bg: "bg-indigo-500", ring: "ring-indigo-400/30" },
    { bg: "bg-teal-600",   ring: "ring-teal-400/30"   },
];

/**
 * Derives a stable background colour from an email string.
 * Uses a multiplicative string hash so the colour is consistent across
 * all renders and doesn't change when the user list is re-sorted.
 *
 * @param {string} [email=""]
 * @returns {{ bg: string, ring: string }}
 */
export function getAvatarColor(email = "") {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

/**
 * Returns the uppercase initials for a user (max 2 chars).
 *
 * @param {{ firstName?: string, lastName?: string }} user
 * @returns {string}
 */
export function getInitials({ firstName = "", lastName = "" }) {
    return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() || "?";
}
