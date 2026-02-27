// backend/models/Comparison.js
import mongoose from "mongoose";


/**
 * Stores scoring details between two products
 */
const comparisonScoreSchema = new mongoose.Schema({
    product1Score: { type: Number, required: true },
    product2Score: { type: Number, required: true },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    scoreDifference: { type: Number, required: true }
});



/**
 * Highlights sustainability pros for each product
 */
const sustainabilityHighlightsSchema = new mongoose.Schema({
    product1Advantages: [{ type: String }],
    product2Advantages: [{ type: String }]
});


/**
 * Stores chart data for frontend graphs
 */
const comparisonGraphSchema = new mongoose.Schema({
    labels: [{ type: String }],
    datasets: [{
        label: { type: String },
        data: [{ type: Number }],
        backgroundColor: { type: String }
    }]
});


/**
 * AI recommendations for both products
 */
const recommendationsSchema = new mongoose.Schema({
    general: [{ type: String }],
    product1Suggestions: [{ type: String }],
    product2Suggestions: [{ type: String }]
});



/**
 * Main comparison schema
 */
const comparisonSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true        // Owner of the comparison
    },
    aiVerdict: { type: String },          // Final AI verdict text
    products: {
    type: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
            ],
            validate: {
                validator: function (arr) {
                    return arr.length === 2;         // Ensure exactly 2 products
                },
                message: 'Comparison must have exactly 2 products'
            },
            required: true
        },
    comparisonScore: comparisonScoreSchema,
    sustainabilityHighlights: sustainabilityHighlightsSchema,
    comparisonGraph: comparisonGraphSchema,
    recommendations: recommendationsSchema
}, { timestamps: true });

// Index for efficient querying
comparisonSchema.index({ user: 1, createdAt: -1 });        // for fast history queries
comparisonSchema.index({ 'products': 1 });                 // for product-based lookups
comparisonSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // Auto-delete after 30 days

const Comparison = mongoose.model("Comparison", comparisonSchema);
export default Comparison;