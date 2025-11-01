// src/routes/company.routes.js
import { Router } from "express";
import { createOrUpdateCompany, getCompanyById } from "../Controllers/Company.controller.js";
import verifyToken from "../Middlewares/verifyToken.js";

const router = Router();

// POST → إنشاء أو تعديل الشركة
router.post("/", verifyToken, createOrUpdateCompany);

// GET → جلب بيانات الشركة حسب id
router.get("/:id", verifyToken, getCompanyById);

export default router;
