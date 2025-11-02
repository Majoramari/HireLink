import { verifyToken as jwtVerify } from "../Utils/auth.utils.js";
import { ServiceError } from "../Utils/serviceError.utils.js";


// middleware to verify token
const verifyToken = (req, res, next) => {
  
  let token;

  const authHeader = req.headers["authorization"];

  if (authHeader) token = authHeader.split(" ")[1];

  if (!token && req.cookies) token = req.cookies.token;

  if (!token) throw new ServiceError("Unauthorized: No token provided", 401);

  const decoded = jwtVerify(token); // لو حصل خطأ هيتحول لل handler

  req.user = decoded;

  next();
};

export default verifyToken;
