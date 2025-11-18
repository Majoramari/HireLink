import Joi from "joi";


export const jobSchemaValidation = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow(""),
  location: Joi.string().required(),
  salaryRange: Joi.number().required(),
  isRemote: Joi.boolean().optional(),
  category: Joi.string().optional(),
  experienceLevel: Joi.string().optional(),
  companyId: Joi.forbidden(),
});

