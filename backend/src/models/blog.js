import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ["Responsible Consumption", "Greenwashing", "Sustainable Brands"]
    },
    tags: {
        type: [String],
        default: []
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    imageUrl: {
        type: String,
        default: ""
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    likedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    isFeatured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for better query performance
blogSchema.index({ title: 'text', content: 'text' });
blogSchema.index({ category: 1 });
blogSchema.index({ isFeatured: 1 });
blogSchema.index({ createdAt: -1 });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;