// backend/routes/comparison.routes.js
import express from 'express';
import {
    compareProducts,
    getComparisonHistory,
    getComparisonById,
    quickCompareByName,
    getComparisonStats,
    deleteComparison,
    clearHistory
} from '../controllers/comparison.controller.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';

const comparisonRouter = express.Router();

// Public route (no authentication required for quick compare)
comparisonRouter.get('/quick', quickCompareByName);

// Protected routes (require authentication)
comparisonRouter.post('/compare', authenticate, compareProducts);
comparisonRouter.get('/history', authenticate, getComparisonHistory);
comparisonRouter.get('/:id', authenticate, getComparisonById);
comparisonRouter.delete('/:id', authenticate, deleteComparison);
comparisonRouter.delete('/history/clear', authenticate, clearHistory);

// Admin only routes
comparisonRouter.get('/stats/admin', authenticate, isAdmin, getComparisonStats);

export default comparisonRouter;