import { z } from "zod";

export const talentProfileSchema = z
	.object({
		firstName: z
			.string({ required_error: "firstName is required" })
			.min(2, { message: "firstName must be at least 2 characters" })
			.optional(),
		lastName: z
			.string({ required_error: "lastName is required" })
			.min(2, { message: "lastName must be at least 2 characters" })
			.optional(),
		headline: z.string().optional(),
		bio: z
			.string()
			.max(1000, { message: "bio must be at most 1000 characters" })
			.optional(),
		location: z.string().optional(),
	})
	.strict();
