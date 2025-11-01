// src/Services/auth.service.js
import { hash, compare } from "../Utils/hash.utils.js";
import { PrismaClient } from "../generated/prisma/client.js";
const prisma = new PrismaClient();

import { generateToken } from "../Utils/jwt.utils.js";

// Class Error موحد للتعامل مع كل الأخطاء
class ServiceError extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ✅ register service
export const userRegister = async ({ name, email, password, phone, role }) => {
  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists) throw new ServiceError("Email already exists", 409);

  const hashedPassword = await hash({ plainText: password });

  const newUser = await prisma.user.create({
    data: { name, email, password: hashedPassword, phone, role },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      createdAt: true,
      isActive: true,
      emailVerified: true,
    },
  });

  const token = generateToken({ id: newUser.id, role: newUser.role });

  return { user: newUser, token };
};

// ✅ login service
export const userLogin = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      password: true, // لازم علشان نعمل compare
      createdAt: true,
      isActive: true,
      emailVerified: true,
    },
  });

  if (!user) throw new ServiceError("User not found", 404);

  const isMatch = await compare({ plainText: password, hash: user.password });
  if (!isMatch) throw new ServiceError("Invalid password", 401);

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  // نحذف كلمة السر قبل الإرجاع
  delete user.password;

  return { user, token };
};





