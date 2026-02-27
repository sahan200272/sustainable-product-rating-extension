import Review from "../models/review.model.js";
import Product from "../models/product.js";

const recalculateProductRating = async (productId) => {

  const approvedReviews = await Review.find({
    product: productId,
    status: "APPROVED"
  });

  const total = approvedReviews.length;

  if (total === 0) {
    await Product.findByIdAndUpdate(productId, {
      averageUserRating: 0,
      totalApprovedReviews: 0
    });
    return;
  }

  const sum = approvedReviews.reduce(
    (acc, review) => acc + review.overallRating,
    0
  );

  const average = sum / total;

  await Product.findByIdAndUpdate(productId, {
    averageUserRating: average,
    totalApprovedReviews: total
  });
};

export default recalculateProductRating;