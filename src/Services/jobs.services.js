import { prisma } from "../../prisma/client.js";
import { createRecord, getById, checkOwnership } from "../Utils/db.utils.js";
import STATUS_CODES from "../Utils/Constants/statuscode.js";
import { JOBS_MESSAGES } from "../Utils/Constants/messages.js";
import { ServiceError } from "../Utils/serviceError.utils.js";

// ======================
// إنشاء وظيفة
// ======================
export const createJobService = async (userId, jobData) => {
  const company = await prisma.user.findFirst({ where: { id: userId, role: "COMPANY" } });
  if (!company) throw new ServiceError(JOBS_MESSAGES.ONLY_COMPANY_CAN_CREATE_JOB, STATUS_CODES.FORBIDDEN);
  return createRecord("job", { ...jobData, companyId: company.id });
};

// ======================
// تعديل وظيفة
// ======================
export const updateJobByIdService = async (jobId, userId, jobData) => {
  const job = await getById({ model: prisma.job, id: jobId, include: { company: true }, resourceName: "Job" });
  checkOwnership(job.company, "id", userId);
  return prisma.job.update({ where: { id: Number(jobId) }, data: jobData });
};

// ======================
// حذف وظيفة
// ======================
export const deleteJobService = async (id, userId) => {
  const job = await getById({ model: prisma.job, id, include: { company: true }, resourceName: "Job" });
  checkOwnership(job.company, "id", userId);
  await prisma.job.delete({ where: { id: Number(id) } });
  return JOBS_MESSAGES.DELETE_SUCCESS;
};

// ======================
// جلب وظيفة واحدة
// ======================
export const getJobByIdService = async (id) => {
  const jobId = Number(id);
  if (isNaN(jobId)) return null;
  return prisma.job.findUnique({ where: { id: jobId } });
};

// ======================
// جلب كل الوظائف
// ======================
export const getAllJobsService = async (params) => {
  const { page, limit, search, ...filterParam } = params;
  const { skip, take } = require("../Utils/pagination.utils.js").getPagination(page, limit);
  const filters = require("../Utils/filters.utils.js").buildFilters(filterParam, {
    numericFields: ["companyId", "salaryRange"],
    booleanFields: ["isRemote"]
  });
  if (search) {
    filters.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } }
    ];
  }
  return prisma.job.findMany({ skip, take, where: filters, include: { company: true } });
};

// ======================
// تقديم على وظيفة
// ======================
export const applyForJobService = async (jobId, applicantId, cvUrl) => {
  const id = Number(jobId);
  if (isNaN(id)) throw new Error("Invalid job ID");

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) throw new Error(JOBS_MESSAGES.NOT_FOUND);

  return prisma.application.create({
    data: { jobId: id, applicantId, cvUrl, status: "PENDING" },
  });
};

// ======================
// عرض المتقدمين لكل وظيفة
// GET /employer/jobs/:id/applications
// ======================
export const getApplicantsByJobIdService = async (jobId, companyId) => {
  const job = await prisma.job.findUnique({
    where: { id: Number(jobId) },
    include: { company: true },
  });
  if (!job) throw new ServiceError(JOBS_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  checkOwnership(job.company, "id", companyId);

  return prisma.application.findMany({
    where: { jobId: Number(jobId) },
    include: {
      applicant: {
        select: { id: true, name: true, email: true },
      },
    },
  });
};

// ======================
// تعديل حالة الطلب
// PATCH /applications/:id/status
// ======================
export const updateApplicationStatusService = async (applicationId, status) => {
  const validStatuses = ["PENDING", "ACCEPTED", "REJECTED"];
  if (!validStatuses.includes(status.toUpperCase())) {
    throw new ServiceError("Invalid status", STATUS_CODES.BAD_REQUEST);
  }

  const application = await prisma.application.findUnique({
    where: { id: Number(applicationId) },
  });
  if (!application) throw new ServiceError("Application not found", STATUS_CODES.NOT_FOUND);

  return prisma.application.update({
    where: { id: Number(applicationId) },
    data: { status: status.toUpperCase() },
  });
};
