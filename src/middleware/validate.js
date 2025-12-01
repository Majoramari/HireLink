import { z } from "zod";
import statusCodes from "../config/statusCodes.js";
import { ApiError, ValidationError } from "../errors/index.js";

export default function validate(schema) {
	return async (req, _res, next) => {
		if (!req.body) {
			return next(new ApiError(statusCodes.BAD_REQUEST, "empty body"));
		}

		const result = schema.safeParse(req.body);
		if (result.success) {
			req.validated = result.data;
			return next();
		}

		const flattened = z.flattenError(result.error);

		return next(new ValidationError("validation error", flattened.fieldErrors));
	};
}
