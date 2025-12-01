import statusCodes from "../config/statusCodes.js";

export function success({
	res,
	statusCode = statusCodes.OK,
	message = null,
	data = null,
}) {
	return res.status(statusCode).json({
		success: true,
		statusCode,
		message,
		data,
	});
}

export function fail({
	res,
	statusCode = statusCodes.INTERNAL_SERVER_ERROR,
	message = "internal server error",
	details = null,
}) {
	return res.status(statusCode).json({
		success: false,
		statusCode,
		message,
		details,
	});
}

export function result({ ok = false, statusCode, message, payload = null }) {
	return {
		ok,
		statusCode,
		message,
		payload,
	};
}
