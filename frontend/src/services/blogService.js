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
