import express from 'express';
import {
	registerUser,
	loginUser,
	loginWithGoogle,
	getUser,
	getUserByEmailAdmin,
	getAllUsers,
	blockOrUnblockUser,
	sendOTP,
	verifyOTP,
	updateProfile
} from '../controllers/user.controller.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

//Register route
userRouter.post('/register', registerUser);

//Login route
userRouter.post('/login', loginUser);

// Google login route
userRouter.post('/google-login', loginWithGoogle);

//Get user details (for both Admin and Customer)
userRouter.get('/getUser', authenticate, getUser);

// Alias: /api/users/me — semantic REST endpoint for the authenticated user
userRouter.get('/me', authenticate, getUser);

// Update logged-in user's own profile
userRouter.patch('/me', authenticate, updateProfile);

// Email verification routes (authenticated user)
userRouter.post('/send-otp', authenticate, sendOTP);
userRouter.post('/verify-otp', authenticate, verifyOTP);

// Admin-only routes
userRouter.post('/admin/getUserByEmail', authenticate, isAdmin, getUserByEmailAdmin);
userRouter.get('/admin/getAllUsers', authenticate, isAdmin, getAllUsers);
userRouter.patch('/admin/block-user/:email', authenticate, isAdmin, blockOrUnblockUser);

export default userRouter;
