import * as productService from "../services/product.service.js";
import calculateSustainabilityScore from "../utils/calculateSustainabilityScore.js";
import cloudinaryUpload from "../utils/cloudinaryUpload.js";

export const createProduct = async (req, res) => {
  try {
    const { name, brand, category, description, sustainability } = req.body;
    const files = req.files;

    let images;
    //console.log(req.body);
    //console.log("files", files);
    //console.log("sustainability obj ",sustainability);

    // Basic validation
    if (!name || !brand || !category || !description || !sustainability) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    // photos upload to the cloudinary and take url and public_if from cloudinary
    if (req.files && req.files.length > 0) {
      // call the seperate function to handle photo upload logic
      images = await cloudinaryUpload(req.files);

    } else {
      console.log("No file uploaded.");
    }

    const score = calculateSustainabilityScore(sustainability);

    //console.log("images array ", images);

    const product = await productService.createProduct({
      name: name,
      brand: brand,
      category: category,
      description: description,
      images: images,
      sustainability: sustainability,
      sustainabilityScore: score
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    console.error("[ProductController] Create Product Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while creating product"
    });
  }
};

export const getAllProducts = async (req, res) => {

  try {

    const products = await productService.getAllProducts();

    return res.status(201).json({
      success: true,
      message: "Products retrieved successfully",
      data: products
    });

  } catch (error) {
    console.log("[ProductController] Retrive All Products Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while retriving products"
    });
  }
}

export const getSingleProduct = async (req, res) => {

  try {

    //console.log(req.params);
    const { id } = req.params;

    const product = await productService.getSingleProduct(id);

    return res.status(201).json({
      success: true,
      message: "Product retrieved successfully",
      data: product
    })

  } catch (error) {
    console.log("[ProductController] Product Retrive Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while retriving a product"
    })
  }
}

export const searchProducts = async (req, res) => {
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

    if (Array.isArray(products)) {
      return res.status(200).json({
        success: true,
        message: `Found ${products.length} product(s) matching "${name}"`,
        count: products.length,
        data: products
      });
    } else {
      return res.status(200).json({
        success: true,
        message: `Found AI based product data "${name}"`,
        data: products
      });
    }

  } catch (error) {
    console.log("[ProductController] Search Products Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while searching products"
    });
  }
}

export const updateProduct = async (req, res) => {

  try {
    const { id } = req.params;
    const files = req.files;
    const data = req.body;

    //console.log("ID", id);
    //console.log("files", files);
    //console.log("Data", data);

    const updatedProduct = await productService.updateProduct(id, data, files);

    return res.status(201).json({
      success: true,
      messgae: "Product updated successfully",
      updatedData: updatedProduct
    });

  } catch (error) {
    console.log("[ProductController] Product Update Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while updating product"
    });
  }
}

export const deleteProduct = async (req, res) => {

  try {

    const { id } = req.params;
    console.log(id);

    const product = await productService.deleteProduct(id);

    return res.status(201).json({
      success: true,
      message: "Product deleted successfully",
      data: product
    });

  } catch (error) {
    console.log("[ProductController] Product delete Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while retriving a product"
    })
  }
}