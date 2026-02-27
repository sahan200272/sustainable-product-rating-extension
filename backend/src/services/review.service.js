import Review from "../models/review.model.js";
import Product from "../models/product.js";
import User from "../models/user.js";
import { analyzeToxicity } from "./moderation.service.js";
import recalculateProductRating from "../utils/recalculateProductRating.js";

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

  // Check for duplicate review (will throw error if unique constraint violated)
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

  // Call AI moderation
  const toxicityScore = await analyzeToxicity(data.reviewText);

  let status = "PENDING";

  if (toxicityScore < 0.2) {
    status = "APPROVED";
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

export const getApprovedReviews = async (productId) => {
  const reviews = await Review.find({
    product: productId,
    status: "APPROVED"
  })
    .populate("user", "firstName lastName profilePicture")
    .sort({ createdAt: -1 });

  return reviews;
};

export const getPendingReviews = async () => {
  const reviews = await Review.find({ status: "PENDING" })
    .populate("user", "firstName lastName email")
    .populate("product", "name brand")
    .sort({ createdAt: -1 });

  return reviews;
};

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

  // If review was previously approved, recalculate product rating
  if (previousStatus === "APPROVED") {
    await recalculateProductRating(review.product);
  }

  return review;
};

export const deleteReview = async (reviewId, userId, userRole) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new Error("Review not found");
  }

  // Check if user is owner or admin
  const isOwner = review.user.toString() === userId.toString();
  const isAdmin = userRole === "Admin";

  if (!isOwner && !isAdmin) {
    throw new Error("You don't have permission to delete this review");
  }

  const wasApproved = review.status === "APPROVED";
  const productId = review.product;

  await Review.findByIdAndDelete(reviewId);

  // If deleted review was approved, recalculate product rating
  if (wasApproved) {
    await recalculateProductRating(productId);
  }

  return { message: "Review deleted successfully" };
};