import express from 'express';
import { 
    createBlog, 
    getAllBlogs, 
    getBlogById, 
    updateBlog, 
    deleteBlog, 
    likeBlog,
    unlikeBlog,
    adminGetBlogs,
    adminApproveBlog,
    adminRejectBlog,
    createBlogLegacy,
    getAllBlogsLegacy,
    getBlogByIdLegacy
} from '../controllers/blog.controller.js';
import { authenticate, authorizeRoles } from '../middlewares/authMiddleware.js';

const blogRouter = express.Router();

// Admin check middleware (inline implementation as backup)
const isAdmin = (req, res, next) => {
    if (req.user?.role === "ADMIN") {
        return next();
    }
    return res.status(403).json({ message: "Forbidden" });
};

// =================== APPROVAL WORKFLOW ROUTES ===================

// Public routes (no authentication required)
blogRouter.get('/', getAllBlogs); // GET /api/blogs - only published blogs
blogRouter.get('/:id', getBlogById); // GET /api/blogs/:id - access control based on status

// User routes (authentication required)
blogRouter.post('/', authenticate, createBlog); // POST /api/blogs - creates with PENDING status

// Admin routes (authentication + admin role required)
blogRouter.get('/admin/list', authenticate, authorizeRoles('Admin'), adminGetBlogs); // GET /api/blogs/admin/list
blogRouter.patch('/admin/:id/approve', authenticate, authorizeRoles('Admin'), adminApproveBlog); // PATCH /api/blogs/admin/:id/approve
blogRouter.patch('/admin/:id/reject', authenticate, authorizeRoles('Admin'), adminRejectBlog); // PATCH /api/blogs/admin/:id/reject

// =================== LEGACY ROUTES (BACKWARD COMPATIBILITY) ===================

// Legacy admin-only routes (keeping for backward compatibility)
blogRouter.post('/legacy', authenticate, authorizeRoles('Admin'), createBlogLegacy); // POST /api/blogs/legacy
blogRouter.put('/:id', authenticate, authorizeRoles('Admin'), updateBlog); // PUT /api/blogs/:id
blogRouter.delete('/:id', authenticate, authorizeRoles('Admin'), deleteBlog); // DELETE /api/blogs/:id

// Legacy public routes
blogRouter.get('/legacy/all', getAllBlogsLegacy); // GET /api/blogs/legacy/all - no status filtering
blogRouter.get('/legacy/:id', getBlogByIdLegacy); // GET /api/blogs/legacy/:id - no access control

// =================== ENGAGEMENT ROUTES ===================

// Authenticated user routes for blog engagement
blogRouter.post('/:id/like', authenticate, likeBlog); // POST /api/blogs/:id/like
blogRouter.post('/:id/unlike', authenticate, unlikeBlog); // POST /api/blogs/:id/unlike

export default blogRouter;