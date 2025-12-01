import env from "../config/env.js";
import statusCodes from "../config/statusCodes.js";
import { authService } from "../services/index.js";
import { parseExpiry } from "../utils/general.utils.js";
import { fail, success } from "../utils/response.utils.js";

export async function register(req, res) {
	const result = await authService.register(req.body);

	if (!result.ok) {
		return fail({
			res,
			statusCode: result.statusCode,
			message: result.message,
			details: result.payload,
		});
	}

	return success({
		res,
		statusCode: result.statusCode,
		message: result.message,
		data: result.payload,
	});
}

export async function verifyEmail(req, res) {
	const result = await authService.verifyEmail(req.body);

	if (!result.ok) {
		return fail({
			res,
			statusCode: result.statusCode,
			message: result.message,
			details: result.payload,
		});
	}

	return success({
		res,
		statusCode: result.statusCode,
		message: result.message,
		data: result.payload,
	});
}

export async function login(req, res) {
	const { email, password } = req.body;

	const result = await authService.login(email, password);

	if (!result.ok) {
		return fail({
			res,
			statusCode: result.statusCode,
			message: result.message,
		});
	}

	if (result.payload.requiresVerification) {
		return success({
			res,
			statusCode: result.statusCode,
			message: result.message,
			data: result.payload,
		});
	}

	// Set refresh token cookie
	res.cookie("jwt", result.payload.refreshToken, {
		httpOnly: true,
		maxAge: parseExpiry(env.JWT_REFRESH_EXPIRY),
		secure: env.NODE_ENV === "production",
		sameSite: "none",
	});
	return success({
		res,
		statusCode: statusCodes.OK,
		message: result.message,
		data: {
			token: result.payload.token,
		},
	});
}

export async function refresh(req, res) {
	const { jwt: refreshToken } = req.cookies;
	const result = await authService.refresh(refreshToken);

	if (!result.ok) {
		return fail({
			res,
			statusCode: result.statusCode,
			message: result.message,
			details: result.payload,
		});
	}

	// Set refresh token cookie
	res.cookie("jwt", result.payload.refreshToken, {
		httpOnly: true,
		maxAge: parseExpiry(env.JWT_REFRESH_EXPIRY),
		secure: env.NODE_ENV === "production",
		sameSite: "none",
	});
	return success({
		res,
		statusCode: result.statusCode,
		message: result.message,
		data: {
			token: result.payload.token,
		},
	});
}

export async function getCurrent(req, res) {
	const result = await authService.getCurrent(req.user.id);

	if (!result.ok) {
		return fail({
			res,
			statusCode: result.statusCode,
			message: result.message,
			details: result.payload,
		});
	}

	return success({
		res,
		statusCode: result.statusCode,
		message: result.message,
		data: result.payload,
	});
}

export async function requestPasswordReset(req, res) {
	const result = await authService.requestPasswordReset(req.body.email);

	if (!result.ok) {
		return fail({
			res,
			statusCode: result.statusCode,
			message: result.message,
		});
	}

	return success({
		res,
		statusCode: result.statusCode,
		message: result.message,
	});
}

export async function resetPassword(req, res) {
	const result = await authService.resetPassword(req.body);

	if (!result.ok) {
		return fail({
			res,
			statusCode: result.statusCode,
			message: result.message,
		});
	}

	// Clear refresh token cookie on password reset
	res.clearCookie("jwt", {
		httpOnly: true,
		secure: env.NODE_ENV === "production",
		sameSite: "none",
	});

	return success({
		res,
		statusCode: result.statusCode,
		message: result.message,
	});
}

export async function logout(req, res) {
	const { jwt: refreshToken } = req.cookies;

	const result = await authService.logout(refreshToken);

	// Always clear the cookie, even if the token revocation failed
	res.clearCookie("jwt", {
		httpOnly: true,
		secure: env.NODE_ENV === "production",
		sameSite: "none",
	});

	if (!result.ok) {
		return fail({
			res,
			statusCode: result.statusCode,
			message: result.message,
		});
	}

	return success({
		res,
		statusCode: result.statusCode,
		message: result.message,
	});
}

export async function logoutAllDevices(req, res) {
	const result = await authService.logoutAllDevices(req.user.id);

	// Clear the cookie for current device
	res.clearCookie("jwt", {
		httpOnly: true,
		secure: env.NODE_ENV === "production",
		sameSite: "none",
	});

	if (!result.ok) {
		return fail({
			res,
			statusCode: result.statusCode,
			message: result.message,
		});
	}

	return success({
		res,
		statusCode: result.statusCode,
		message: result.message,
	});
}
