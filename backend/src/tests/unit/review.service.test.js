import { jest } from "@jest/globals";

// Mock User Model
const mockUserFindById = jest.fn();
jest.unstable_mockModule("../../models/user.js", () => ({
  default: {
    findById: mockUserFindById
  }
}));

// Mock Product Model
const mockProductFindById = jest.fn();
jest.unstable_mockModule("../../models/product.js", () => ({
  default: {
    findById: mockProductFindById
  }
}));

// Mock Review Model
const mockReviewFindOne = jest.fn();
const mockReviewCreate = jest.fn();
const mockReviewFindById = jest.fn();
const mockReviewFindByIdAndDelete = jest.fn();
jest.unstable_mockModule("../../models/review.model.js", () => ({
  default: {
    findOne: mockReviewFindOne,
    create: mockReviewCreate,
    findById: mockReviewFindById,
    findByIdAndDelete: mockReviewFindByIdAndDelete
  }
}));

// Mock AI Moderation Service
const mockAnalyzeToxicity = jest.fn();
jest.unstable_mockModule("../../services/moderation.service.js", () => ({
  analyzeToxicity: mockAnalyzeToxicity
}));

// Mock Utility
const mockRecalculateProductRating = jest.fn();
jest.unstable_mockModule("../../utils/recalculateProductRating.js", () => ({
  default: mockRecalculateProductRating
}));

// Import the service after mocking
const { createReview, deleteReview } = await import("../../services/review.service.js");

describe("Review Service - Unit Tests", () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("createReview", () => {
        
        // Test Case: Missing fields error handling
        test("should throw an error if required fields are missing", async () => {
            await expect(createReview({ product: "123" }, "user1")).rejects.toThrow("Missing required fields");
        });

        // Test Case: Blocked User
        test("should throw an error if user is blocked", async () => {
            mockUserFindById.mockResolvedValue({ _id: "user1", isBlocked: true });
            
            const reviewData = { product: "p1", reviewText: "Bad product", overallRating: 4 };
            await expect(createReview(reviewData, "user1")).rejects.toThrow("You are blocked from submitting reviews");
        });

        // Test Case: Duplicate Review
        test("should throw an error if user already reviewed the product", async () => {
            mockUserFindById.mockResolvedValue({ _id: "user1", isBlocked: false });
            mockReviewFindOne.mockResolvedValue({ _id: "r1" }); // Existing review

            const reviewData = { product: "p1", reviewText: "Good product", overallRating: 4 };
            await expect(createReview(reviewData, "user1")).rejects.toThrow("You have already reviewed this product");
        });

        // Test Case: Successful auto-approved review
        test("should create and auto-approve a review if toxicity is low", async () => {
            mockUserFindById.mockResolvedValue({ _id: "user1", isBlocked: false });
            mockReviewFindOne.mockResolvedValue(null);
            mockProductFindById.mockResolvedValue({ _id: "p1" });
            mockAnalyzeToxicity.mockResolvedValue(0.1); // Low toxicity
            
            const mockSavedReview = {
                _id: "r1",
                status: "APPROVED",
                populate: jest.fn().mockResolvedValue(true)
            };
            mockReviewCreate.mockResolvedValue(mockSavedReview);

            const reviewData = { product: "p1", reviewText: "Amazing!", overallRating: 5 };
            const result = await createReview(reviewData, "user1");

            expect(result.status).toBe("APPROVED");
            expect(mockRecalculateProductRating).toHaveBeenCalledWith("p1");
            expect(mockSavedReview.populate).toHaveBeenCalled();
        });

        // Test Case: Pending review due to low rating
        test("should mark review as pending if rating is 2 or lower, regardless of toxicity", async () => {
            mockUserFindById.mockResolvedValue({ _id: "user1", isBlocked: false });
            mockReviewFindOne.mockResolvedValue(null);
            mockProductFindById.mockResolvedValue({ _id: "p1" });
            mockAnalyzeToxicity.mockResolvedValue(0.1); // Low toxicity
            
            const mockSavedReview = {
                _id: "r1",
                status: "PENDING",
                populate: jest.fn().mockResolvedValue(true)
            };
            mockReviewCreate.mockResolvedValue(mockSavedReview);

            const reviewData = { product: "p1", reviewText: "Not good", overallRating: 2 };
            const result = await createReview(reviewData, "user1");

            // Since it's marked as pending, we expect it to not call recalculate or at least send PENDING
            expect(mockReviewCreate).toHaveBeenCalledWith(expect.objectContaining({ status: "PENDING" }));
            expect(mockRecalculateProductRating).not.toHaveBeenCalled();
        });
    });

    describe("deleteReview", () => {

        // Test Case: Owner deletion
        test("should allow the review owner to delete the review", async () => {
            const reviewId = "r1";
            const userId = "user1";
            
            mockReviewFindById.mockResolvedValue({
                _id: reviewId,
                user: { toString: () => userId }, // owner
                status: "APPROVED",
                product: "p1"
            });

            const result = await deleteReview(reviewId, userId, "Customer");

            expect(mockReviewFindByIdAndDelete).toHaveBeenCalledWith(reviewId);
            expect(mockRecalculateProductRating).toHaveBeenCalledWith("p1");
            expect(result.message).toBe("Review deleted successfully");
        });

        // Test Case: Unauthorized deletion attempt
        test("should throw an error if a non-owner non-admin tries to delete", async () => {
             mockReviewFindById.mockResolvedValue({
                _id: "r1",
                user: { toString: () => "owner_user" }
            });

            await expect(deleteReview("r1", "other_user", "Customer")).rejects.toThrow("You don't have permission to delete this review");
        });
    });

});
