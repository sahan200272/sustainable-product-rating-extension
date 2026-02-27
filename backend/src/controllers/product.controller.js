// Import product service layer (business logic / DB operations)
import * as productService from "../services/product.service.js";

// Utility function to calculate sustainability score
import calculateSustainabilityScore from "../utils/calculateSustainabilityScore.js";

// Utility function to upload images to Cloudinary
import cloudinaryUpload from "../utils/cloudinaryUpload.js";


// create product
export const createProduct = async (req, res, next) => {
  try {
    // Destructure required fields from request body
    const { name, brand, category, description, sustainability } = req.body;

    // Basic validation for required fields
    if (!name || !brand || !category || !description || !sustainability) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    let images = [];

    // If files exist, upload them to Cloudinary
    if (req.files && req.files.length > 0) {
      images = await cloudinaryUpload(req.files);
    }

    // Calculate sustainability score using utility function
    const score = calculateSustainabilityScore(sustainability);

    // Call service layer to create product in database
    const product = await productService.createProduct({
      name,
      brand,
      category,
      description,
      images,
      sustainability,
      sustainabilityScore: score
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    console.error("[ProductController] Create Product Error:", error.message);
    next(error); // Pass error to global error handler
  }
};


// get all products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();

    return res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: products
    });

  } catch (error) {
    console.error("[ProductController] Retrieve All Products Error:", error.message);
    next(error);
  }
};

// get single product details
export const getSingleProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await productService.getSingleProduct(id);

    return res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: product
    });

  } catch (error) {
    console.error("[ProductController] Product Retrieve Error:", error.message);
    next(error);
  }
};

// search product by name if product doesn't exist in DB use AI and give result
export const searchProducts = async (req, res, next) => {
  try {
    const { name } = req.query;

    // Validate query parameter
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search name is required"
      });
    }

    const products = await productService.searchProductsByName(name);

    // If result is normal DB result (array)
    if (Array.isArray(products)) {
      return res.status(200).json({
        success: true,
        message: `Found ${products.length} product(s) matching "${name}"`,
        count: products.length,
        data: products
      });
    }

    // If result is AI-based single object
    return res.status(200).json({
      success: true,
      message: `Found AI-based product data for "${name}"`,
      data: products
    });

  } catch (error) {
    console.error("[ProductController] Search Products Error:", error.message);
    next(error);
  }
};

// update existing product
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const files = req.files;
    const data = req.body;

    const updatedProduct = await productService.updateProduct(id, data, files);

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct
    });

  } catch (error) {
    console.error("[ProductController] Product Update Error:", error.message);
    next(error);
  }
};

// delete existing product
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedProduct = await productService.deleteProduct(id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct
    });

  } catch (error) {
    console.error("[ProductController] Product Delete Error:", error.message);
    next(error);
  }
};