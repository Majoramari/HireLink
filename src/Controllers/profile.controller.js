import { PrismaClient } from "../generated/prisma/client.js";
import Joi from "joi";

const prisma = new PrismaClient();

// ✅ Validation Schema
const profileSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(), // هيتحدث في جدول User
  title: Joi.string().max(100).optional(),
  bio: Joi.string().max(500).optional(),
  education: Joi.string().max(200).optional(),
  resumeUrl: Joi.string().uri().optional(),
  profilePictureUrl: Joi.string().uri().optional(),
  githubUrl: Joi.string().uri().optional(),
  linkedinUrl: Joi.string().uri().optional(),
  birthDate: Joi.date().optional(),
});

// 🟢 GET /profile
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id; // جاي من verifyToken

    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        experiences: true,
        skills: true,
        languages: true,
        certifications: true,
        user: { select: { name: true, email: true, phone: true } }, // نجيب بيانات المستخدم كمان
      },
    });

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

// 🟡 PUT /profile
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { error } = profileSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, ...profileData } = req.body;

    // لو المستخدم بعت اسم جديد، نحدّثه في جدول User
    if (name) {
      await prisma.user.update({
        where: { id: userId },
        data: { name },
      });
    }

    // شوف هل البروفايل موجود ولا لأ
    const existingProfile = await prisma.profile.findUnique({ where: { userId } });

    let updatedProfile;
    if (existingProfile) {
      updatedProfile = await prisma.profile.update({
        where: { userId },
        data: profileData,
      });
    } else {
      updatedProfile = await prisma.profile.create({
        data: { ...profileData, userId },
      });
    }

    res.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
