import express from 'express';
import { registerUser } from '../controllers/userController.js';

const userRouter = express.Router();

// POST /api/users/register - Register a new user
userRouter.post('/register', registerUser);

// POST /api/users/login - Login user
//router.post('/login', userController.loginUser);

// GET /api/users/profile - Get user profile (protected route)
//router.get('/profile', userController.getUserProfile);

// PUT /api/users/profile - Update user profile (protected route)
//router.put('/profile', userController.updateUserProfile);

export default userRouter;
