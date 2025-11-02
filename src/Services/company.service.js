import prisma from "../../prisma/client.js";
import { ServiceError } from "../Utils/serviceError.utils.js";
import STATUS_CODES from "../Utils/Constants/statuscode.js";
import { COMPANY_MESSAGES } from "../Utils/Constants/messages.js";



//Create or update company
export const createOrUpdateCompanyService = async (userId, role, companyData) => {

    // Check if user is COMPANY
  if (role !== "COMPANY") throw new ServiceError( COMPANY_MESSAGES.ONLY_COMPANY_USERS_CAN_UPDATE_PROFILE, STATUS_CODES.FORBIDDEN);

  // Update company in database
  const company = await prisma.user.update({
    where: { id: userId },

    data: companyData,
    select: {
      id: true,
      companyName: true,
      description: true,
      location: true,
      website: true,
      industry: true,
      logoUrl: true,
      establishedAt: true,
      role: true
    }
  });

  return company;
};

                           /*****************************************************************************/


//GET company by id
export const getCompanyByIdService = async (companyId) => {

  const company = await prisma.user.findUnique({
    
    where: { id: companyId },
    select: {
      id: true,
      companyName: true,
      description: true,
      location: true,
      website: true,
      industry: true,
      logoUrl: true,
      establishedAt: true,
      role: true
    }
  });

  if (!company || company.role !== "COMPANY") {
    throw new ServiceError("Company not found", 404);
  }

  return company;
};
