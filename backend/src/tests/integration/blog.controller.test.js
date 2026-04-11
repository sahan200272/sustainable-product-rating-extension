import { jest } from "@jest/globals";

// Mock auth middleware for protected routes
jest.unstable_mockModule("../../middlewares/authMiddleware.js", () => ({
  authenticate: (req, _res, next) => {
    req.user = {
      id: process.env.MOCK_USER_ID || "507f1f77bcf86cd799439011",
      role: process.env.MOCK_USER_ROLE || "Customer"
    };
    next();
  },
  optionalAuthenticate: (req, _res, next) => {
    req.user = {
      id: process.env.MOCK_USER_ID || "507f1f77bcf86cd799439011",
      role: process.env.MOCK_USER_ROLE || "Customer"
    };
    next();
  },
  isAdmin: (req, res, next) => {
    if ((process.env.MOCK_USER_ROLE || "Customer") === "Admin") {
      return next();
    }
    return res.status(403).json({ error: "Admin access required" });
  },
  isCustomer: (req, res, next) => {
    if ((process.env.MOCK_USER_ROLE || "Customer") === "Customer") {
      return next();
    }
    return res.status(403).json({ error: "Customer access required" });
  },
  authorizeRoles: (...roles) => {
    return (req, res, next) => {
      const role = process.env.MOCK_USER_ROLE || "Customer";
      if (!roles.includes(role)) {
        return res.status(403).json({ error: "Access forbidden: insufficient permissions" });
      }
      req.user = {
        id: process.env.MOCK_USER_ID || "507f1f77bcf86cd799439011",
        role
      };
      next();
    };
  }
}));

// Mock AI service used by blog service/controller
const mockModerateBlogContent = jest.fn();
jest.unstable_mockModule("../../services/blog-ai.service.js", () => ({
  moderateBlogContent: mockModerateBlogContent,
  testGeminiConnection: jest.fn().mockResolvedValue("ok"),
  generateEducationGuide: jest.fn().mockResolvedValue({ summary: "guide" })
}));

const { default: mongoose } = await import("mongoose");
const { default: request } = await import("supertest");
const { default: dotenv } = await import("dotenv");
const { default: app } = await import("../../server.js");
const { default: Blog } = await import("../../models/blog.js");
const { default: User } = await import("../../models/user.js");

dotenv.config({ path: ".env.test" });

describe("Blog API Integration Tests", () => {
  let mockUserId;

  // Connect to test database once before all tests.
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL_TEST);
  });

  // Clean up test data and close DB connection after tests.
  afterAll(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.collection("blogs").deleteMany({});
      await mongoose.connection.db.collection("users").deleteMany({});
    }
    await mongoose.connection.close();
  });

  // Reset test data and prepare mock user before each test.
  beforeEach(async () => {
    mockModerateBlogContent.mockResolvedValue({
      flagged: false,
      score: 0,
      reasons: []
    });

    await mongoose.connection.db.collection("blogs").deleteMany({});
    await mongoose.connection.db.collection("users").deleteMany({});

    const user = await User.create({
      firstName: "Jane",
      lastName: "Tester",
      email: `jane_${Date.now()}@test.com`,
      password: "password123",
      phone: "0771234567",
      address: "123 Green Street",
      role: "Customer"
    });

    mockUserId = user._id.toString();
    process.env.MOCK_USER_ID = mockUserId;
    process.env.MOCK_USER_ROLE = "Customer";
  });

  // Validate create blog endpoint behavior.
  describe("POST /api/blogs", () => {
    it("should create a blog and return pending approval message", async () => {
      const response = await request(app).post("/api/blogs").send({
        title: "How to Reduce Plastic Waste",
        content: "Switch to reusable bottles and bags.",
        category: "Responsible Consumption",
        tags: ["plastic", "reuse"]
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toBe("Blog created successfully and is pending approval");
      expect(response.body.blog.title).toBe("How to Reduce Plastic Waste");
      expect(response.body.blog.status).toBe("PENDING");
    });

    it("should fail when required fields are missing", async () => {
      const response = await request(app).post("/api/blogs").send({
        title: "Incomplete blog"
      });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe("Title, content, and category are required");
    });
  });

  // Validate published blog listing endpoint behavior.
  describe("GET /api/blogs", () => {
    it("should return only published blogs", async () => {
      await Blog.create([
        {
          title: "Published Blog",
          content: "Visible to public",
          category: "Greenwashing",
          author: mockUserId,
          status: "PUBLISHED",
          publishedAt: new Date()
        },
        {
          title: "Pending Blog",
          content: "Should not be visible",
          category: "Greenwashing",
          author: mockUserId,
          status: "PENDING"
        }
      ]);

      const response = await request(app).get("/api/blogs");

      expect(response.statusCode).toBe(200);
      expect(response.body.total).toBe(1);
      expect(response.body.blogs).toHaveLength(1);
      expect(response.body.blogs[0].title).toBe("Published Blog");
    });
  });
});