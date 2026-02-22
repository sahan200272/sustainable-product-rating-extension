import * as productService from "../services/product.service.js";
import cloudinaryUpload from "../utils/cloudinaryUpload.js";

export const createProduct = async (req, res) => {
  try {
    const { name, brand, category, description, sustainability, sustainabilityScore } = req.body;
    const files = req.files;

    let images;
    //console.log(req.body);
    //console.log("files", files);

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

    //console.log("images array ", images);

    const product = await productService.createProduct({
      name,
      brand,
      category,
      description,
      images,
      sustainability,
      sustainabilityScore
    });

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