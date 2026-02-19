import express from 'express';
import { registerUser, loginUser, getUser, getUserByEmailAdmin, getAllUsers } from '../controllers/userController.js';
import { authenticate, isAdmin } from '../middlewares/authMiddleware.js';

const userRouter = express.Router();

//Register route
userRouter.post('/register', registerUser);

//Login route
userRouter.post('/login', loginUser);

//Get user details (for both Admin and Customer)
userRouter.get('/getUser', authenticate, getUser);

// Admin-only routes
userRouter.post('/admin/getUserByEmail', authenticate, isAdmin, getUserByEmailAdmin);
userRouter.get('/admin/getAllUsers', authenticate, isAdmin, getAllUsers);

export default userRouter;
