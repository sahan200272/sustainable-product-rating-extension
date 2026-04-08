import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    overallRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    reviewText: {
      type: String,
      required: true,
      maxlength: 1000
    },

    toxicityScore: {
      type: Number
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING"
    },

    adminComment: {
      type: String
    },

    // When true the review card shows "Anonymous" regardless of the user
    isAnonymous: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true }
);

// Prevent duplicate review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);