import { jest } from "@jest/globals";

// Mock middlewares to prevent real auth checks during tests
jest.unstable_mockModule("../../middlewares/authMiddleware.js", () => ({
  authenticate: (req, res, next) => {
    req.user = { id: process.env.MOCK_USER_ID || "mockUserId", role: process.env.MOCK_USER_ROLE || "Customer" };
    next();
  },
  optionalAuthenticate: (req, res, next) => {
    req.user = { id: process.env.MOCK_USER_ID || "mockUserId", role: process.env.MOCK_USER_ROLE || "Customer" };
    next();
  },
  isAdmin: (req, res, next) => {
    if (process.env.MOCK_USER_ROLE === "Admin") next();
    else res.status(403).json({ error: "Access denied" });
  },
  isCustomer: (req, res, next) => {
    if (process.env.MOCK_USER_ROLE === "Customer") next();
    else res.status(403).json({ error: "Access denied" });
  },
  authorizeRoles: (...roles) => {
    return (req, res, next) => {
        const role = process.env.MOCK_USER_ROLE || "Customer";
        if (!roles.includes(role)) {
            return res.status(403).json({ success: false, error: "Access denied" });
        }
        req.user = { id: process.env.MOCK_USER_ID || "mockUserId", role: role };
        next();
    };
  }
}));

// Mock the AI service to prevent API calls
jest.unstable_mockModule("../../services/moderation.service.js", () => ({
  analyzeToxicity: jest.fn().mockResolvedValue(0.1) // Low toxicity default
}));

const { default: mongoose } = await import("mongoose");
const { default: request } = await import("supertest");
const { default: dotenv } = await import("dotenv");
const { default: app } = await import("../../server.js");

dotenv.config({ path: '.env.test' });

describe("Review API Integration Tests", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL_TEST);
  });

  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.collection("reviews").deleteMany({}); // Cleanup test collection
      await mongoose.connection.db.collection("products").deleteMany({});
      await mongoose.connection.db.collection("users").deleteMany({});
    }
    await mongoose.connection.close();
  });

  let mockProductId;
  let mockUserId;

  beforeEach(async () => {
      // Seed some initial data needed for tests
      const { default: Product } = await import("../../models/product.js");
      const { default: User } = await import("../../models/user.js");

      await mongoose.connection.db.collection("reviews").deleteMany({});
      await mongoose.connection.db.collection("products").deleteMany({});
      await mongoose.connection.db.collection("users").deleteMany({});

      const testUser = await User.create({
          firstName: "John",
          lastName: "Doe",
          email: "johndoe@test.com",
          password: "password123",
          phone: "1234567890",
          address: "123 Test St",
          role: "Customer"
      });
      mockUserId = testUser._id.toString();

      const testProduct = await Product.create({
          name: "Test Green Item",
          brand: "TestBrand",
          category: "Other",
          description: "Testing product"
      });
      mockProductId = testProduct._id.toString();
      
      process.env.MOCK_USER_ID = mockUserId;
      process.env.MOCK_USER_ROLE = "Customer";
  });

  describe("POST /api/reviews", () => {

    // Test Case: Successful review creation
    // Simulates a user submitting a valid product review
    it("should successfully post a new review", async () => {
      const response = await request(app)
        .post("/api/reviews")
        .send({
          product: mockProductId,
          overallRating: 5,
          reviewText: "Excellent sustainable product!"
        });

      // Status 201 indicates creation
      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(["Review submitted and approved", "Review submitted for moderation"]).toContain(response.body.message);
    });

    // Test Case: Validation Error (Missing Rating)
    it("should fail to post a review when missing the rating field", async () => {
      const response = await request(app)
        .post("/api/reviews")
        .send({
          product: mockProductId,
          reviewText: "Great!"
          // missing overallRating
        });
      
      expect(response.statusCode).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/Missing required fields/i); 
    });

  });

  describe("GET /api/reviews/product/:productId", () => {
      
      // Test Case: Retrieve reviews
      // Ensures the endpoint correctly fetches reviews for a specific product
      it("should get reviews for a product", async () => {
          // Pre-populate an approved review
          const { default: Review } = await import("../../models/review.model.js");
          await Review.create({
              product: mockProductId,
              user: mockUserId,
              reviewText: "Sample review",
              overallRating: 4,
              status: "APPROVED"
          });

          const response = await request(app)
             .get(`/api/reviews/product/${mockProductId}`);
             
          expect(response.statusCode).toBe(200);
          expect(response.body.success).toBe(true);
          expect(response.body.count).toBe(1);
          expect(response.body.data[0].reviewText).toBe("Sample review");
      });
  });
});
