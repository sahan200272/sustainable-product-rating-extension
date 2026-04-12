// Import Product model
import Product from "../models/product.js";

// Import Cloudinary upload utility
import cloudinaryUpload from "../utils/cloudinaryUpload.js";

// Import AI functions for sustainability analysis
import { generateSustainability, generateSustainabilityData } from "./ai.service.js";

// Import sustainability score calculator
import calculateSustainabilityScore from "../utils/calculateSustainabilityScore.js";


// CREATE PRODUCT
export const createProduct = async (data) => {
  try {
    // Basic input validation
    if (!data || typeof data !== "object") {
      throw new Error("Invalid product data");
    }

    // Calculate sustainability score from form data
    if (data.sustainability) {
      data.sustainabilityScore = calculateSustainabilityScore(data.sustainability);
    }

    // Generate AI-based sustainability score and description
    const AISustainability = await generateSustainabilityData(data);

    // Attach AI results to product data
    data.aiSustainablityScore = AISustainability.score;
    data.aiSustainabilityDescription = AISustainability.analysis;

    // Create new Product instance
    const newProduct = new Product(data);

    // Save product to database
    const savedProduct = await newProduct.save();

    return savedProduct;

  } catch (error) {
    console.error("Product Service Error:", error.message);

    // Throw error so controller can handle HTTP response
    throw error;
  }
};


// GET ALL PRODUCTS
export const getAllProducts = async () => {
  try {
    // Fetch all products from database
    // .lean() returns plain JavaScript objects instead of Mongoose documents
    const products = await Product.find().lean();

    return products;

  } catch (error) {
    console.error("[ProductService] getAllProducts Error:", error.message);

    // Re-throw error for controller handling
    throw new Error("Failed to fetch products");
  }
};


// GET TOP PRODUCTS
export const getTopProducts = async () => {
  try {
    // Sort products by sustainabilityScore in descending order and limit to 4
    const products = await Product.find()
      .sort({ sustainabilityScore: -1 })
      .limit(4)
      .lean();

    return products;

  } catch (error) {
    console.error("[ProductService] getTopProducts Error:", error.message);
    throw new Error("Failed to fetch top products");
  }
};


// GET SINGLE PRODUCT BY ID
export const getSingleProduct = async (id) => {
  try {
    // Find product using MongoDB ID
    const product = await Product.findById(id);

    return product;

  } catch (error) {
    console.log("[ProductService] getSingleProduct Error:", error.message);

    throw new Error("Failed to fetch product");
  }
};


// SEARCH PRODUCTS BY NAME
export const searchProductsByName = async (searchName) => {
  try {
    // Validate search input
    if (!searchName) {
      throw new Error("Search name is required");
    }

    // Perform case-insensitive search using regular expression
    const products = await Product.find({
      name: { $regex: searchName, $options: "i" }
    }).lean();

    // If no products found in DB, call AI to generate sustainability data
    if (products.length == 0) {
      const data = await generateSustainability(searchName);
      return data;
    } else {
      return products;
    }

  } catch (error) {
    console.error("[ProductService] searchProductsByName Error:", error.message);
    throw new Error("Failed to search products");
  }
};


// UPDATE PRODUCT
export const updateProduct = async (id, data, files) => {

  // Find product by ID
  const product = await Product.findById(id);

  // If product not found, throw error
  if (!product) {
    throw new Error("Product not found");
  }

  // Parse sustainability if it comes as JSON string
  let sustainability = product.sustainability;
  if (data.sustainability && typeof data.sustainability === "string") {
    try {
      sustainability = JSON.parse(data.sustainability);
    } catch (error) {
      console.error("Failed to parse sustainability:", error);
      sustainability = product.sustainability;
    }
  } else if (data.sustainability) {
    sustainability = data.sustainability;
  }

  // Handle images: check if existingImages list is provided
  let updatedImages = product.images;
  
  // If existingImages are specified, use those as the base
  if (data.existingImages && typeof data.existingImages === "string") {
    try {
      updatedImages = JSON.parse(data.existingImages);
    } catch (error) {
      console.error("Failed to parse existingImages:", error);
      updatedImages = product.images;
    }
  } else if (data.existingImages) {
    updatedImages = data.existingImages;
  }

  // If new image files are provided, upload and append to kept images
  if (files && files.length > 0) {
    const newImages = await cloudinaryUpload(files);
    updatedImages = [...updatedImages, ...newImages];
  }

  // Update basic product fields (if new value exists)
  product.name = data.name ?? product.name;
  product.brand = data.brand ?? product.brand;
  product.category = data.category ?? product.category;
  product.description = data.description ?? product.description;

  // Update images with the new list
  product.images = updatedImages;

  // Update sustainability fields
  product.sustainability = sustainability;

  // Recalculate sustainability score based on updated sustainability data
  if (sustainability) {
    product.sustainabilityScore = calculateSustainabilityScore(sustainability);
  }

  // Save updated product
  return await product.save();
};


// DELETE PRODUCT
export const deleteProduct = async (id) => {

  // Validate ID
  if (!id) {
    throw new Error("Product id not received");
  }

  // Find and delete product
  const product = await Product.findByIdAndDelete(id);

  // If no product found
  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};