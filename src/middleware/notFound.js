import { fail } from "../utils/response.utils.js";

export default function notFoundMiddleware(_req, res) {
	return fail({
		res,
		statusCode: 404,
		message: `route not found`,
		details: null,
	});
}
