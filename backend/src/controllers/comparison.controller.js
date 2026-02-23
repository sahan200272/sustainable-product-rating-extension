// backend/controllers/comparison.controller.js
import Product from '../models/Product.js';
import comparisonService from '../services/comparison.service.js';
import Comparison from '../models/comparison.js';

/**
 * Compare two products
 * POST /api/comparison/compare
 */
export async function compareProducts(req, res) {
    try {
        const { productId1, productId2 } = req.body;

        if (!productId1 || !productId2) {
            return res.status(400).json({
                success: false,
                message: 'Both product IDs are required'
            });
        }

        // Fetch both products from database
        const product1 = await Product.findById(productId1);
        const product2 = await Product.findById(productId2);

        if (!product1 || !product2) {
            return res.status(404).json({
                success: false,
                message: 'One or both products not found'
            });
        }

        // Perform comparison
        const comparisonResult = await comparisonService.compareProducts(product1, product2);

        // Save to history if user is authenticated
        if (req.user) {
            await comparisonService.saveComparison(req.user.id, comparisonResult);
        }

        res.status(200).json({
            success: true,
            data: comparisonResult
        });

    } catch (error) {
        console.error('Comparison error:', error);
        res.status(500).json({
            success: false,
            message: 'Error comparing products',
            error: error.message
        });
    }
}

/**
 * Get user's recent comparisons
 * GET /api/comparison/history
 */
export async function getComparisonHistory(req, res) {
    try {
        const comparisons = await comparisonService.getUserRecentComparisons(req.user.id);
        
        res.status(200).json({
            success: true,
            data: comparisons
        });

    } catch (error) {
        console.error('Error fetching comparison history:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching comparison history',
            error: error.message
        });
    }
}

/**
 * Get specific comparison by ID
 * GET /api/comparison/:id
 */
export async function getComparisonById(req, res) {
    try {
        const comparison = await comparisonService.getComparisonById(req.params.id);

        if (!comparison) {
            return res.status(404).json({
                success: false,
                message: 'Comparison not found'
            });
        }

        // Check if user owns this comparison or is admin
        if (comparison.user.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this comparison'
            });
        }

        res.status(200).json({
            success: true,
            data: comparison
        });

    } catch (error) {
        console.error('Error fetching comparison:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching comparison',
            error: error.message
        });
    }
}

/**
 * Quick compare by product names
 * GET /api/comparison/quick?name1=xxx&name2=xxx
 */
export async function quickCompareByName(req, res) {
    try {
        const { name1, name2 } = req.query;

        if (!name1 || !name2) {
            return res.status(400).json({
                success: false,
                message: 'Both product names are required'
            });
        }

        // Find products by name (case insensitive)
        const product1 = await Product.findOne({ 
            name: { $regex: new RegExp(name1, 'i') } 
        });
        const product2 = await Product.findOne({ 
            name: { $regex: new RegExp(name2, 'i') } 
        });

        if (!product1 || !product2) {
            return res.status(404).json({
                success: false,
                message: 'Products not found for one or both names'
            });
        }

        // Perform comparison
        const comparisonResult = await comparisonService.compareProducts(product1, product2);

        res.status(200).json({
            success: true,
            data: comparisonResult
        });

    } catch (error) {
        console.error('Quick comparison error:', error);
        res.status(500).json({
            success: false,
            message: 'Error performing quick comparison',
            error: error.message
        });
    }
}

/**
 * Get comparison statistics (Admin only)
 * GET /api/comparison/stats
 */
export async function getComparisonStats(req, res) {
    try {
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

        res.status(200).json({
            success: true,
            data: {
                totalComparisons,
                mostComparedProducts: mostCompared,
                last7DaysTrend: last7Days,
                averageScoreDifference: avgScoreDiff[0]?.averageDifference || 0
            }
        });

    } catch (error) {
        console.error('Error fetching comparison stats:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching comparison statistics',
            error: error.message
        });
    }
}

/**
 * Delete comparison from history
 * DELETE /api/comparison/:id
 */
export async function deleteComparison(req, res) {
    try {
        const comparison = await Comparison.findById(req.params.id);

        if (!comparison) {
            return res.status(404).json({
                success: false,
                message: 'Comparison not found'
            });
        }

        // Check authorization
        if (comparison.user.toString() !== req.user.id && req.user.role !== 'Admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this comparison'
            });
        }

        await comparison.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Comparison deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting comparison:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting comparison',
            error: error.message
        });
    }
}

/**
 * Clear all comparison history for user
 * DELETE /api/comparison/history/clear
 */
export async function clearHistory(req, res) {
    try {
        await Comparison.deleteMany({ user: req.user.id });

        res.status(200).json({
            success: true,
            message: 'Comparison history cleared successfully'
        });

    } catch (error) {
        console.error('Error clearing history:', error);
        res.status(500).json({
            success: false,
            message: 'Error clearing comparison history',
            error: error.message
        });
    }
}