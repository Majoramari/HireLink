import { successResponse } from "../Utils/successResponse.utils.js";
import { getAllJobsService , createJobService, getJobByIdService, updateJobByIdService, deleteJobService } from "../Services/jobs.services.js";
import STATUS_CODES from "../Utils/Constants/statuscode.js";
import { JOBS_MESSAGES , COMMON_MESSAGES} from "../Utils/Constants/messages.js"
import { jobSchemaValidation } from "../Validation/jobs.validation.js";





//create job
export const createJob = async (req, res, next) => {

    const { error , value } = jobSchemaValidation.validate(req.body);

    if (error) throw new Error(error.details[0].message);
    
    const job = await createJobService(req.user.id , value);

    successResponse({ res, statusCode: STATUS_CODES.CREATED, message: COMMON_MESSAGES.CREATED_SUCCESS, data: job });
};

                                    /**************************************************************************/
//update job => allowed for company only
export const updateJobById = async (req, res, next) => {
  
    
    const job = await updateJobByIdService(req.params.id, req.user.id, req.body);
  
    if (!job) throw new Error(JOBS_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  
    
    successResponse({ res, statusCode: STATUS_CODES.OK, message:JOBS_MESSAGES.UPDATE_SUCCESS , data: job });

};

                                    /**************************************************************************/
// DELETE job
export const deleteJob = async (req, res, next) => {
  
    await deleteJobService(req.params.id, req.user.id);
    
    successResponse({ res, statusCode: STATUS_CODES.OK, message:JOBS_MESSAGES.DELETE_SUCCESS });

};


                                      /************************************************************************/    
// GET job by ID
export const getJobById = async (req, res, next) => {
  
   
    const job = await getJobByIdService(req.params.id);
  
    if (!job) throw new Error(JOBS_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
  
  
    successResponse({ res, statusCode: STATUS_CODES.OK, message:JOBS_MESSAGES.FETCH_SUCCESS , data: job });
  

};


                                     /***********************************************************************/
//GET all jobs
export const getAllJobs = async (req, res, next) => {

    const jobs = await getAllJobsService(req.query);
  
    successResponse({ res, statusCode: STATUS_CODES.OK, message:JOBS_MESSAGES.ALL_FETCH_SUCCESS , data: jobs });
};
