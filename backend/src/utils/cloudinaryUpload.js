import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = async (files, folder) => {

    const images = [];

    for (const file of files) {

        // convert file into base 64 format
        const base64Photo = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

        // upload file into cloudinary
        const uploadedPhoto = await cloudinary.uploader.upload(base64Photo, {
            resource_type: "auto",
            folder
        });

        // push cloudinary public_id and url into array
        images.push({
            public_id: uploadedPhoto.public_id,
            url: uploadedPhoto.secure_url
        });
    }

    return images;
};

const cloudinaryUpload = async(files) => {
    return uploadToCloudinary(files, "products/photos");
};

export const blogCloudinaryUpload = async(files) => {
    return uploadToCloudinary(files, "blogs/photos");
};

export default cloudinaryUpload;