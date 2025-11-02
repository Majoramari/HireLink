import STATUS_CODES from "./Constants/statuscode.js";

// Class Error موحد للتعامل مع كل الأخطاء
export class ServiceError extends Error {
  constructor(message, statusCode = STATUS_CODES.BAD_REQUEST) {
    super(message);
    this.statusCode = statusCode;
  }
}