import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import profileRoutes from "./src/Routes/profile.routes.js";
import authRoutes from "./src/Routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// ✅ كل الـ Routes تبقى تحت /api
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
