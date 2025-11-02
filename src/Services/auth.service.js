import { hash, compare } from "../Utils/hash.utils.js";
import prisma from "../../prisma/client.js";
import { ServiceError } from "../Utils/serviceError.utils.js";
import { generateToken } from "../Utils/auth.utils.js";
import { AUTH_MESSAGES } from "../Utils/Constants/messages.js";
import STATUS_CODES from "../Utils/Constants/statuscode.js";



// ✅ register service
export const userRegister = async ({ name, email, password, phone, role }) => {

  const userExists = await prisma.user.findUnique({ where: { email } });
  
  if (userExists) throw new ServiceError( AUTH_MESSAGES.EMAIL_EXISTS , STATUS_CODES.CONFLICT);

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



                           /***********************************************************************/

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

  if (!user) throw new ServiceError( AUTH_MESSAGES.USER_NOT_FOUND, STATUS_CODES.NOT_FOUND);

  const isMatch = await compare({ plainText: password, hash: user.password });
  if (!isMatch) throw new ServiceError("Invalid password", 401);

  const token = generateToken({ id: user.id, email: user.email, role: user.role });

  // نحذف كلمة السر قبل الإرجاع
  delete user.password;

  return { user, token };
};





