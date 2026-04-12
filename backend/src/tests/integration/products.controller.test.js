import { jest } from "@jest/globals";

// Mock AI service BEFORE importing app or mongoose
jest.unstable_mockModule("../../services/ai.service.js", () => ({
  generateSustainabilityData: jest.fn().mockResolvedValue({
    score: 80,
    analysis: "Mocked AI analysis"
  }),
  generateSustainability: jest.fn().mockResolvedValue({
    score: 80,
    analysis: "Mocked AI analysis"
  })
}));

// Use dynamic imports for modules that depend on the mocks
const { default: mongoose } = await import("mongoose");
const { default: request } = await import("supertest");
const { default: dotenv } = await import("dotenv");
const { default: app } = await import("../../server.js");

// Load environment variables from .env.test file
dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  const mongoURI = process.env.MONGODB_URL_TEST;
  await mongoose.connect(mongoURI);
});

afterAll(async () => {
  // Clear only the products collection BEFORE closing connection
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.collection("products").deleteMany({});
  }
  await mongoose.connection.close();
});

describe("Product API Integration Tests", () => {

  describe("POST /api/products", () => {

    it("should create a product successfully", async () => {
      const response = await request(app)
        .post("/api/products")
        .send({
          name: "Eco Bottle",
          brand: "GreenLife",
          category: "Kitchen",
          description: "Reusable bottle",
          sustainability: {
            recyclableMaterial: true,
            biodegradable: false,
            plasticFree: true,
            carbonFootprint: 12,
            crueltyFree: true,
            fairTradeCertified: true,
            renewableEnergyUsed: true,
            energyEfficiencyRating: 4
          },
          sustainabilityScore: 80
        });

      expect(response.statusCode).toBe(201);
      expect(response.body.data.name).toBe("Eco Bottle");
      expect(response.body.message).toBe("Product created successfully");
    });

    it("should fail when required fields are missing", async () => {
      const res = await request(app).post("/api/products").send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Missing required fields");
    });

  });

  describe("GET /api/products", () => {

    it("should retrieve all products", async () => {
      const response = await request(app).get("/api/products");

      expect(response.statusCode).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Products retrieved successfully");
    });
  });

});