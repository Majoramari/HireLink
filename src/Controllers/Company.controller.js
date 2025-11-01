// src/controllers/company.controller.js
import { PrismaClient } from "../generated/prisma/client.js"; // صحح المسار
const prisma = new PrismaClient();
export default prisma;

// خطأ موحد
const handleServiceError = (err, res) => {
  if (err.statusCode) return res.status(err.statusCode).json({ message: err.message });
  console.error("Unexpected error:", err);
  return res.status(500).json({ message: "Internal server error" });
};

// إنشاء أو تعديل بيانات الشركة
export const createOrUpdateCompany = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized: No token provided" });
    if (req.user.role !== "COMPANY") return res.status(403).json({ message: "Only COMPANY users can update profile" });

    const { companyName, description, location, website, industry, logoUrl, establishedAt } = req.body;

    const company = await prisma.user.update({
      where: { id: req.user.id },
      data: { companyName, description, location, website, industry, logoUrl, establishedAt },
      select: { id: true, companyName: true, description: true, location: true, website: true, industry: true, logoUrl: true, establishedAt: true, role: true }
    });

    res.status(201).json({ message: "Company profile created/updated successfully", company });
  } catch (err) {
    handleServiceError(err, res);
  }
};

// جلب بيانات الشركة حسب id
export const getCompanyById = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized: No token provided" });

    const id = Number(req.params.id);
    const company = await prisma.user.findUnique({
      where: { id },
      select: { id: true, companyName: true, description: true, location: true, website: true, industry: true, logoUrl: true, establishedAt: true, role: true }
    });

    if (!company || company.role !== "COMPANY") return res.status(404).json({ message: "Company not found" });

    res.status(200).json(company);
  } catch (err) {
    handleServiceError(err, res);
  }
};

