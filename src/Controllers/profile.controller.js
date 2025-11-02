import { profileSchema } from "../Validation/profile.validation.js";
import { getProfileByUserId, createOrUpdateProfile } from "../Services/profile.service.js";
import { successResponse } from "../Utils/successResponse.utils.js";
import { PROFILE_MESSAGES } from "../Utils/Constants/messages.js";
import  STATUS_CODES  from "../Utils/Constants/statuscode.js"

// GET /profile
export const getUserProfile = async (req, res, next) => {

   
  
    const profile = await getProfileByUserId(req.user.id);


    successResponse({ 
      res, 
      statusCode: STATUS_CODES.OK , 
      message: PROFILE_MESSAGES.FETCH_SUCCESS, 
      data: profile });
  
};

                                               /***************************************************************************************/

// PUT /profile
export const updateUserProfile = async (req, res, next) => {
  
    const { error } = profileSchema.validate(req.body);

    if (error) throw new Error(error.details[0].message); // أو ServiceError لو حابة

    const { name, ...profileData } = req.body; //...destruct
    
    const updatedProfile = await createOrUpdateProfile(req.user.id, profileData, name);

    successResponse({ res, statusCode: STATUS_CODES.OK, message: PROFILE_MESSAGES.UPDATE_SUCCESS, data: updatedProfile });
  
};

                                        

