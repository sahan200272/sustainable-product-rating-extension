import express from "express";
import { authenticate, authorizeRoles } from "../middlewares/auth.js";
import * as reviewController from "../controllers/review.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("Customer"),
  reviewController.createReview
);

router.get("/product/:productId", reviewController.getApprovedReviews);

router.get(
  "/pending",
  authenticate,
  authorizeRoles("Admin"),
  reviewController.getPendingReviews
);

router.patch(
  "/:id/approve",
  authenticate,
  authorizeRoles("Admin"),
  reviewController.approveReview
);

router.patch(
  "/:id/reject",
  authenticate,
  authorizeRoles("Admin"),
  reviewController.rejectReview
);

export default router;