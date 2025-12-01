import { Role } from "@prisma/client";
import env from "../config/env.js";
import prisma from "../lib/prisma.js";
import {
	generateToken,
	generateUlid,
	parseExpiry,
} from "../utils/general.utils.js";

export async function createProfile({ email, password, profileData }) {
	const verificationToken = generateToken();

	return prisma.user.create({
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
	});
}
