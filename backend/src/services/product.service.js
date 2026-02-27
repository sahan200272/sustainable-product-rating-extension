import Product from "../models/product.js";
import cloudinaryUpload from "../utils/cloudinaryUpload.js";
import { generateSustainabilityData } from "./ai.service.js";

export const createProduct = async (data) => {
  try {
    // Basic input check
    if (!data || typeof data !== "object") {
      throw new Error("Invalid product data");
    }

    const AISustainability = await generateSustainabilityData(data);
    //console.log("AI Sus ", AISustainability);

    data.aiSustainablityScore = AISustainability.score;
    data.aiSustainabilityDescription = AISustainability.analysis;

    //console.log(data);

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

export const getSingleProduct = async (id) => {
  try {

    const product = await Product.findById(id);

    return product;

  } catch (error) {
    console.log("[ProductService] getSingleProduct Error:", error.message);

    throw new Error("Failed to fetch product");
  }
}

/**
 * Search products by name
 * @param {string} searchName - The product name to search for
 * @returns {Promise<Array>} List of matching products
 */
export const searchProductsByName = async (searchName) => {
  try {
    if (!searchName) {
      throw new Error("Search name is required");
    }

    // Case-insensitive search using regex (regular expression)
    const products = await Product.find({
      name: { $regex: searchName, $options: "i" }
    }).lean();

    return products;

  } catch (error) {
    console.error("[ProductService] searchProductsByName Error:", error.message);
    throw new Error("Failed to search products");
  }
};

export const updateProduct = async (id, data, files) => {

  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  let updatedImages = product.images; // start with existing images

  if (files && files.length > 0) {
    const newImages = await cloudinaryUpload(files);

    // Merge old + new
    updatedImages = [...product.images, ...newImages];
  }

  product.name = data.name ?? product.name;
  product.brand = data.brand ?? product.brand;
  product.category = data.category ?? product.category;
  product.description = data.description ?? product.description;

  product.images = updatedImages;

  if (data.sustainability) {
    product.sustainability.recyclableMaterial =
      data.sustainability.recyclableMaterial ?? product.sustainability.recyclableMaterial;

    product.sustainability.biodegradable =
      data.sustainability.biodegradable ?? product.sustainability.biodegradable;

    product.sustainability.plasticFree =
      data.sustainability.plasticFree ?? product.sustainability.plasticFree;

    product.sustainability.carbonFootprint =
      data.sustainability.carbonFootprint ?? product.sustainability.carbonFootprint;

    product.sustainability.crueltyFree =
      data.sustainability.crueltyFree ?? product.sustainability.crueltyFree;

    product.sustainability.fairTradeCertified =
      data.sustainability.fairTradeCertified ?? product.sustainability.fairTradeCertified;

    product.sustainability.renewableEnergyUsed =
      data.sustainability.renewableEnergyUsed ?? product.sustainability.renewableEnergyUsed;

    product.sustainability.energyEfficiencyRating =
      data.sustainability.energyEfficiencyRating ?? product.sustainability.energyEfficiencyRating;
  }

  return await product.save();
};

export const deleteProduct = async(id) => {

  if(!id){
    throw new Error("Product id not received");
  }

  const product = await Product.findByIdAndDelete(id);

  if(!product){
    throw new Error("Product not found");
  }

  return product;
}