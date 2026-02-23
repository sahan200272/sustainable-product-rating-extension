import * as blogService from '../services/blog.service.js';

// Create a new blog (Admin only)
export async function createBlog(req, res) {
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

// Get all blogs (Public access)
export async function getAllBlogs(req, res) {
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

// Get blog by ID (Public access)
export async function getBlogById(req, res) {
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

// Unlike blog (Authenticated users only) - Additional feature
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