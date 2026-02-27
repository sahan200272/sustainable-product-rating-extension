// Service for managing product reviews including creation, moderation, and CRUD operations
import Review from "../models/review.model.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { analyzeToxicity } from "./moderation.service.js";
import recalculateProductRating from "../utils/recalculateProductRating.js";

// Creates a new review with AI-based toxicity moderation
// Auto-approves reviews with low toxicity scores
export const createReview = async (data, userId) => {
  // Validate required fields
  if (!data.product || !data.reviewText || !data.overallRating) {
    throw new Error("Missing required fields: product, reviewText, overallRating");
  }

  if (data.overallRating < 1 || data.overallRating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  // Check if user is blocked
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.isBlocked) {
    throw new Error("You are blocked from submitting reviews");
  }

  // Check for duplicate review from same user on same product
  const existingReview = await Review.findOne({
    product: data.product,
    user: userId
  });

  if (existingReview) {
    throw new Error("You have already reviewed this product");
  }

  // Verify product exists
  const product = await Product.findById(data.product);
  if (!product) {
    throw new Error("Product not found");
  }

  // Call AI moderation to check for toxic content
  const toxicityScore = await analyzeToxicity(data.reviewText);

  // Auto-approve reviews with low toxicity (< 0.2)
  let status = "PENDING";

  if (toxicityScore < 0.2) {
    status = "APPROVED";
  }

  // Additional rule: Flag very low ratings (1-2 stars) for manual review
  // This helps prevent spam/fake negative reviews from auto-approving
  if (data.overallRating <= 2) {
    status = "PENDING";
  }

  const review = await Review.create({
    ...data,
    user: userId,
    toxicityScore,
    status
  });

  // If auto-approved, update product rating
  if (status === "APPROVED") {
    await recalculateProductRating(data.product);
  }

  return review;
};

// Retrieves all approved reviews for a product
export const getApprovedReviews = async (productId) => {
  const reviews = await Review.find({
    product: productId,
    status: "APPROVED"
  })
    .populate("user", "firstName lastName profilePicture")
    .sort({ createdAt: -1 });

  return reviews;
};

// Retrieves all reviews by a specific user (for "My Reviews" page)
export const getMyReviews = async (userId) => {
  const reviews = await Review.find({ user: userId })
    .populate("product", "name brand images")
    .sort({ createdAt: -1 });

  return reviews;
};

// Retrieves all pending reviews for admin moderation
export const getPendingReviews = async () => {
  const reviews = await Review.find({ status: "PENDING" })
    .populate("user", "firstName lastName email")
    .populate("product", "name brand")
    .sort({ createdAt: -1 });

  return reviews;
};

// Approves a pending review and updates product rating
export const approveReview = async (reviewId) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.status === "APPROVED") {
    throw new Error("Review is already approved");
  }

  review.status = "APPROVED";
  await review.save();

  // Recalculate product rating
  await recalculateProductRating(review.product);

  return review;
};

// Rejects a review with optional admin comment
export const rejectReview = async (reviewId, adminComment) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  if (review.status === "REJECTED") {
    throw new Error("Review is already rejected");
  }

  const previousStatus = review.status;
  review.status = "REJECTED";
  
  if (adminComment) {
    review.adminComment = adminComment;
  }
  
  await review.save();

  // Recalculate rating only if the review was previously approved
  if (previousStatus === "APPROVED") {
    await recalculateProductRating(review.product);
  }

  return review;
};

// Deletes a review (owner or admin only) and updates product rating if needed
export const deleteReview = async (reviewId, userId, userRole) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  // Only review owner or admin can delete
  const isOwner = review.user.toString() === userId.toString();
  const isAdmin = userRole === "Admin";

  if (!isOwner && !isAdmin) {
    throw new Error("You don't have permission to delete this review");
  }

  const wasApproved = review.status === "APPROVED";
  const productId = review.product;

  await Review.findByIdAndDelete(reviewId);

  // Recalculate rating if deleted review was approved
  if (wasApproved) {
    await recalculateProductRating(productId);
  }

  return { message: "Review deleted successfully" };
};