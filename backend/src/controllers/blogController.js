import Blog from '../models/blog.js';
import mongoose from 'mongoose';

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

        // Validate category
        const validCategories = ["Responsible Consumption", "Greenwashing", "Sustainable Brands"];
        if (!validCategories.includes(category)) {
            return res.status(400).json({
                error: "Invalid category. Must be one of: " + validCategories.join(", ")
            });
        }

        // Create new blog
        const blog = new Blog({
            title,
            content,
            category,
            tags: tags || [],
            author: req.user.id,
            imageUrl: imageUrl || "",
            isFeatured: isFeatured || false
        });

        await blog.save();

        // Populate author details before returning
        await blog.populate('author', 'firstName lastName email');

        res.status(201).json({
            message: "Blog created successfully",
            blog
        });
    } catch (error) {
        console.error("Error creating blog:", error);
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

        // Build query filters
        const filter = {};
        
        if (category) {
            filter.category = category;
        }
        
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (page - 1) * limit;

        // Get blogs with pagination
        const blogs = await Blog.find(filter)
            .populate('author', 'firstName lastName')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // Get total count for pagination
        const total = await Blog.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            total,
            currentPage: page,
            totalPages,
            blogs
        });
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

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Invalid blog ID"
            });
        }

        // Find blog and increment views
        const blog = await Blog.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } },
            { new: true }
        ).populate('author', 'firstName lastName email profilePicture');

        if (!blog) {
            return res.status(404).json({
                error: "Blog not found"
            });
        }

        res.status(200).json({
            blog
        });
    } catch (error) {
        console.error("Error fetching blog:", error);
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

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Invalid blog ID"
            });
        }

        // Validate category if provided
        if (category) {
            const validCategories = ["Responsible Consumption", "Greenwashing", "Sustainable Brands"];
            if (!validCategories.includes(category)) {
                return res.status(400).json({
                    error: "Invalid category. Must be one of: " + validCategories.join(", ")
                });
            }
        }

        // Build update object (only include fields that are provided)
        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (content !== undefined) updateData.content = content;
        if (category !== undefined) updateData.category = category;
        if (tags !== undefined) updateData.tags = tags;
        if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
        if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

        const blog = await Blog.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        ).populate('author', 'firstName lastName email');

        if (!blog) {
            return res.status(404).json({
                error: "Blog not found"
            });
        }

        res.status(200).json({
            message: "Blog updated successfully",
            blog
        });
    } catch (error) {
        console.error("Error updating blog:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}

// Delete blog (Admin only)
export async function deleteBlog(req, res) {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Invalid blog ID"
            });
        }

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return res.status(404).json({
                error: "Blog not found"
            });
        }

        res.status(200).json({
            message: "Blog deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting blog:", error);
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

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Invalid blog ID"
            });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                error: "Blog not found"
            });
        }

        // Check if user has already liked the blog
        const hasLiked = blog.likedUsers.includes(userId);

        if (hasLiked) {
            return res.status(400).json({
                error: "You have already liked this blog"
            });
        }

        // Add user to likedUsers array and increment likes count
        blog.likedUsers.push(userId);
        blog.likes += 1;
        await blog.save();

        // Populate author details
        await blog.populate('author', 'firstName lastName');

        res.status(200).json({
            message: "Blog liked successfully",
            blog
        });
    } catch (error) {
        console.error("Error liking blog:", error);
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

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Invalid blog ID"
            });
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({
                error: "Blog not found"
            });
        }

        // Check if user has liked the blog
        const hasLiked = blog.likedUsers.includes(userId);

        if (!hasLiked) {
            return res.status(400).json({
                error: "You have not liked this blog"
            });
        }

        // Remove user from likedUsers array and decrement likes count
        blog.likedUsers = blog.likedUsers.filter(user => !user.equals(userId));
        blog.likes = Math.max(0, blog.likes - 1); // Ensure likes never go below 0
        await blog.save();

        // Populate author details
        await blog.populate('author', 'firstName lastName');

        res.status(200).json({
            message: "Blog unliked successfully",
            blog
        });
    } catch (error) {
        console.error("Error unliking blog:", error);
        res.status(500).json({
            error: "Internal server error"
        });
    }
}