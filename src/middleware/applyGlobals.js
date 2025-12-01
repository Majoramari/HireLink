import timeout from "connect-timeout";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import env from "../config/env.js";
import logger from "../lib/logger.js";
import httpLogMiddleware from "./httpLog.js";

const isProd = process.env.NODE_ENV === "production";

export default function applyGlobalMiddleware(app) {
	// trust the reverse proxy if you will host behind apache or nginx
	app.set("trust proxy", 1);
	app.disable("x-powered-by");

	// --- Dev-only logging ---
	if (!isProd) {
		app.use(httpLogMiddleware);
	}

	// --- Security ---
	// Read more about helmet: https://expressjs.com/en/advanced/best-practice-security.html#use-helmet
	app.use(
		helmet({
			contentSecurityPolicy: isProd ? undefined : false,
			hsts: isProd ? undefined : false,
		}),
	);

	// Prevent HTTP parameter pollution
	app.use(
		hpp({
			whitelist: ["filter"],
		}),
	);

	// --- CORS ---
	app.use(
		cors({
			credentials: true,
			origin: (origin, callback) => {
				// Allow requests with no origin (e.g., Postman, same-origin requests)
				if (!origin) {
					return callback(null, true);
				}

				// Check if origin is in the allowed list
				if (env.ALLOWED_ORIGINS.includes(origin)) {
					return callback(null, true);
				}

				// In production, block all other origins
				if (env.NODE_ENV === "production") {
					return callback(new Error("CORS: Not allowed by CORS"));
				}

				// In dev, allow unknown origins for convenience
				return callback(null, true);
			},
			optionsSuccessStatus: 200,
		}),
	);

	// --- Rate limiting ---
	// It limits the allowed requests to 100 per 15 minutes
	app.use(
		rateLimit({
			windowMs: 15 * 60 * 1000,
			max: 100,
			standardHeaders: true,
			legacyHeaders: false,
			message: "Too many requests from this IP, please try again later.",
		}),
	);

	// --- Parsing ---
	app.use(express.json({ limit: "10mb" }));
	app.use(express.urlencoded({ extended: true, limit: "10mb" }));
	app.use(cookieParser());

	// --- Request timeout ---
	const reqTimeout = 30_000; // 30 seconds
	app.use(timeout(`${reqTimeout}ms`));

	logger.debug("Global middleware applied successfully");
}
