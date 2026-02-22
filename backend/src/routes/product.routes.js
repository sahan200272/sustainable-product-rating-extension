import express from "express";
import {createProduct} from "../controllers/product.controller.js";
import upload from "../middlewares/multer.js";

const productRoutes = express.Router();

productRoutes.post("/", upload.array("images", 5), createProduct);

export default productRoutes;