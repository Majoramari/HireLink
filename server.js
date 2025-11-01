import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import profileRoutes from "./src/Routes/profile.routes.js";
import authRoutes from "./src/Routes/auth.routes.js";
import companyRoutes from "./src/Routes/company.routes.js";

// ✅ Load environment variables first
dotenv.config();

// ✅ Create app instance
const app = express();

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ All routes under /api
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/companies", companyRoutes);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
