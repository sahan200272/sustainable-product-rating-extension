import Product from "../models/product.js";
import cloudinaryUpload from "../utils/cloudinaryUpload.js";

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

export const getSingleProduct = async (id) => {
  try {

    const product = await Product.findById(id);

    return product;

  } catch (error) {
    console.log("[ProductService] getSingleProduct Error:", error.message);

    throw new Error("Failed to fetch product");
  }
}

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

/* export const updateProduct = async (id, data, files) => {

  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found")
  }

  if (files && files.length > 0) {

    const newImages = await cloudinaryUpload(files);
    const updatedImages = [...product.images, ...newImages];

  } else {
    console.log("No file uploaded");
  }

  const newProduct = new Product({
    name: product.name || data.name,
    brand: product.brand || data.brand,
    category: product.category || data.category,
    description: product.description || data.description,
    images: product.images || updatedImages,

    sustainability: {
      recyclableMaterial: product.recyclableMaterial || data.recyclableMaterial,
      biodegradable: product.biodegradable || data.biodegradable,
      plasticFree: product.plasticFree || data.plasticFree,
      carbonFootprint: product.carbonFootprint || data.carbonFootprint,
      crueltyFree: product.crueltyFree || data.crueltyFree
    }

  })
} */