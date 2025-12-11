import { Role } from "@prisma/client";
import env from "../config/env.js";
import prisma from "../lib/prisma.js";
import {
	generateToken,
	generateUlid,
	parseExpiry,
} from "../utils/general.utils.js";
import errorUtils from "../utils/error.utils.js";
import { result } from "../utils/response.utils.js";
import statusCodes from "../config/statusCodes.js";

export async function createProfile({ email, password, profileData }) {
	const verificationToken = generateToken();

	const [error, user] = await errorUtils(
		prisma.user.create({
			data: {
				id: generateUlid(),
				email,
				password,
				verificationToken,
				verificationExpiresAt: new Date(
					Date.now() + parseExpiry(env.EMAIL_VERIFICATION_EXPIRY),
				),
				role: Role.EMPLOYER,
				employerProfile: {
					// ! EMPLOYER, DO NOT CREATE TALENT PROFILE
					create: {
						id: generateUlid(),
						...profileData,
					},
				},
			},
			include: {
				employerProfile: true,
			},
		}),
	);

	if (error) {
		return result({
			ok: false,
			statusCode: statusCodes.CONFLICT,
			message: "user with this email already exists",
		});
	}

	return result({
		ok: true,
		statusCode: statusCodes.CREATED,
		message: "user created",
		payload: user,
	});
}
