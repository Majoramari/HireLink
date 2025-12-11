import { Role } from "@prisma/client";
import env from "../config/env.js";
import statusCodes from "../config/statusCodes.js";
import prisma from "../lib/prisma.js";
import errorUtils from "../utils/error.utils.js";
import {
	generateToken,
	generateUlid,
	parseExpiry,
} from "../utils/general.utils.js";
import { result } from "../utils/response.utils.js";

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
				role: Role.TALENT,
				talentProfile: {
					create: {
						// ! TALENT, DO NOT CREATE EMPLOYER PROFILE
						id: generateUlid(),
						...profileData,
					},
				},
			},
			include: {
				talentProfile: true,
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

export async function findByEmail(email) {
	return prisma.user.findUnique({ where: { email } });
}

export async function updateProfile(id, profileData) {
	const user = await prisma.user.update({
		where: { id },
		data: {
			talentProfile: {
				update: {
					...profileData,
				},
			},
		},
		include: {
			talentProfile: true,
		},
	});

	if (!user) {
		return result({
			ok: false,
			statusCode: statusCodes.NOT_FOUND,
			message: "user not found",
		});
	}

	return result({
		ok: true,
		statusCode: statusCodes.OK,
		message: "user updated",
		payload: user,
	});
}
