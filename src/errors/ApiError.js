export default class ApiError extends Error {
	constructor(
		statusCode = 500,
		message = "internal server error",
		details = null,
	) {
		super(message);
		this.statusCode = statusCode;
		this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
		this.details = details;
	}
}
