import { parseExpiry } from "../utils/general.utils.js";
import env from "./env.js";

export const refreshCookie = {
	httpOnly: true,
	secure: env.NODE_ENV === "production",
	sameSite: "none",
	maxAge: parseExpiry(env.JWT_REFRESH_EXPIRY),
};
