import { prisma } from "../../prisma/client.js"
import { COMMON_MESSAGES } from "./Constants/messages.js";
import STATUS_CODES from "./Constants/statuscode.js";




//create record in database
export const createRecord = async (model, data) => {

    if (!prisma[model]) throw new Error(`Model ${model} not found`);
    
    
    
    return await prisma[model].create({ data });
};


                                          /**********************************************************************************/
//get record by id from database
/**
 * Generic getter for a single record by ID
 * @param {Object} options.model - Prisma model (e.g., prisma.job)
 * @param {number|string} options.id - ID of the record
 * @param {Object} options.include - Optional relations to include
 * @param {string} options.resourceName - Resource name for error messages
 * @returns {Object} record
 */


export const getById = async ({ model, id, include = {}, resourceName = "Resource" }) => {

    const record = await model.findUnique({

        where: { id: Number(id) },

    include,
  });

  if (!record) throw new Error(`${resourceName}NotFound`);
  
  return record;
};

                                            /**********************************************************************************/

//check ownership of a record
/**
 * Generic ownership checker
 * @param {Object} record - The record fetched from DB
 * @param {string} userIdField - Field in the record to compare with userId
 * @param {number|string} userId - Current user ID
 */

export const checkOwnership = (record, userIdField, userId) => {

    //if (!record) throw new Error(COMMON_MESSAGES.UNAUTHORIZED , STATUS_CODES.FORBIDDEN);
    if (!record) {
        const error = new Error(COMMON_MESSAGES.UNAUTHORIZED);
        error.status = STATUS_CODES.FORBIDDEN;
        throw error;
    }
    console.log(record[userIdField], "*" , userId );
    
    if (Number(record[userIdField]) !== Number(userId)) throw new Error(COMMON_MESSAGES.UNAUTHORIZED , STATUS_CODES.FORBIDDEN);

};
