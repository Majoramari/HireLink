import statusCodes from "../config/statusCodes.js";
import { tokenService } from "../services/index.js";
import { fail } from "../utils/response.utils.js";

export default async function requireAuth(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader) {
		return fail({
			res,
			statusCode: statusCodes.UNAUTHORIZED,
			message: "authorization header missing",
		});
	}

	const [scheme, token] = authHeader.split(" ");

	if (scheme !== "Bearer" || !token) {
		return fail({
			res,
			statusCode: statusCodes.BAD_REQUEST,
			message: "invalid auth format",
		});
	}

	const payload = await tokenService.verifyAccessToken(token);
	if (!payload) {
		return fail({
			res,
			statusCode: statusCodes.UNAUTHORIZED,
			message: "invalid or expired token",
		});
	}

	req.user = payload;
	next();
}
