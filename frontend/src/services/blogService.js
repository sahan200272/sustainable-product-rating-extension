import api from "./api";

export const BLOG_CATEGORIES = [
    "Responsible Consumption",
    "Greenwashing",
    "Sustainable Brands",
];

export const createBlogPost = async (blogData) => {
    const formData = new FormData();

    formData.append("title", blogData.title);
    formData.append("category", blogData.category);
    formData.append("content", blogData.content);
    formData.append("tags", JSON.stringify(blogData.tags || []));

    if (blogData.imageFiles?.length) {
        blogData.imageFiles.forEach((file) => {
            formData.append("images", file);
        });
    } else if (blogData.imageUrl) {
        formData.append("imageUrl", blogData.imageUrl);
    }

    const response = await api.post("/api/blogs", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });

    return response.data;
};

export const getAdminBlogs = async (params = {}) => {
    const response = await api.get("/api/blogs/admin/list", { params });
    return response.data;
};

export const approveBlogPost = async (blogId) => {
    const response = await api.patch(`/api/blogs/admin/${blogId}/approve`);
    return response.data;
};

export const rejectBlogPost = async (blogId, rejectionReason) => {
    const response = await api.patch(`/api/blogs/admin/${blogId}/reject`, {
        rejectionReason,
    });
    return response.data;
};
