import { jest } from "@jest/globals";

jest.setTimeout(30000);

// Mock Gemini BEFORE imports
jest.unstable_mockModule("../../utils/geminiClient.js", () => ({
  geminiModel: {
    generateContent: jest.fn().mockResolvedValue({
      response: {
        text: () => "Mocked AI verdict"
      }
    })
  }
}));

// Mock Auth Middleware to facilitate testing protected routes
jest.unstable_mockModule("../../middlewares/authMiddleware.js", () => ({
  authenticate: (req, res, next) => {
    req.user = { id: "60d0fe4f5311236168a109ca", role: "Customer" };
    next();
  },
  optionalAuthenticate: (req, res, next) => {
    req.user = { id: "60d0fe4f5311236168a109ca", role: "Customer" };
    next();
  },
  isAdmin: (req, res, next) => {
    req.user = { id: "60d0fe4f5311236168a109cb", role: "Admin" };
    next();
  },
  isCustomer: (req, res, next) => {
    req.user = { id: "60d0fe4f5311236168a109ca", role: "Customer" };
    next();
  },
  authorizeRoles: (...roles) => (req, res, next) => {
    req.user = { id: "60d0fe4f5311236168a109ca", role: "Customer" };
    next();
  }
}));

const mongoose = await import("mongoose");
const request = (await import("supertest")).default;
const dotenv = (await import("dotenv")).default;
const app = (await import("../../server.js")).default;
const Product = (await import("../../models/product.js")).default;
const Comparison = (await import("../../models/comparison.js")).default;

dotenv.config({ path: ".env.test" });

let product1, product2;
let testUserId = "60d0fe4f5311236168a109ca";

beforeAll(async () => {
  if (mongoose.default.connection.readyState === 0) {
    await mongoose.default.connect(process.env.MONGODB_URL_TEST || "mongodb://localhost:27017/test");
  }

  await Product.deleteMany({});
  await Comparison.deleteMany({});

  product1 = await Product.create({
    _id: new mongoose.default.Types.ObjectId(),
    name: "Eco Bottle",
    brand: "GreenLife",
    category: "Kitchen",
    sustainabilityScore: 80,
    sustainability: {
      recyclableMaterial: true,
      biodegradable: false,
      plasticFree: true,
      carbonFootprint: 2,
      crueltyFree: true,
      fairTradeCertified: true,
      renewableEnergyUsed: true,
      energyEfficiencyRating: 4
    }
  });

  product2 = await Product.create({
    _id: new mongoose.default.Types.ObjectId(),
    name: "Plastic Bottle",
    brand: "CheapCo",
    category: "Kitchen",
    sustainabilityScore: 40,
    sustainability: {
      recyclableMaterial: false,
      biodegradable: false,
      plasticFree: false,
      carbonFootprint: 8,
      crueltyFree: false,
      fairTradeCertified: false,
      renewableEnergyUsed: false,
      energyEfficiencyRating: 2
    }
  });
});

afterAll(async () => {
  await Product.deleteMany({});
  await Comparison.deleteMany({});
  await mongoose.default.connection.close();
});

describe("Comparison API", () => {

  test("POST /items should compare products and save to history", async () => {
    const res = await request(app)
      .post("/api/comparisons/items")
      .send({
        productId1: product1._id.toString(),
        productId2: product2._id.toString()
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.products).toHaveLength(2);
    expect(res.body.data.comparisonScore.product1Score).toBe(80);
    expect(res.body.data.comparisonScore.product2Score).toBe(40);
    expect(res.body.data._id).toBeDefined(); // Saved ID
  });

  test("GET /items should return comparison history", async () => {
    const res = await request(app).get("/api/comparisons/items");
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  test("should fail when IDs missing", async () => {
    const res = await request(app)
      .post("/api/comparisons/items")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Both product IDs are required");
  });

  test("should fail invalid ObjectId", async () => {
    const res = await request(app)
      .post("/api/comparisons/items")
      .send({
        productId1: "123",
        productId2: "456"
      });

    expect(res.statusCode).toBe(400);
  });

});

describe("Quick Compare API", () => {

  test("GET /quick should compare by name prefix", async () => {
    const res = await request(app)
      .get("/api/comparisons/quick")
      .query({
        name1: "Eco",
        name2: "Plastic"
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.comparisonScore).toBeDefined();
    expect(res.body.data.products[0].name).toContain("Eco");
  });

});

describe("Comparison Detail & Management", () => {
  let comparisonId;

  beforeAll(async () => {
    const comp = await Comparison.create({
      user: testUserId,
      products: [product1._id, product2._id],
      comparisonScore: {
        product1Score: 80,
        product2Score: 40,
        winner: product1._id,
        scoreDifference: 40
      }
    });
    comparisonId = comp._id.toString();
  });

  test("GET /items/:id should return comparison details", async () => {
    const res = await request(app).get(`/api/comparisons/items/${comparisonId}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(comparisonId);
  });

  test("DELETE /items/:id should delete comparison", async () => {
    const res = await request(app).delete(`/api/comparisons/items/${comparisonId}`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    
    const check = await Comparison.findById(comparisonId);
    expect(check).toBeNull();
  });

});

describe("Admin Statistics", () => {

  test("GET /stats should return comparison analytics", async () => {
    const res = await request(app).get("/api/comparisons/stats");
    
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.totalComparisons).toBeDefined();
    expect(res.body.data.mostComparedProducts).toBeDefined();
  });

});