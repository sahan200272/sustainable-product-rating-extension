import api from "./api";

export const BLOG_CATEGORIES = [
    "Responsible Consumption",
    "Greenwashing",
    "Sustainable Brands",
];

export const createBlogPost = async (blogData, options = {}) => {
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
        onUploadProgress: (progressEvent) => {
            if (typeof options.onUploadProgress !== "function") return;
            const total = progressEvent?.total;
            const loaded = progressEvent?.loaded || 0;
            if (!total) return;
            const percent = Math.min(100, Math.round((loaded * 100) / total));
            options.onUploadProgress(percent);
        },
    });

    return response.data;
};

export const getAdminBlogs = async (params = {}) => {
    const response = await api.get("/api/blogs/admin/list", { params });
    return response.data;
};

export const getMyBlogs = async (params = {}) => {
    const response = await api.get("/api/blogs/my-blogs", { params });
    return response.data;
};

export const updateMyBlogPost = async (blogId, payload = {}, options = {}) => {
    const formData = new FormData();

    if (payload.title !== undefined) formData.append("title", payload.title);
    if (payload.category !== undefined) formData.append("category", payload.category);
    if (payload.content !== undefined) formData.append("content", payload.content);
    if (payload.tags !== undefined) formData.append("tags", JSON.stringify(payload.tags || []));

    if (payload.imageFiles?.length) {
        payload.imageFiles.forEach((file) => {
            formData.append("images", file);
        });
    } else {
        if (payload.imageUrl !== undefined) formData.append("imageUrl", payload.imageUrl || "");
        if (payload.imageUrls !== undefined) formData.append("imageUrls", JSON.stringify(payload.imageUrls || []));
    }

    const response = await api.patch(`/api/blogs/my-blogs/${blogId}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
            if (typeof options.onUploadProgress !== "function") return;
            const total = progressEvent?.total;
            const loaded = progressEvent?.loaded || 0;
            if (!total) return;
            const percent = Math.min(100, Math.round((loaded * 100) / total));
            options.onUploadProgress(percent);
        },
    });
    return response.data;
};

export const deleteMyBlogPost = async (blogId) => {
    const response = await api.delete(`/api/blogs/my-blogs/${blogId}`);
    return response.data;
};

export const getPublicBlogs = async (params = {}) => {
    const response = await api.get("/api/blogs", { params });
    return response.data;
};

export const getPublicBlogById = async (blogId) => {
    const response = await api.get(`/api/blogs/${blogId}`);
    return response.data;
};

export const generateEducationGuide = async ({ title, content }) => {
    const response = await api.post("/api/blogs/generate-education-guide", {
        title,
        content,
    });
    return response.data;
};

export const likeBlogPost = async (blogId) => {
    const response = await api.post(`/api/blogs/${blogId}/like`);
    return response.data;
};

export const unlikeBlogPost = async (blogId) => {
    const response = await api.post(`/api/blogs/${blogId}/unlike`);
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

export const deleteBlogPostAsAdmin = async (blogId) => {
    const response = await api.delete(`/api/blogs/${blogId}`);
    return response.data;
};
