import multer from "multer";
import { avatarStorage, resumeStorage } from "../config/cloudinary.js";

export const uploadAvatar = multer({
	storage: avatarStorage,
	limits: {
		fileSize: 25 * 1024 * 1024,
	},
});
export const uploadResume = multer({
	storage: resumeStorage,
	limits: {
		fileSize: 25 * 1024 * 1024,
	},
});
