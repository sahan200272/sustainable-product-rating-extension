import Product from "../models/product.js";

export const createProduct = async (data) => {
  try {
    // Basic input check
    if (!data || typeof data !== "object") {
      throw new Error("Invalid product data");
    }

    // Create product instance
    const newProduct = new Product(data);

    // Save instance to database
    const savedProduct = await newProduct.save();

    return savedProduct;

  } catch (error) {
    console.error("Product Service Error:", error.message);
    throw error; // let controller handle HTTP response
  }
};