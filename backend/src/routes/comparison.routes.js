// backend/routes/comparison.routes.js
import express from 'express';
import {
    compareProducts,
    getComparisonHistory,
    getComparisonById,
    quickCompareByName,
    getComparisonStats,
    deleteComparison,
    clearHistory,
    updateComparison
} from '../controllers/comparison.controller.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';

const comparisonRouter = express.Router();

// Public route (no authentication required for quick compare)
comparisonRouter.get('/quick', quickCompareByName);

// Protected routes (require authentication)
comparisonRouter.post('/items', authenticate, compareProducts);      // Create a new comparison
comparisonRouter.get('/items', authenticate, getComparisonHistory);   // Get user's comparison history
comparisonRouter.delete('/items', authenticate, clearHistory);         // Clear user's comparison history

comparisonRouter.get('/stats', authenticate, isAdmin, getComparisonStats);   // Get comparison statistics Admin only routes

comparisonRouter.get('/items/:id', authenticate, getComparisonById);    // Get a single comparison by ID
comparisonRouter.put('/items/:id', authenticate, updateComparison);     // Update a comparison (owner or admin)
comparisonRouter.delete('/items/:id', authenticate, deleteComparison);   // Delete a comparison (owner or admin)


export default comparisonRouter;