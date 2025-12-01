import jwt from "jsonwebtoken";
import env from "../config/env.js";
import statusCodes from "../config/statusCodes.js";
import { ApiError } from "../errors/index.js";
import logger from "../lib/logger.js";
import prisma from "../lib/prisma.js";
import errorUtils from "../utils/error.utils.js";
import {
	generateToken,
	generateUlid,
	parseExpiry,
} from "../utils/general.utils.js";
import { result } from "../utils/response.utils.js";
import { emailService } from "./index.js";

// Generate JWT access token
export function generateAccessToken(userId) {
	return jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, {
		expiresIn: env.JWT_ACCESS_EXPIRY,
	});
}

// Generate JWT refresh token
export function generateRefreshToken(userId) {
	return jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
		expiresIn: env.JWT_REFRESH_EXPIRY,
	});
}

// Verify JWT access token
export async function verifyAccessToken(token) {
	try {
		return jwt.verify(token, env.JWT_ACCESS_SECRET);
	} catch (err) {
		return null;
	}
}

// Verify JWT refresh token
export async function verifyRefreshToken(token) {
	try {
		return jwt.verify(token, env.JWT_REFRESH_SECRET);
	} catch (err) {
		return null;
	}
}

export async function store(token, userId) {
	return prisma.refreshToken.create({
		data: {
			id: generateUlid(),
			token,
			userId,
			expiresAt: new Date(Date.now() + parseExpiry(env.JWT_REFRESH_EXPIRY)),
		},
	});
}

async function handleCompromisedUser(userId) {
	try {
		// Generate reset token
		const resetToken = generateToken();

		// Update user and revoke tokens atomically
		await prisma.$transaction(async (tx) => {
			// Update user with reset token
			await tx.user.update({
				where: { id: userId },
				data: {
					password: "",
					verificationToken: resetToken,
					verificationExpiresAt: new Date(
						Date.now() + parseExpiry(env.EMAIL_VERIFICATION_EXPIRY),
					),
				},
			});

			// Revoke all active refresh tokens
			await tx.refreshToken.updateMany({
				where: { userId, revoked: false },
				data: {
					revoked: true,
					revokedAt: new Date(),
				},
			});
		});

		logger.warn(`User ${userId} compromised`);

		// Fetch user email (outside transaction to avoid locking)
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { email: true },
		});

		if (!user) {
			logger.error(`User ${userId} not found after token revocation`);
			return result({
				ok: false,
				statusCode: statusCodes.UNAUTHORIZED,
				message: "invalid token",
			});
		}

		// Send security alert email (non-blocking)
		emailService
			.sendSecurityAlertEmail(
				user.email,
				{
					passwordResetUrl: `${env.FRONTEND_URL}/reset?vt=${resetToken}`,
				},
				{ expiryMinutes: 5 },
			)
			.catch((err) => {
				logger.error("Failed to send security alert email:", err);
			});

		return result({
			ok: false,
			statusCode: statusCodes.UNAUTHORIZED,
			message: "invalid token",
		});
	} catch (error) {
		logger.error("Failed to handle compromised user:", error);
		return result({
			ok: false,
			statusCode: statusCodes.INTERNAL_SERVER_ERROR,
			message: "authentication failed",
		});
	}
}

export async function rotateRefreshToken(incomingToken) {
	try {
		const decoded = await verifyRefreshToken(incomingToken);

		if (!decoded?.id) {
			throw new ApiError(statusCodes.UNAUTHORIZED, "invalid token");
		}

		// Check whether this token exists in DB
		const existing = await prisma.refreshToken.findUnique({
			where: { token: incomingToken },
		});

		// Token reuse detected - possible token theft
		if (!existing) {
			logger.warn(`Token reuse detected for user ${decoded.id}`);
			return await handleCompromisedUser(decoded.id);
		}

		// Token replay detected - compromised token used again
		if (existing.revoked) {
			logger.warn(`Token replay detected for user ${decoded.id}`);
			return await handleCompromisedUser(decoded.id);
		}

		// Check token expiration
		if (existing.expiresAt < new Date()) {
			logger.debug(`Expired token used by user ${decoded.id}`);
			return result({
				ok: false,
				statusCode: statusCodes.UNAUTHORIZED,
				message: "token expired",
			});
		}

		// Valid token - rotate it
		const newToken = generateRefreshToken(decoded.id);

		// Revoke old token and store new token atomically
		await prisma.$transaction(async (tx) => {
			await tx.refreshToken.update({
				where: { token: incomingToken },
				data: { revoked: true, revokedAt: new Date() },
			});

			await tx.refreshToken.create({
				data: {
					id: generateUlid(),
					token: newToken,
					userId: decoded.id,
					expiresAt: new Date(Date.now() + parseExpiry(env.JWT_REFRESH_EXPIRY)),
				},
			});
		});

		return result({
			ok: true,
			statusCode: statusCodes.OK,
			message: "token rotated",
			payload: {
				refreshToken: newToken,
				userId: decoded.id, // Add userId so auth service can generate access token
			},
		});
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		logger.error("Token rotation failed:", error);
		throw new ApiError(
			statusCodes.INTERNAL_SERVER_ERROR,
			"token rotation failed",
		);
	}
}

export async function revokeRefreshToken(token) {
	try {
		// Verify the token is valid
		const decoded = await verifyRefreshToken(token);

		if (!decoded?.id) {
			return result({
				ok: false,
				statusCode: statusCodes.BAD_REQUEST,
				message: "invalid refresh token",
			});
		}

		// Find and revoke the token
		const existing = await prisma.refreshToken.findUnique({
			where: { token },
		});

		if (!existing) {
			// Token doesn't exist in DB - might have been deleted already
			return result({
				ok: true,
				statusCode: statusCodes.OK,
				message: "logged out successfully",
			});
		}

		if (existing.revoked) {
			// Already revoked
			return result({
				ok: true,
				statusCode: statusCodes.OK,
				message: "logged out successfully",
			});
		}

		// Revoke the token
		await prisma.refreshToken.update({
			where: { token },
			data: {
				revoked: true,
				revokedAt: new Date(),
			},
		});

		logger.debug(`User ${decoded.id} logged out`);

		return result({
			ok: true,
			statusCode: statusCodes.OK,
			message: "logged out successfully",
		});
	} catch (error) {
		logger.error("Logout failed:", error);
		// Even if there's an error, we still want to clear the client's cookie
		// So return success
		return result({
			ok: true,
			statusCode: statusCodes.OK,
			message: "logged out successfully",
		});
	}
}

export async function revokeAllRefreshTokens(userId) {
	try {
		const result = await prisma.refreshToken.updateMany({
			where: {
				userId,
				revoked: false,
			},
			data: {
				revoked: true,
				revokedAt: new Date(),
			},
		});

		logger.info(`Revoked ${result.count} tokens for user ${userId}`);

		return {
			ok: true,
			count: result.count,
		};
	} catch (error) {
		logger.error("Failed to revoke all tokens:", error);
		throw error;
	}
}
