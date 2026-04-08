/**
 * reviewService.js
 *
 * Centralised Axios-based service layer for all review-related API calls.
 * Uses the shared `api` instance which already attaches the JWT Bearer token
 * via a request interceptor, so every call here is automatically authenticated.
 *
 * Base URL is read from VITE_BACKEND_URL (set in frontend/.env).
 *
 * Available endpoints (mirror of review.routes.js):
 *   POST   /api/reviews/               → createReview         (Customer only)
 *   GET    /api/reviews/product/:id    → getReviewsByProduct  (public)
 *   GET    /api/reviews/my-reviews     → getMyReviews         (authenticated)
 *   GET    /api/reviews/recent         → getRecentReviews     (public)
 *   DELETE /api/reviews/:id            → deleteReview         (owner | admin)
 */

import api from "./api";

// ─── Submit a new review ────────────────────────────────────────────────────

/**
 * Creates a new review for a product.
 * Requires JWT (Customer role).
 *
 * @param {{ product: string, overallRating: number, reviewText: string, sustainabilityTags?: string[] }} payload
 * @returns {Promise<{ success: boolean, data: object, message: string }>}
 */
export const createReview = async (payload) => {
  const response = await api.post("/api/reviews/", payload);
  return response.data;
};

// ─── Fetch approved reviews for a product ───────────────────────────────────

/**
 * Returns all APPROVED reviews for a specific product (public).
 *
 * @param {string} productId  – MongoDB ObjectId of the product
 * @returns {Promise<{ success: boolean, count: number, data: object[] }>}
 */
export const getReviewsByProduct = async (productId) => {
  const response = await api.get(`/api/reviews/product/${productId}`);
  return response.data;
};

// ─── Fetch the logged-in user's own reviews ────────────────────────────────

/**
 * Returns all reviews submitted by the currently authenticated user.
 * Useful to show rejection reasons in the profile / review history.
 *
 * @returns {Promise<{ success: boolean, count: number, data: object[] }>}
 */
export const getMyReviews = async () => {
  const response = await api.get("/api/reviews/my-reviews");
  return response.data;
};

// ─── Fetch recent approved reviews (global) ─────────────────────────────────

/**
 * Returns the most recent globally approved reviews for homepage showcases.
 *
 * @returns {Promise<{ success: boolean, count: number, data: object[] }>}
 */
export const getRecentReviews = async () => {
  const response = await api.get("/api/reviews/recent");
  return response.data;
};

// ─── Delete a review ────────────────────────────────────────────────────────

/**
 * Deletes a review by ID. Only the owner or an Admin may do this.
 *
 * @param {string} reviewId
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/api/reviews/${reviewId}`);
  return response.data;
};
