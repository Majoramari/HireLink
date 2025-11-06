import { prisma } from "../../prisma/client.js";
import { getPagination } from "../Utils/pagination.utils.js";
import { buildFilters } from "../Utils/filters.utils.js";
import { createRecord } from "../Utils/db.utils.js";
import { JOBS_MESSAGES } from "../Utils/Constants/messages.js";
import STATUS_CODES from "../Utils/Constants/statuscode.js";
import { ServiceError } from "../Utils/serviceError.utils.js";
import { getById, checkOwnership } from "../Utils/db.utils.js";




//create job
export const createJobService = async (userId , jobData) => {
    
    const company = await prisma.user.findFirst({ where: { id: userId , role: "COMPANY"} });

    if (!company) throw new ServiceError( JOBS_MESSAGES.ONLY_COMPANY_CAN_CREATE_JOB, STATUS_CODES.FORBIDDEN);
    
    return createRecord("job", { ...jobData, companyId: company.id });

};
                             /*********************************************************************************/
//update job by id
export const updateJobByIdService = async (jobId, userId, jobData) => {

    //get job by id
    const job = await getById({
        model: prisma.job,
        id: jobId,
        include: { company: true},
        resourceName: "Job"
    });
    
    //ownership check => check if job belongs to company user 
    //ownership check function is in db.utils
    checkOwnership(job.company, "id" ,userId);

    return await prisma.job.update({ where: { id: Number(jobId) }, data: jobData });

};

                              /********************************************************************************/

// DELETE job => hard delete
export const deleteJobService = async (id, userId) => {

    //return job + its company
    const job = await getById({
        model: prisma.job,
        id,
        include: { company: true},
        resourceName: "Job"
    });
    
    //ownership check => check if job belongs to company user 
    //ownership check function is in db.utils 
    checkOwnership(job.company, "id" , userId);

    //hard delete
  await prisma.job.delete({ where: { id: Number(id) } });

  return JOBS_MESSAGES.DELETE_SUCCESS;
};

                              /**********************************************************************************/
// GET job by ID
export const getJobByIdService = async (id) => {
    const jobId = Number(id);

    if (isNaN(jobId)) return null;

    const job = await prisma.job.findUnique({ where: { id: Number(id) } });

  return job;
};


                               /*******************************************************************************/
//Get all jobs with search, filter, and pagination
export const getAllJobsService = async ( params ) => {
    
    const { page , limit, search, ...filterParam } = params;

    //pagination
    const { skip, take } = getPagination(page, limit);

    //filtering
    const filters = buildFilters(filterParam, {
        numericFields: ["companyId" , "salaryRange"],
        booleanFields: ['isRemote']
    });

    //search
    if (search) {
    filters.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } }
    ];
   }
  
    return prisma.job.findMany({
    
        skip,
        take,
        where: filters,
    
        include: {
            company: true
        }
    });

};