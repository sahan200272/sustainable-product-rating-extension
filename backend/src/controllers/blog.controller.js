import * as blogService from '../services/blog.service.js';
import { testGeminiConnection } from '../services/blog-ai.service.js';

// Public Routes

// Get all published blogs (Public access)
export async function getAllBlogs(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const search = req.query.search;

        // Call service to get only published blogs
        const result = await blogService.getPublishedBlogs({ page, limit, category, search });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Get blog by ID with access control (Public/Auth based on status)
export async function getBlogById(req, res) {
    try {
        const { id } = req.params;

        // Get blog by ID
        const blog = await blogService.getBlogById(id);

        // Access control logic
        if (blog.status === "PUBLISHED") {
            // Published blogs are accessible to everyone
            return res.status(200).json({ blog });
        }

        // For non-published blogs, require authentication
        if (!req.user) {
            return res.status(403).json({ 
                error: "Access denied. This blog is not published." 
            });
        }

        // Allow access if user is the author or admin
        if (req.user.id === blog.author._id.toString() || req.user.role === "ADMIN") {
            return res.status(200).json({ blog });
        }

        // Otherwise deny access
        return res.status(403).json({ 
            error: "Access denied. This blog is not published." 
        });

    } catch (error) {
        console.error("Error fetching blog:", error);
        if (error.status === 400) {
            return res.status(400).json({ error: error.message });
        }
        if (error.status === 404) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Auth Required Routes

// Create blog (Authenticated users)
export async function createBlog(req, res) {
    try {
        const { title, content, category, tags, imageUrl } = req.body;

        // Validate required fields
        if (!title || !content || !category) {
            return res.status(400).json({
                error: "Title, content, and category are required"
            });
        }

        // Create blog with PENDING status
        const blog = await blogService.createBlog({
            title,
            content,
            category,
            tags,
            imageUrl
        }, req.user.id);

        res.status(201).json({
            message: "Blog created successfully and is pending approval",
            blog
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        if (error.status === 400) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Admin Routes

// Get all blogs for admin dashboard
export async function adminGetBlogs(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const status = req.query.status;
        const search = req.query.search;

        // Call service for admin blog listing
        const result = await blogService.getBlogsForAdmin({ page, limit, status, search });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching blogs for admin:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Approve blog (Admin only)
export async function adminApproveBlog(req, res) {
    try {
        const { id } = req.params;

        // Approve the blog
        const blog = await blogService.approveBlog(id, req.user.id);

        res.status(200).json({
            message: "Blog approved and published successfully",
            blog
        });
    } catch (error) {
        console.error("Error approving blog:", error);
        if (error.status === 400) {
            return res.status(400).json({ error: error.message });
        }
        if (error.status === 404) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Reject blog (Admin only)
export async function adminRejectBlog(req, res) {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;

        // Validate rejection reason
        if (!rejectionReason || rejectionReason.trim() === "") {
            return res.status(400).json({
                error: "Rejection reason is required"
            });
        }

        // Reject the blog
        const result = await blogService.rejectBlog(id, req.user.id, rejectionReason);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error rejecting blog:", error);
        if (error.status === 400) {
            return res.status(400).json({ error: error.message });
        }
        if (error.status === 404) {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Legacy/Backward Compatibility Routes

// Create a new blog (Admin only) - Original method
export async function createBlogLegacy(req, res) {
    try {
        const { title, content, category, tags, imageUrl, isFeatured } = req.body;

        // Validate required fields
        if (!title || !content || !category) {
            return res.status(400).json({
                error: "Title, content, and category are required"
            });
        }

        // Call service
        const blog = await blogService.createBlogService({
            title,
            content,
            category,
            tags,
            author: req.user.id,
            imageUrl,
            isFeatured
        });

        res.status(201).json({
            message: "Blog created successfully",
            blog
        });
    } catch (error) {
        console.error("Error creating blog:", error);
        if (error.message.includes("Invalid category")) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Get all blogs (Legacy - no status filtering)
export async function getAllBlogsLegacy(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category;
        const search = req.query.search;

        // Call service
        const result = await blogService.getAllBlogsService({ page, limit, category, search });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching blogs:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Get blog by ID (Legacy - no access control)
export async function getBlogByIdLegacy(req, res) {
    try {
        const { id } = req.params;

        // Call service
        const blog = await blogService.getBlogByIdService(id);

        res.status(200).json({
            blog
        });
    } catch (error) {
        console.error("Error fetching blog:", error);
        if (error.message === "Invalid blog ID") {
            return res.status(400).json({ error: error.message });
        }
        if (error.message === "Blog not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Update blog (Admin only)
export async function updateBlog(req, res) {
    try {
        const { id } = req.params;
        const { title, content, category, tags, imageUrl, isFeatured } = req.body;

        // Call service
        const blog = await blogService.updateBlogService(id, {
            title, content, category, tags, imageUrl, isFeatured
        });

        res.status(200).json({
            message: "Blog updated successfully",
            blog
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        if (error.message === "Invalid blog ID" || error.message.includes("Invalid category")) {
            return res.status(400).json({ error: error.message });
        }
        if (error.message === "Blog not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Delete blog (Admin only)
export async function deleteBlog(req, res) {
    try {
        const { id } = req.params;

        // Call service
        const result = await blogService.deleteBlogService(id);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error deleting blog:", error);
        if (error.message === "Invalid blog ID") {
            return res.status(400).json({ error: error.message });
        }
        if (error.message === "Blog not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Like blog (Authenticated users only)
export async function likeBlog(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Call service
        const blog = await blogService.likeBlogService(id, userId);

        res.status(200).json({
            message: "Blog liked successfully",
            blog
        });
    } catch (error) {
        console.error("Error liking blog:", error);
        if (error.message === "Invalid blog ID" || error.message === "You have already liked this blog") {
            return res.status(400).json({ error: error.message });
        }
        if (error.message === "Blog not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Unlike blog (Authenticated users only)
export async function unlikeBlog(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        // Call service
        const blog = await blogService.unlikeBlogService(id, userId);

        res.status(200).json({
            message: "Blog unliked successfully",
            blog
        });
    } catch (error) {
        console.error("Error unliking blog:", error);
        if (error.message === "Invalid blog ID" || error.message === "You have not liked this blog") {
            return res.status(400).json({ error: error.message });
        }
        if (error.message === "Blog not found") {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Test AI API connection
export async function testAI(req, res) {
    try {
        const result = await testGeminiConnection();
        
        res.status(200).json({
            message: "AI API is working!",
            response: result
        });
    } catch (error) {
        res.status(500).json({
            error: "AI API failed",
            details: error.message
        });
    }
}