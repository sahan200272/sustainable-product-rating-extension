import express from "express";
import * as productController from "../controllers/product.controller.js";
import upload from "../middlewares/multer.js";

const productRoutes = express.Router();

productRoutes.post("/", upload.array("images", 5), productController.createProduct);
productRoutes.get("/", productController.getAllProducts);
productRoutes.get("/:id", productController.getSingleProduct);
productRoutes.put("/:id", upload.array("images", 5), productController.updateProduct);
productRoutes.delete("/:id", productController.deleteProduct);

export default productRoutes;