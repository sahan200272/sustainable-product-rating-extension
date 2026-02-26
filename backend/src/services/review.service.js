import Review from "../models/review.model.js";
import Product from "../models/product.js";
import { analyzeToxicity } from "./moderation.service.js";
import recalculateProductRating from "../utils/recalculateProductRating.js";

export const createReview = async (data, userId) => {

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