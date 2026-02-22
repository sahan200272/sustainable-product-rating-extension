// backend/models/Comparison.js
import mongoose from "mongoose";

const comparisonScoreSchema = new mongoose.Schema({
    product1Score: { type: Number, required: true },
    product2Score: { type: Number, required: true },
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    scoreDifference: { type: Number, required: true }
});

const sustainabilityHighlightsSchema = new mongoose.Schema({
    product1Advantages: [{ type: String }],
    product2Advantages: [{ type: String }]
});

const comparisonGraphSchema = new mongoose.Schema({
    labels: [{ type: String }],
    datasets: [{
        label: { type: String },
        data: [{ type: Number }],
        backgroundColor: { type: String }
    }]
});

const externalDataSchema = new mongoose.Schema({
    product1: { type: mongoose.Schema.Types.Mixed },
    product2: { type: mongoose.Schema.Types.Mixed }
});

const recommendationsSchema = new mongoose.Schema({
    general: [{ type: String }],
    product1Suggestions: [{ type: String }],
    product2Suggestions: [{ type: String }]
});

const comparisonSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        validate: {
            validator: function(v) {
                return v.length === 2;
            },
            message: 'Comparison must have exactly 2 products'
        }
    }],
    comparisonScore: comparisonScoreSchema,
    sustainabilityHighlights: sustainabilityHighlightsSchema,
    comparisonGraph: comparisonGraphSchema,
    externalData: externalDataSchema,
    recommendations: recommendationsSchema,
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for efficient querying
comparisonSchema.index({ user: 1, createdAt: -1 });
comparisonSchema.index({ 'products': 1 });
comparisonSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 }); // Auto-delete after 30 days

const Comparison = mongoose.model("Comparison", comparisonSchema);
export default Comparison;