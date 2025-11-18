import { Router } from "express";
import verifyToken from "../Middlewares/verifyToken.js";
import { upload } from "../Middlewares/uploadCV.js";
import { 
  createJob, 
  deleteJob, 
  getAllJobs, 
  getJobById, 
  updateJobById,
  applyForJob,
  getApplicantsByJobId,
  updateApplicationStatus
} from "../Controllers/jobs.controller.js";

const router = Router();

// =====================
// 🧱 CRUD الوظائف
// =====================
router.post("/", verifyToken, createJob); // إنشاء وظيفة
router.put("/:id", verifyToken, updateJobById); // تعديل وظيفة
router.delete("/:id", verifyToken, deleteJob); // حذف وظيفة

// =====================
// 👥 عرض المتقدّمين لكل وظيفة (لازم تكون الشركة مالكة الوظيفة)
// مهم: لازم يكون قبل الـ "/:id" عشان ميتغلبش
// =====================
router.get("/:id/applications", verifyToken, getApplicantsByJobId);

// =====================
// 🔄 تعديل حالة الطلب
// Endpoint: PATCH /api/jobs/applications/:id/status
// =====================
router.patch("/applications/:id/status", verifyToken, updateApplicationStatus);

// =====================
// 🧾 التقديم على وظيفة
// =====================
router.post("/:id/apply", verifyToken, upload.single("cv"), applyForJob);

// =====================
// جلب الوظائف
// =====================
router.get("/", getAllJobs); // كل الوظائف
router.get("/:id", getJobById); // وظيفة واحدة

export default router;
