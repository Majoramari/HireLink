import sendEmail from "../lib/email.js";
import { renderTemplate } from "../utils/renderTemplate.utils.js";

export async function sendVerificationEmail(
	to,
	verificationUrl,
	{ expiryMinutes = 5 },
) {
	const safeUrl = encodeURI(verificationUrl);

	const html = await renderTemplate("verifyEmail.ejs", {
		verificationUrl: safeUrl,
		expiryMinutes,
	});

	return sendEmail({
		to,
		subject: "[Hirelink] Verify Your Email",
		html,
	});
}

export async function sendSecurityAlertEmail(
	to,
	passwordResetUrl,
	{ expiryMinutes = 5 },
) {
	const safeUrl = encodeURI(passwordResetUrl);

	const html = await renderTemplate("securityAlert.ejs", {
		passwordResetUrl: safeUrl,
		expiryMinutes,
	});

	return sendEmail({
		to,
		subject: "[Hirelink] Reset your password",
		html,
	});
}

export async function sendPasswordResetEmail(
	to,
	resetUrl,
	{ expiryMinutes = 5 },
) {
	const safeUrl = encodeURI(resetUrl);
	const html = await renderTemplate("passwordReset.ejs", {
		resetUrl: safeUrl,
		expiryMinutes,
	});

	return sendEmail({
		to,
		subject: "[Hirelink] Reset Your Password",
		html,
	});
}
