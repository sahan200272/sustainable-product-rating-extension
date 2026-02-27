import * as reviewService from "../services/review.service.js";

export const createReview = async (req, res, next) => {
  try {
    const review = await reviewService.createReview(
      req.body,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      data: review,
      message: review.status === "APPROVED" 
        ? "Review submitted and approved" 
        : "Review submitted for moderation"
    });

  } catch (error) {
    if (error.message.includes("required fields") || 
        error.message.includes("Rating must") ||
        error.message.includes("already reviewed")) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    if (error.message.includes("blocked")) {
      return res.status(403).json({
        success: false,
        error: error.message
      });
    }

    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    next(error);
  }
};

export const getApprovedReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getApprovedReviews(
      req.params.productId
    );

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });

  } catch (error) {
    next(error);
  }
};

export const getPendingReviews = async (req, res, next) => {
  try {
    const reviews = await reviewService.getPendingReviews();

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });

  } catch (error) {
    next(error);
  }
};

export const approveReview = async (req, res, next) => {
  try {
    const review = await reviewService.approveReview(req.params.id);

    return res.status(200).json({
      success: true,
      data: review,
      message: "Review approved successfully"
    });

  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    if (error.message.includes("already")) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    next(error);
  }
};

export const rejectReview = async (req, res, next) => {
  try {
    const review = await reviewService.rejectReview(
      req.params.id,
      req.body.adminComment
    );

    return res.status(200).json({
      success: true,
      data: review,
      message: "Review rejected successfully"
    });

  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    if (error.message.includes("already")) {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const result = await reviewService.deleteReview(
      req.params.id,
      req.user.id,
      req.user.role
    );

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    if (error.message.includes("not found")) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    if (error.message.includes("permission")) {
      return res.status(403).json({
        success: false,
        error: error.message
      });
    }

    next(error);
  }
};