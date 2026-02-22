import * as productService from "../services/product.service.js";

export const createProduct = async (req, res) => {
  try {
    const { name, brand, category, description, images, sustainability } = req.body;

    // Basic validation
    if (!name || !brand || !category || !description || !sustainability) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }

    const product = await productService.createProduct(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });

  } catch (error) {
    console.error("Create Product Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Server error while creating product"
    });
  }
};