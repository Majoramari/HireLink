import { successResponse } from "../Utils/successResponse.utils.js";
import {
  getAllJobsService,
  createJobService,
  getJobByIdService,
  updateJobByIdService,
  deleteJobService,
  applyForJobService,
  getApplicantsByJobIdService,
  updateApplicationStatusService
} from "../Services/jobs.services.js";
import STATUS_CODES from "../Utils/Constants/statuscode.js";
import { JOBS_MESSAGES, COMMON_MESSAGES } from "../Utils/Constants/messages.js";
import { jobSchemaValidation } from "../Validation/jobs.validation.js";

// إنشاء وظيفة
export const createJob = async (req, res, next) => {
  try {
    const { error, value } = jobSchemaValidation.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const job = await createJobService(req.user.id, value);
    return successResponse({
      res,
      statusCode: STATUS_CODES.CREATED,
      message: COMMON_MESSAGES.CREATED_SUCCESS,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// تعديل وظيفة
export const updateJobById = async (req, res, next) => {
  try {
    const job = await updateJobByIdService(req.params.id, req.user.id, req.body);
    if (!job) throw new Error(JOBS_MESSAGES.NOT_FOUND);
    
    return successResponse({
      res,
      statusCode: STATUS_CODES.OK,
      message: JOBS_MESSAGES.UPDATE_SUCCESS,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// حذف وظيفة
export const deleteJob = async (req, res, next) => {
  try {
    await deleteJobService(req.params.id, req.user.id);
    return successResponse({
      res,
      statusCode: STATUS_CODES.OK,
      message: JOBS_MESSAGES.DELETE_SUCCESS,
    });
  } catch (err) {
    next(err);
  }
};

// جلب وظيفة واحدة
export const getJobById = async (req, res, next) => {
  try {
    const job = await getJobByIdService(req.params.id);
    if (!job) throw new Error(JOBS_MESSAGES.NOT_FOUND);

    return successResponse({
      res,
      statusCode: STATUS_CODES.OK,
      message: JOBS_MESSAGES.FETCH_SUCCESS,
      data: job,
    });
  } catch (err) {
    next(err);
  }
};

// جلب كل الوظائف
export const getAllJobs = async (req, res, next) => {
  try {
    const jobs = await getAllJobsService(req.query);
    return successResponse({
      res,
      statusCode: STATUS_CODES.OK,
      message: JOBS_MESSAGES.ALL_FETCH_SUCCESS,
      data: jobs,
    });
  } catch (err) {
    next(err);
  }
};

// تقديم على وظيفة
export const applyForJob = async (req, res, next) => {
  try {
    const cvUrl = req.file ? req.file.path : null;
    if (!cvUrl) throw new Error("CV file is required");

    const application = await applyForJobService(req.params.id, req.user.id, cvUrl);
    return successResponse({
      res,
      statusCode: STATUS_CODES.CREATED,
      message: JOBS_MESSAGES.APPLICATION_SUCCESS,
      data: application,
    });
  } catch (err) {
    next(err);
  }
};

// عرض المتقدمين لوظيفة
export const getApplicantsByJobId = async (req, res, next) => {
  try {
    const applicants = await getApplicantsByJobIdService(req.params.id, req.user.id);
    return successResponse({
      res,
      statusCode: STATUS_CODES.OK,
      message: "Applicants fetched successfully ✅",
      data: applicants,
    });
  } catch (err) {
    next(err);
  }
};

// تعديل حالة الطلب
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const updated = await updateApplicationStatusService(req.params.id, status);
    return successResponse({
      res,
      statusCode: STATUS_CODES.OK,
      message: `Application status updated to ${status}`,
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};
