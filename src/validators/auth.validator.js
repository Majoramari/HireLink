import { z } from "zod";

// Base validation schemas
const emailSchema = z.email({
	message: "invalid email address",
});
const passwordSchema = z
	.string()
	.min(8, { message: "must be at least 8 characters" })
	.max(32, { message: "must be at most 32 characters" })
	.regex(/[A-Z]/, { message: "must include uppercase letters" })
	.regex(/[a-z]/, { message: "must include lowercase letters" })
	.regex(/[0-9]/, { message: "must include numbers" })
	.regex(/[^A-Za-z0-9]/, { message: "must include special characters" })
	.regex(/^(?!.*(.)\1\1).*$/, {
		message: "cannot contain three repeating characters",
	});

// Role enum
const roleSchema = z.enum(["TALENT", "EMPLOYER"], {
	errorMap: () => ({ message: "role must be either TALENT or EMPLOYER" }),
});

// Talent profile schema
const talentProfileSchema = z
	.object({
		firstName: z
			.string({ required_error: "firstName is required" })
			.min(2, { message: "firstName must be at least 2 characters" }),
		lastName: z
			.string({ required_error: "lastName is required" })
			.min(2, { message: "lastName must be at least 2 characters" }),
		headline: z.string().optional(),
		bio: z
			.string()
			.max(1000, { message: "bio must be at most 1000 characters" })
			.optional(),
		location: z.string().optional(),
		avatarUrl: z.url({ message: "invalid avatar URL" }).optional(),
		resumeUrl: z.url({ message: "invalid resume URL" }).optional(),
	})
	.strict();

// Employer profile schema
const employerProfileSchema = z
	.object({
		companyName: z
			.string({ required_error: "companyName is required" })
			.min(1, { message: "companyName is required" }),
		website: z.url({ message: "invalid website URL" }).optional(),
		description: z
			.string()
			.max(1000, { message: "description must be at most 1000 characters" })
			.optional(),
		location: z.string().optional(),
		logoUrl: z.url({ message: "invalid logo URL" }).optional(),
	})
	.strict();

// Register schema with role-based validation
export const registerSchema = z
	.object({
		email: emailSchema,
		password: passwordSchema,
		role: roleSchema,
		profileData: z.unknown(),
	})
	.superRefine((data, ctx) => {
		// Check if profileData exists
		if (!data.profileData || typeof data.profileData !== "object") {
			ctx.addIssue({
				code: "invalid_type",
				expected: "object",
				received: typeof data.profileData,
				path: ["profileData"],
				message: "profile data is required",
			});
			return;
		}
		// Validate profileData based on role
		if (data.role === "TALENT") {
			const result = talentProfileSchema.safeParse(data.profileData);
			if (!result.success) {
				result.error.issues.forEach((issue) => {
					ctx.addIssue({
						...issue,
						path: ["profileData", ...issue.path],
					});
				});
			}
		} else if (data.role === "EMPLOYER") {
			const result = employerProfileSchema.safeParse(data.profileData);
			if (!result.success) {
				result.error.issues.forEach((issue) => {
					ctx.addIssue({
						...issue,
						path: ["profileData", ...issue.path],
					});
				});
			}
		}
	});

export const verifyEmailSchema = z.object({
	verificationToken: z
		.string({ required_error: "required" })
		.min(1, { message: "cannot be empty" })
		.length(64, { message: "invalid format" }),
});

export const loginSchema = z.object({
	email: emailSchema,
	password: z
		.string({ required_error: "required" })
		.min(1, { message: "required" })
		.max(32, { message: "must be at most 64 characters" }),
});

export const requestPasswordResetSchema = z.object({
	email: z.email("invalid email format"),
});

export const resetPasswordSchema = z.object({
	verificationToken: z.string().min(1, "verification token is required"),
	newPassword: z
		.string()
		.min(8, "password must be at least 8 characters")
		.max(128, "password is too long")
		.min(8, { message: "must be at least 8 characters" })
		.max(32, { message: "must be at most 32 characters" })
		.regex(/[A-Z]/, { message: "must include uppercase letters" })
		.regex(/[a-z]/, { message: "must include lowercase letters" })
		.regex(/[0-9]/, { message: "must include numbers" })
		.regex(/[^A-Za-z0-9]/, { message: "must include special characters" })
		.regex(/^(?!.*(.)\1\1).*$/, {
			message: "cannot contain three repeating characters",
		}),
	oldPassword: z.string().optional(),
});
