import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  phone: Joi.string().min(10).max(15).optional(),
  email: Joi.string().email({tlds: { allow: false }}).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("APPLICANT", "COMPANY", "ADMIN").optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
