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

/**
 * Get all products from database
 * @returns {Promise<Array>} List of products
 */
export const getAllProducts = async () => {
  try {
    const products = await Product.find().lean();

    return products;
  } catch (error) {
    console.error("[ProductService] getAllProducts Error:", error.message);

    // Re-throwing error so controller can handle response
    throw new Error("Failed to fetch products");
  }
};