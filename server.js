import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import "express-async-errors";
import bootsrap from "./src/app.controller.js"

// ✅ Load environment variables first
dotenv.config();

// ✅ Create app instance
const app = express();

// ✅ Middlewares
app.use(express.json());

// ✅ Cookie parser
app.use(cookieParser());

// ✅ Routes
await bootsrap(app , express);

// ✅ Port
const PORT = process.env.PORT || 5200;

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
