import crypto from "node:crypto";
import { ulid } from "ulid";

export const generateUlid = () => {
	return ulid();
};

export const generateToken = (length = 32) => {
	return crypto.randomBytes(length).toString("hex");
};

export const parseIntoArray = (value) => {
	return String(value)
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean);
};

export const parseExpiry = (exp) => {
	const num = parseInt(exp, 10);
	if (exp.endsWith("d")) {
		return num * 24 * 60 * 60 * 1000;
	}
	if (exp.endsWith("h")) {
		return num * 60 * 60 * 1000;
	}
	if (exp.endsWith("m")) {
		return num * 60 * 1000;
	}
	if (exp.endsWith("s")) {
		return num * 1000;
	}
	return num;
};
