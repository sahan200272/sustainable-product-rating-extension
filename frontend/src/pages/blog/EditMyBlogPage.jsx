import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { BLOG_CATEGORIES, getPublicBlogById, updateMyBlogPost } from "../../services/blogService";

const INITIAL_FORM = {
    title: "",
    category: BLOG_CATEGORIES[0],
    content: "",
};

export default function EditMyBlogPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(INITIAL_FORM);
    const [tags, setTags] = useState([]);
    const [tagInput, setTagInput] = useState("");
    const [imageFiles, setImageFiles] = useState([]);
    const [existingImageUrls, setExistingImageUrls] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploadProgress, setUploadProgress] = useState(0);

    useEffect(() => {
        return () => {
            imagePreviews.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const data = await getPublicBlogById(id);
                const blog = data?.blog;
                if (!blog) {
                    toast.error("Blog not found");
                    navigate("/my-blogs");
                    return;
                }

                if (cancelled) return;

                setForm({
                    title: blog.title || "",
                    category: blog.category || BLOG_CATEGORIES[0],
                    content: blog.content || "",
                });
                setTags(Array.isArray(blog.tags) ? blog.tags : []);

                const urls = Array.isArray(blog.imageUrls) && blog.imageUrls.length > 0
                    ? blog.imageUrls
                    : (blog.imageUrl ? [blog.imageUrl] : []);
                setExistingImageUrls(urls);
                setImagePreviews(urls);
            } catch (error) {
                toast.error(error?.response?.data?.error || "Failed to load blog for edit");
                navigate("/my-blogs");
            } finally {
                if (!cancelled) setFetching(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [id, navigate]);

    const canSubmit = useMemo(() => {
        return (
            form.title.trim().length > 0 &&
            form.category.trim().length > 0 &&
            form.content.trim().length > 0 &&
            !loading
        );
    }, [form, loading]);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const addTag = () => {
        const normalized = tagInput.trim();
        if (!normalized) return;

        const exists = tags.some((tag) => tag.toLowerCase() === normalized.toLowerCase());
        if (exists) {
            toast.error("Tag already added");
            return;
        }

        setTags((prev) => [...prev, normalized]);
        setTagInput("");
    };

    const handleTagKeyDown = (e) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addTag();
        }
        if (e.key === "Backspace" && !tagInput && tags.length > 0) {
            setTags((prev) => prev.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove) => {
        setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const maxSize = 5 * 1024 * 1024;
        for (const file of files) {
            if (!file.type.startsWith("image/")) {
                toast.error("Please select only image files");
                return;
            }
            if (file.size > maxSize) {
                toast.error("Each image must be 5MB or less");
                return;
            }
        }

        if (files.length > 5) {
            toast.error("You can upload up to 5 images");
            e.target.value = "";
            return;
        }

        imagePreviews.forEach((url) => {
            if (url.startsWith("blob:")) URL.revokeObjectURL(url);
        });

        setImageFiles(files);
        setImagePreviews(files.map((file) => URL.createObjectURL(file)));
        e.target.value = "";
    };

    const removeImage = (indexToRemove) => {
        if (imageFiles.length > 0) {
            imagePreviews.forEach((url) => {
                if (url.startsWith("blob:")) URL.revokeObjectURL(url);
            });
            const nextFiles = imageFiles.filter((_, index) => index !== indexToRemove);
            setImageFiles(nextFiles);
            setImagePreviews(nextFiles.map((file) => URL.createObjectURL(file)));
            return;
        }

        const nextUrls = existingImageUrls.filter((_, index) => index !== indexToRemove);
        setExistingImageUrls(nextUrls);
        setImagePreviews(nextUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!canSubmit) {
            toast.error("Please fill title, category, and content");
            return;
        }

        setLoading(true);
        setUploadProgress(0);

        try {
            const payload = {
                title: form.title.trim(),
                category: form.category,
                content: form.content.trim(),
                tags,
                imageFiles,
                imageUrls: imageFiles.length > 0 ? undefined : existingImageUrls,
                imageUrl: imageFiles.length > 0 ? undefined : (existingImageUrls[0] || ""),
            };

            const response = await updateMyBlogPost(id, payload, {
                onUploadProgress: (percent) => setUploadProgress(percent),
            });

            setUploadProgress(100);
            toast.success(response?.message || "Blog updated successfully");
            navigate("/my-blogs");
        } catch (error) {
            toast.error(error?.response?.data?.error || "Failed to update blog post.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white px-4 py-8 sm:px-8">
                <div className="mx-auto w-full max-w-5xl rounded-2xl border border-emerald-100 bg-white p-8 text-center shadow-sm">
                    Loading blog editor...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-white px-4 py-8 sm:px-8">
            <div className="mx-auto w-full max-w-5xl">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">Update Blog</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Edit your post and submit it again for admin approval.
                        </p>
                    </div>
                    <Link
                        to="/my-blogs"
                        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                    >
                        Back to My Blogs
                    </Link>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm sm:p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid gap-5 md:grid-cols-2">
                            <div>
                                <label htmlFor="title" className="mb-2 block text-sm font-semibold text-gray-700">
                                    Blog Title
                                </label>
                                <input
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={onInputChange}
                                    placeholder="Enter blog title"
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none ring-emerald-400 transition focus:border-emerald-500 focus:ring-2"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="category" className="mb-2 block text-sm font-semibold text-gray-700">
                                    Category
                                </label>
                                <select
                                    id="category"
                                    name="category"
                                    value={form.category}
                                    onChange={onInputChange}
                                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none ring-emerald-400 transition focus:border-emerald-500 focus:ring-2"
                                >
                                    {BLOG_CATEGORIES.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="tags" className="mb-2 block text-sm font-semibold text-gray-700">
                                Tags
                            </label>
                            <div className="rounded-xl border border-gray-300 px-3 py-2 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-400">
                                <div className="mb-2 flex flex-wrap gap-2">
                                    {tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
                                        >
                                            #{tag}
                                            <button
                                                type="button"
                                                onClick={() => removeTag(tag)}
                                                className="text-emerald-700 hover:text-emerald-900"
                                                aria-label={`Remove ${tag}`}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    id="tags"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagKeyDown}
                                    onBlur={addTag}
                                    placeholder="Type a tag and press Enter"
                                    className="w-full border-none px-1 py-1 text-sm outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="image" className="mb-2 block text-sm font-semibold text-gray-700">
                                Post Images (optional, max 5)
                            </label>
                            <label
                                htmlFor="image"
                                className="flex w-full cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 px-4 py-8 text-center text-sm font-medium text-emerald-700 hover:bg-emerald-100"
                            >
                                {imagePreviews.length > 0
                                    ? `${imagePreviews.length} image(s) selected (click to replace)`
                                    : "Click to upload images"}
                            </label>
                            <input
                                id="image"
                                name="images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {imagePreviews.length > 0 ? (
                                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={`${preview}-${index}`} className="relative">
                                            <img
                                                src={preview}
                                                alt={`Preview ${index + 1}`}
                                                className="h-28 w-full rounded-xl border border-gray-200 object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute right-1 top-1 rounded-full bg-black/60 px-2 py-0.5 text-xs font-semibold text-white"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                        </div>

                        <div>
                            <label htmlFor="content" className="mb-2 block text-sm font-semibold text-gray-700">
                                Blog Content
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={form.content}
                                onChange={onInputChange}
                                rows={12}
                                placeholder="Write your blog content..."
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none ring-emerald-400 transition focus:border-emerald-500 focus:ring-2"
                                required
                            />
                        </div>

                        <div className="rounded-xl bg-emerald-50 px-4 py-3">
                            <div className="flex items-center justify-end">
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {loading ? "Updating..." : "Update Blog"}
                                </button>
                            </div>

                            {loading ? (
                                <div className="mt-3">
                                    <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-emerald-700">
                                        <span>{uploadProgress < 100 ? "Uploading" : "Uploaded. Finalizing..."}</span>
                                        <span>{uploadProgress}%</span>
                                    </div>
                                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-emerald-100">
                                        <div
                                            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
