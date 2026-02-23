import mongoose from "mongoose";
import request from "supertest";
import dotenv from "dotenv";
import app from "../../../server.js";

// Load environment variables
dotenv.config();

beforeAll(async () => {
  const mongoURI = process.env.MONGODB_URL_TEST;
  await mongoose.connect(mongoURI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Product API", () => {

  describe("Create Product", () => {

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
  });

  // check get all products available in DB
  describe("Get Products", () => {

    it("should get all products successfully", async () => {
      const response = await request(app).get("/api/products");

      expect(response.statusCode).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Products retrieved successfully");
    });

    it("should get single product by ID", async () => {
      const productId = "699bd0a0c0d59b43465538aa";
      const response = await request(app).get(`/api/products/${productId}`);

      expect(response.statusCode).toBe(201);
      expect(response.body.data._id).toBe(productId);
      expect(response.body.message).toBe("Product retrieved successfully");
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