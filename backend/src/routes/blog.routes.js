import express from 'express';
import { 
    createBlog, 
    getAllBlogs, 
    getBlogById, 
    updateBlog, 
    deleteBlog, 
    likeBlog,
    unlikeBlog 
} from '../controllers/blog.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const blogRouter = express.Router();

// Public routes
blogRouter.get('/', getAllBlogs); // GET /api/blogs
blogRouter.get('/:id', getBlogById); // GET /api/blogs/:id

// Admin-only routes
blogRouter.post('/', authenticate, authorizeRoles('Admin'), createBlog); // POST /api/blogs
blogRouter.put('/:id', authenticate, authorizeRoles('Admin'), updateBlog); // PUT /api/blogs/:id
blogRouter.delete('/:id', authenticate, authorizeRoles('Admin'), deleteBlog); // DELETE /api/blogs/:id

// Authenticated user routes
blogRouter.post('/:id/like', authenticate, likeBlog); // POST /api/blogs/:id/like
blogRouter.post('/:id/unlike', authenticate, unlikeBlog); // POST /api/blogs/:id/unlike

export default blogRouter;