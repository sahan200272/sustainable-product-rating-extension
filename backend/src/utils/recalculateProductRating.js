import Review from "../models/review.model.js";
import Product from "../models/product.js";

// Recalculates and updates a product's average rating based on approved reviews
const recalculateProductRating = async (productId) => {

  // Get all approved reviews for this product
  const approvedReviews = await Review.find({
    product: productId,
    status: "APPROVED"
  });

  const total = approvedReviews.length;

  // If no approved reviews, reset rating to 0
  if (total === 0) {
    await Product.findByIdAndUpdate(productId, {
      averageUserRating: 0,
      totalApprovedReviews: 0
    });
    return;
  }

  // Calculate sum of all ratings
  const sum = approvedReviews.reduce(
    (acc, review) => acc + review.overallRating,
    0
  );

  // Calculate average rating
  const average = sum / total;

  // Update product with new rating and review count
  await Product.findByIdAndUpdate(productId, {
    averageUserRating: average,
    totalApprovedReviews: total
  });
};

export default recalculateProductRating;