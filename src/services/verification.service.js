import env from "../config/env.js";
import prisma from "../lib/prisma.js";
import { generateToken, parseExpiry } from "../utils/general.utils.js";

export async function resendVerificationToken(userId) {
	const verificationToken = generateToken();

	// Create new verification token
	await prisma.user.update({
		where: {
			id: userId,
		},
		data: {
			verificationToken,
			verificationExpiresAt: new Date(
				Date.now() + parseExpiry(env.EMAIL_VERIFICATION_EXPIRY),
			),
		},
	});

	return verificationToken;
}

export async function generatePasswordResetToken(userId) {
	const resetToken = generateToken();

	await prisma.user.update({
		where: { id: userId },
		data: {
			verificationToken: resetToken,
			verificationExpiresAt: new Date(
				Date.now() + parseExpiry(env.EMAIL_VERIFICATION_EXPIRY),
			),
		},
	});

	return resetToken;
}
