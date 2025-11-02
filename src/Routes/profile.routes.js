import express from "express";
import { getUserProfile, updateUserProfile } from "../Controllers/profile.controller.js";
import verifyToken from "../Middlewares/verifyToken.js";

const router = express.Router();

router.get("/", verifyToken, getUserProfile);

router.put("/", verifyToken, updateUserProfile);

export default router;
