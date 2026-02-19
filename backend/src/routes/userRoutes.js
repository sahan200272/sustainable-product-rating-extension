import express from 'express';
import { registerUser, loginUser, getUser, getUserByEmailAdmin } from '../controllers/userController.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

// Public routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Protected routes - Any authenticated user
userRouter.get('/getUser', authenticate, getUser);

// Admin-only routes
userRouter.post('/admin/getUserByEmail', authenticate, isAdmin, getUserByEmailAdmin);

export default userRouter;
