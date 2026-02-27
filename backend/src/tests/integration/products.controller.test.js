import mongoose from "mongoose";
import request from "supertest";
import dotenv from "dotenv";
import app from "../../server.js";

// Load environment variables from .env.test file
dotenv.config({ path: '.env.test' });

beforeAll(async () => {
  const mongoURI = process.env.MONGODB_URL_TEST;
  await mongoose.connect(mongoURI);
});

afterAll(async () => {
  await mongoose.connection.close();

  // Clear only the products collection

  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.db.collection("products").deleteMany({});
  }
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
      //expect(res.body.error).toBeDefined();
    });

  });

  // check get all products available in DB
  describe("GET /api/products", () => {

    it("should retrieve all products", async () => {
      const response = await request(app).get("/api/products");

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Products retrieved successfully");
    });
  });

  /* describe("Update Product", () => {
    it("should update a product successfully", async () => {
      const productId = "replace_with_existing_id";
      const response = await request(app)
        .put(`/api/products/${productId}`)
        .send({ name: "Updated Name" });

      expect(response.statusCode).toBe(200);
      expect(response.body.data.name).toBe("Updated Name");
    });
  });

  describe("Delete Product", () => {
    it("should delete a product successfully", async () => {
      const productId = "replace_with_existing_id";
      const response = await request(app).delete(`/api/products/${productId}`);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe("Product deleted successfully");
    });
  }); */

});