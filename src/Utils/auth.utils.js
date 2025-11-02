// src/Utils/auth.utils.js
import jwt from "jsonwebtoken";

// /**
//  * Generate JWT token
//  * @param {Object} payload - البيانات اللي عايزين نخزنها في التوكن
//  * @param {String} expiresIn - مدة صلاحية التوكن (default: 7d)
//  * @returns {String} JWT token
//  */

//generate token
export const generateToken = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

//generate refresh token
export const generateRefreshToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

// /**
//  * Verify JWT token
//  * @param {String} token - JWT token
//  * @returns {Object} decoded payload
//  */


export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

// /**
//  * Set JWT token in HTTP-only cookie
//  * @param {Response} res
//  * @param {String} token
//  */


export const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};

// /**
//  * Clear JWT cookie
//  * @param {Response} res
//  */


export const clearTokenCookie = (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
};
