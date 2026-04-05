// backend/controllers/comparison.controller.js
import Product from '../models/product.js';
import comparisonService from '../services/comparison.service.js';
import Comparison from '../models/comparison.js';
import mongoose from 'mongoose';

/**
 * Compare two products
 * POST /api/comparison/compare
 */
export async function compareProducts(req, res, next) {
    try {
        const { productId1, productId2 } = req.body;

        // Validate request body
        if (!productId1 || !productId2) {
            return res.status(400).json({
                success: false,
                error: 'Both product IDs are required'
            });
        }

        //Validate product IDs before querying Mongo
        if (!mongoose.Types.ObjectId.isValid(productId1) || !mongoose.Types.ObjectId.isValid(productId2)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid product ID format'
            });
        }

        //Prevent comparing the same product with itself
        if (productId1 === productId2) {
            return res.status(400).json({
                success: false,
                error: 'Cannot compare the same product with itself'
            });
        }

        // Fetch both products from database
        const product1 = await Product.findById(productId1);
        const product2 = await Product.findById(productId2);

        if (!product1 || !product2) {
            return res.status(404).json({
                success: false,
                error: 'One or both products not found'
            });
        }

        // Perform comparison
        const comparisonResult = await comparisonService.compareProducts(product1, product2);

        let savedComparison;

        // Save to history if user is authenticated
        if (req.user) {
            try {
                savedComparison = await comparisonService.saveComparison(req.user.id, comparisonResult);
                comparisonResult._id = savedComparison._id;
            } catch (err) {
                console.error("Failed to save comparison:", err);
            }
        }

        // Always use the rich comparisonResult which contains fully populated product objects
        // We explicitly map the Mongoose documents to plain objects to ensure all data serializes properly
        const safeProduct1 = product1.toObject ? product1.toObject() : product1;
        const safeProduct2 = product2.toObject ? product2.toObject() : product2;

        const finalData = {
            ...comparisonResult,
             products: [safeProduct1, safeProduct2],
             comparisonScore: {
                 product1Score: comparisonResult.scores.product1,
                 product2Score: comparisonResult.scores.product2,
                 winner: comparisonResult.winner ? comparisonResult.winner.toString() : null,
                 scoreDifference: comparisonResult.scores.difference
             }
        };

        return res.status(200).json({
            success: true,
            data: finalData
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Get user's recent comparisons
 * GET /api/comparison/history
 */
export async function getComparisonHistory(req, res, next) {
    try {
        const comparisons = await comparisonService.getUserRecentComparisons(req.user.id);
        
        return res.status(200).json({
            success: true,
            data: comparisons
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Get specific comparison by ID
 * GET /api/comparison/:id
 */
export async function getComparisonById(req, res, next) {
    try {
        // Validate comparison ID
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid comparison ID format'
            });
        }

        // Fetch comparison
        const comparison = await comparisonService.getComparisonById(req.params.id);

        // Check existence
        if (!comparison) {
            return res.status(404).json({
                success: false,
                error: 'Comparison not found'
            });
        }

        // Check if user owns this comparison or is admin
        if (comparison.user.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to view this comparison'
            });
        }

        return res.status(200).json({
            success: true,
            data: comparison
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Update comparison (e.g., admin notes or verdict)
 * PUT /api/comparison/:id
 */
export async function updateComparison(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid comparison ID format"
      });
    }

    // Fetch comparison
    const comparison = await Comparison.findById(id);

    if (!comparison) {
      return res.status(404).json({
        success: false,
        error: "Comparison not found"
      });
    }

    // Check permissions
    if (comparison.user.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        error: "Not authorized to update this comparison"
      });
    }

    const { aiVerdict, recommendations } = req.body;

    // Update allowed fields
    if (aiVerdict) comparison.aiVerdict = aiVerdict;
    if (recommendations) comparison.recommendations = recommendations;

    await comparison.save();

    return res.status(200).json({
      success: true,
      message: "Comparison updated successfully",
      data: comparison
    });

  } catch (error) {
    next(error);
  }
}

/**
 * Quick compare by product names
 * GET /api/comparison/quick?name1=xxx&name2=xxx
 */
export async function quickCompareByName(req, res, next) {
    try {
        const { name1, name2 } = req.query;

        if (!name1 || !name2) {
            return res.status(400).json({
                success: false,
                error: 'Both product names are required'
            });
        }

        // Find products by name (case insensitive)
        const product1 = await Product.findOne({ 
            //name: { $regex: new RegExp(name1, 'i') } 
            name: { $regex: `^${name1}`, $options: 'i' }
        });
        const product2 = await Product.findOne({ 
            //name: { $regex: new RegExp(name1, 'i') } 
            name: { $regex: `^${name2}`, $options: 'i' }
        });

        if (!product1 || !product2) {
            return res.status(404).json({
                success: false,
                error: 'Products not found for one or both names'
            });
        }

        // Run comparison logic
        const comparisonResult = await comparisonService.compareProducts(product1, product2);

        // Normalize structure to match DB schema
        const finalData = {
             ...comparisonResult,
             comparisonScore: {
                 product1Score: comparisonResult.scores.product1,
                 product2Score: comparisonResult.scores.product2,
                 winner: comparisonResult.winner,
                 scoreDifference: comparisonResult.scores.difference
             }
        };

        return res.status(200).json({
            success: true,
            data: finalData
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Get comparison statistics (Admin only)
 * GET /api/comparison/stats
 */
export async function getComparisonStats(req, res, next) {
    try {
        // Get most compared products
        const mostCompared = await comparisonService.getMostComparedProducts();
        
        // Get total comparisons count
        const totalComparisons = await Comparison.countDocuments();
        
        // Get comparisons trend (last 7 days)
        const last7Days = await Comparison.aggregate([
            {
                $match: {
                    createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get average score difference
        const avgScoreDiff = await Comparison.aggregate([
            {
                $group: {
                    _id: null,
                    averageDifference: { $avg: '$comparisonScore.scoreDifference' }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: {
                totalComparisons,
                mostComparedProducts: mostCompared,
                last7DaysTrend: last7Days,
                averageScoreDifference: avgScoreDiff[0]?.averageDifference || 0
            }
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Delete comparison from history
 * DELETE /api/comparison/:id
 */
export async function deleteComparison(req, res, next) {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid comparison ID format'
            });
        }
        
        const comparison = await Comparison.findById(req.params.id);

        if (!comparison) {
            return res.status(404).json({
                success: false,
                error: 'Comparison not found'
            });
        }

        // Check authorization
        if (comparison.user.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                error: 'Not authorized to delete this comparison'
            });
        }

        await comparison.deleteOne();

        return res.status(200).json({
            success: true,
            message: 'Comparison deleted successfully'
        });

    } catch (error) {
        next(error);
    }
}

/**
 * Clear all comparison history for user
 * DELETE /api/comparison/history/clear
 */
export async function clearHistory(req, res, next) {
    try {
        // Remove all comparisons for current user
        await Comparison.deleteMany({ user: req.user.id });

        return res.status(200).json({
            success: true,
            message: 'Comparison history cleared successfully'
        });

    } catch (error) {
        next(error);
    }
}