import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import env from "./env.js";

cloudinary.config({
	cloud_name: env.CLOUDINARY_CLOUD_NAME,
	api_key: env.CLOUDINARY_API_KEY,
	api_secret: env.CLOUDINARY_API_SECRET,
});

const avatarStorage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "avatars",
		allowed_formats: ["jpg", "jpeg", "png", "webp"],
	},
});

const resumeStorage = new CloudinaryStorage({
	cloudinary,
	params: {
		folder: "resumes",
		resource_type: "raw",
		format: "pdf",
	},
});

export { cloudinary, avatarStorage, resumeStorage };
