import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/authMiddleware.js";
import * as reviewController from "../controllers/review.controller.js";

const reviewRouter = express.Router();

reviewRouter.post(
  "/",
  authenticate,
  authorizeRoles("Customer"),
  reviewController.createReview
);

reviewRouter.get("/product/:productId", reviewController.getApprovedReviews);

reviewRouter.get(
  "/pending",
  authenticate,
  authorizeRoles("Admin"),
  reviewController.getPendingReviews
);

reviewRouter.patch(
  "/:id/approve",
  authenticate,
  authorizeRoles("Admin"),
  reviewController.approveReview
);

reviewRouter.patch(
  "/:id/reject",
  authenticate,
  authorizeRoles("Admin"),
  reviewController.rejectReview
);

reviewRouter.delete(
  "/:id",
  authenticate,
  authorizeRoles("Customer", "Admin"),
  reviewController.deleteReview
);

export default reviewRouter;