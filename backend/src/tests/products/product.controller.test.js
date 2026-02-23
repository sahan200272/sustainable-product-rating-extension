import mongoose from "mongoose";
import request from "supertest";
import dotenv from "dotenv";
import app from "../../server.js";

// Load environment variables
dotenv.config();

beforeAll(async () => {
    const mongoURI = process.env.MONGODB_URL_TEST;
    await mongoose.connect(mongoURI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("Create Product API", () => {

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

    //console.log("response body : ", response.body);

    expect(response.statusCode).toBe(201);
    expect(response.body.data.name).toBe("Eco Bottle");
    expect(response.body.message).toBe("Product created successfully");
  });

});