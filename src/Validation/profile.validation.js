import Joi from "joi";

// ✅ Validation Schema
export const profileSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(), // هيتحدث في جدول User
  title: Joi.string().max(100).optional(),
  bio: Joi.string().max(500).optional(),
  education: Joi.string().max(200).optional(),
  resumeUrl: Joi.string().uri().optional(),
  profilePictureUrl: Joi.string().uri().optional(),
  githubUrl: Joi.string().uri().optional(),
  linkedinUrl: Joi.string().uri().optional(),
  birthDate: Joi.date().optional(),
});
