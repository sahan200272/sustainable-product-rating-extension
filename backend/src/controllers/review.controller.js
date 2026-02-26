import * as reviewService from "../services/review.service.js";

export const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(
      req.body,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      data: review
    });

  } catch (error) {
    next(error);
  }
};