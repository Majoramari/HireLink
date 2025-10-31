import express from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller.js";
import verifyToken from "../middlewares/verifyToken.js";


const router = express.Router();

// 🟢 GET /profile → بيانات المستخدم الحالي
router.get("/", verifyToken, getProfile);

// 🟡 PUT /profile → تحديث بيانات البروفايل
router.put("/", verifyToken, updateProfile);

export default router;
