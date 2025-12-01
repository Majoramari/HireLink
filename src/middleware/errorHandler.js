import ApiError from "../errors/ApiError.js";
import logger from "../lib/logger.js";
import { fail } from "../utils/response.utils.js";

function errorHandler(err, _req, res, _next) {
	const statusCode = err.statusCode || 500;

	if (statusCode >= 500) {
		logger.error(err);
	} else {
		logger.warn(err.message);
	}

	if (err instanceof ApiError) {
		return fail({
			res,
			statusCode: err.statusCode,
			message: err.message,
			details: err.details || null,
		});
	}

	return fail({
		res,
		statusCode: 500,
		message: "internal server error",
		details: null,
	});
}

export default errorHandler;
