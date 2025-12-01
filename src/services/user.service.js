import { z } from "zod";
import prisma from "../lib/prisma.js";

export async function findUser(identifier) {
	if (!identifier) {
		return null;
	}

	// If it looks like an email
	if (z.email().safeParse(identifier).success) {
		return prisma.user.findUnique({
			where: { email: identifier },
			include: {
				talentProfile: true,
				employerProfile: true,
			},
		});
	}

	// Otherwise treat it as id
	return prisma.user.findUnique({
		where: { id: identifier },
		include: {
			talentProfile: true,
			employerProfile: true,
		},
	});
}
