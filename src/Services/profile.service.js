// src/Services/profile.service.js
import prisma from "../../prisma/client.js";
import { ServiceError } from "../Utils/serviceError.utils.js";



// جلب بيانات البروفايل
export const getProfileByUserId = async (userId) => {

  const profile = await prisma.profile.findUnique({

    where: { userId },
    
    include: {
      experiences: true,
      skills: true,
      languages: true,
      certifications: true,
      user: { 
        select: { name: true, email: true, phone: true } },
    },
  });

  if (!profile) throw new ServiceError("Profile not found", 404);

  return profile;
};


                                   /*************************************************************************/

// تحديث أو إنشاء البروفايل
export const createOrUpdateProfile = async (userId, profileData, name) => {
  // تحديث اسم المستخدم لو موجود
  if (name) {

    await prisma.user.update({
    
        where: { id: userId },
      data: { name },
    
    });

  }

  const existingProfile = await prisma.profile.findUnique({ where: { userId } });

  if (existingProfile) {

    return await prisma.profile.update({
    
        where: { userId },
    
        data: profileData,
    });
  
} else {

    return await prisma.profile.create({

        data: { ...profileData, userId },

    });
  }
};
