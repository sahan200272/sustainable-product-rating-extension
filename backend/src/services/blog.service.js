import Blog from '../models/blog.js';
import mongoose from 'mongoose';

// Service function to create a new blog
export async function createBlogService(blogData) {
    const { title, content, category, tags, author, imageUrl, isFeatured } = blogData;

    // Validate category
    const validCategories = ["Responsible Consumption", "Greenwashing", "Sustainable Brands"];
    if (!validCategories.includes(category)) {
        throw new Error("Invalid category. Must be one of: " + validCategories.join(", "));
    }

    // Create new blog
    const blog = new Blog({
        title,
        content,
        category,
        tags: tags || [],
        author,
        imageUrl: imageUrl || "",
        isFeatured: isFeatured || false
    });

    await blog.save();

    // Populate author details before returning
    await blog.populate('author', 'firstName lastName email');

    return blog;
}

// Service function to get all blogs with filters and pagination
export async function getAllBlogsService({ page = 1, limit = 10, category, search }) {
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

    return {
        total,
        currentPage: page,
        totalPages,
        blogs
    };
}

// Service function to get blog by ID
export async function getBlogByIdService(id) {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid blog ID");
    }

    // Find blog and increment views
    const blog = await Blog.findByIdAndUpdate(
        id,
        { $inc: { views: 1 } },
        { new: true }
    ).populate('author', 'firstName lastName email profilePicture');

    if (!blog) {
        throw new Error("Blog not found");
    }

    return blog;
}

// Service function to update blog
export async function updateBlogService(id, updateData) {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid blog ID");
    }

    // Validate category if provided
    if (updateData.category) {
        const validCategories = ["Responsible Consumption", "Greenwashing", "Sustainable Brands"];
        if (!validCategories.includes(updateData.category)) {
            throw new Error("Invalid category. Must be one of: " + validCategories.join(", "));
        }
    }

    // Build update object (only include fields that are provided)
    const updateFields = {};
    if (updateData.title !== undefined) updateFields.title = updateData.title;
    if (updateData.content !== undefined) updateFields.content = updateData.content;
    if (updateData.category !== undefined) updateFields.category = updateData.category;
    if (updateData.tags !== undefined) updateFields.tags = updateData.tags;
    if (updateData.imageUrl !== undefined) updateFields.imageUrl = updateData.imageUrl;
    if (updateData.isFeatured !== undefined) updateFields.isFeatured = updateData.isFeatured;

    const blog = await Blog.findByIdAndUpdate(
        id,
        updateFields,
        { new: true, runValidators: true }
    ).populate('author', 'firstName lastName email');

    if (!blog) {
        throw new Error("Blog not found");
    }

    return blog;
}

// Service function to delete blog
export async function deleteBlogService(id) {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid blog ID");
    }

    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
        throw new Error("Blog not found");
    }

    return { message: "Blog deleted successfully" };
}

// Service function to like blog
export async function likeBlogService(blogId, userId) {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        throw new Error("Invalid blog ID");
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new Error("Blog not found");
    }

    // Check if user has already liked the blog
    const hasLiked = blog.likedUsers.includes(userId);

    if (hasLiked) {
        throw new Error("You have already liked this blog");
    }

    // Add user to likedUsers array and increment likes count
    blog.likedUsers.push(userId);
    blog.likes += 1;
    await blog.save();

    // Populate author details
    await blog.populate('author', 'firstName lastName');

    return blog;
}

// Service function to unlike blog
export async function unlikeBlogService(blogId, userId) {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
        throw new Error("Invalid blog ID");
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
        throw new Error("Blog not found");
    }

    // Check if user has liked the blog
    const hasLiked = blog.likedUsers.includes(userId);

    if (!hasLiked) {
        throw new Error("You have not liked this blog");
    }

    // Remove user from likedUsers array and decrement likes count
    blog.likedUsers = blog.likedUsers.filter(user => !user.equals(userId));
    blog.likes = Math.max(0, blog.likes - 1); // Ensure likes never go below 0
    await blog.save();

    // Populate author details
    await blog.populate('author', 'firstName lastName');

    return blog;
}