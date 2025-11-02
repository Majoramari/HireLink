// src/Constants/messages.js

export const AUTH_MESSAGES = {
  REGISTER_SUCCESS: "User registered successfully ✅",
  LOGIN_SUCCESS: "Login successful ✅",
  LOGOUT_SUCCESS: "Logged out successfully 🚪",
  CURRENT_USER_SUCCESS: "Current user details fetched successfully",
  EMAIL_EXISTS: "Email already exists",
  USER_NOT_FOUND: "User not found",
  INVALID_PASSWORD: "Invalid password",
  INVALID_TOKEN: "Invalid token",
  
};

export const PROFILE_MESSAGES = {
  FETCH_SUCCESS: "Profile fetched successfully 👤",
  UPDATE_SUCCESS: "Profile updated successfully ✏️",
  NOT_FOUND: "Profile not found",
};

export const COMPANY_MESSAGES = {
  CREATED_OR_UPDATED: "Company created or updated successfully 🏢",
  FETCH_SUCCESS: "Company details fetched successfully",
  NOT_FOUND: "Company not found",
  DELETE_SUCCESS: "Company deleted successfully",
  ALL_FETCH_SUCCESS: "All companies fetched successfully",
  ONLY_COMPANY_USERS_CAN_UPDATE_PROFILE: "Only COMPANY users can update profile",
  
};

export const COMMON_MESSAGES = {
  UNAUTHORIZED: "Unauthorized access 🚫",
  FORBIDDEN: "You do not have permission to perform this action",
  SERVER_ERROR: "Internal server error 😢",
  NOT_FOUND: "Resource not found",
};

export const USER_MESSAGES = {
  FETCH_SUCCESS: "User details fetched successfully 👤",
  NOT_FOUND: "User not found",
};
