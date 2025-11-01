// src/Controllers/auth.controller.js
import { userRegister, userLogin } from "../Services/auth.service.js";

// Middleware للتعامل مع الأخطاء
const handleServiceError = (err, res) => {
  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  console.error("Unexpected error:", err);
  return res.status(500).json({ message: "Internal server error" });
};

// ✅ register
export const register = async (req, res, next) => {
  try {
    const { user, token } = await userRegister(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(201).json({ message: "User registered successfully ✅", user });
  } catch (err) {
    handleServiceError(err, res);
  }
};

// ✅ login
export const login = async (req, res, next) => {
  try {
    const { user, token } = await userLogin(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Login successful ✅", user });
  } catch (err) {
    handleServiceError(err, res);
  }
};

// ✅ logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully 🚪" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while logging out 😢" });
  }
};

// ✅ get current user ~> auth/me route
export const getCurrentUser = async (req, res) => {
  try {
    const { id, name, email, role, phone } = req.user; // مفترض req.user موجود من verifyToken
    res.status(200).json({ id, name, email, role, phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
