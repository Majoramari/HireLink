// src/Validation/company.validation.js
import Joi from "joi";

export const createCompanySchema = Joi.object({
  companyName: Joi.string().min(3).required(),
  industry: Joi.string().optional(),
  description: Joi.string().optional(),
  location: Joi.string().required(),
  website: Joi.string().uri().optional(),
  logoUrl: Joi.string().uri().optional(),
  establishedAt: Joi.date().optional()
});
