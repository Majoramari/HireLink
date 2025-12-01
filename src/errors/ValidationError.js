import ApiError from "./ApiError.js";

export default class ValidationError extends ApiError {
	constructor(message = "invalid input", details = null) {
		super(400, message, details);
	}
}
