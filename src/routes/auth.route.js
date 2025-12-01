import { Router } from "express";
import { authController } from "../controllers/index.js";
import requireAuth from "../middleware/requireAuth.js";
import validate from "../middleware/validate.js";
import {
	loginSchema,
	registerSchema,
	requestPasswordResetSchema,
	resetPasswordSchema,
	verifyEmailSchema,
} from "../validators/auth.validator.js";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/verify", validate(verifyEmailSchema), authController.verifyEmail);
router.post("/login", validate(loginSchema), authController.login);
router.get("/refresh", authController.refresh);

router.post(
	"/reset/request",
	validate(requestPasswordResetSchema),
	authController.requestPasswordReset,
);
router.put(
	"/reset",
	validate(resetPasswordSchema),
	authController.resetPassword,
);

router.get("/me", requireAuth, authController.getCurrent);
router.post("/logout", authController.logout);
router.post("/logout/all", requireAuth, authController.logoutAllDevices);

export default router;
