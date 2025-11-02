import { Router } from "express";
import { register, login, logout, getCurrentUser } from "../Controllers/auth.controller.js";
import { registerSchema, loginSchema } from "../Validation/auth.validation.js";
import { validateBody } from "../Middlewares/validate.middleware.js";
import  verifyToken  from "../Middlewares/verifyToken.js";

const router = Router();

// تسجيل مستخدم جديد
router.post("/register", validateBody(registerSchema), register);

// تسجيل دخول
router.post("/login", validateBody(loginSchema), login);

//user logout 
router.post("/logout", verifyToken ,logout);


// GET /auth/me - معلومات المستخدم الحالي 
router.get("/me", verifyToken, getCurrentUser);


export default router;
