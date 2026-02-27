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
comparisonRouter.post('/items', authenticate, compareProducts);
comparisonRouter.get('/items', authenticate, getComparisonHistory);
comparisonRouter.delete('/items', authenticate, clearHistory);

comparisonRouter.get('/stats', authenticate, isAdmin, getComparisonStats);// Admin only routes

comparisonRouter.get('/items/:id', authenticate, getComparisonById);
comparisonRouter.put('/items/:id', authenticate, updateComparison);
comparisonRouter.delete('/items/:id', authenticate, deleteComparison);


export default comparisonRouter;