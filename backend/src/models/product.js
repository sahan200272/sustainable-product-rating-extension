// models/Product.js

import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
    public_id: { type: String, required: true },
    url: { type: String, required: true }
});

const sustainabilitySchema = new mongoose.Schema({
    recyclableMaterial: { type: Boolean, default: false },
    biodegradable: { type: Boolean, default: false },
    plasticFree: { type: Boolean, default: false },
    carbonFootprint: { type: Number, required: true },
    crueltyFree: { type: Boolean, default: false },
    fairTradeCertified: { type: Boolean, default: false },
    renewableEnergyUsed: { type: Boolean, default: false },
    energyEfficiencyRating: { type: Number, min: 1, max: 5 }
});

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        brand: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String },

        images: [imageSchema],

        sustainability: sustainabilitySchema,

        sustainabilityScore: { type: Number, default: 0 }
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;