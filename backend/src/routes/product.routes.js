import express from "express";
import {createProduct} from "../controllers/product.controller.js";

const productRoutes = express.Router();

productRoutes.post("/", createProduct);

export default productRoutes;