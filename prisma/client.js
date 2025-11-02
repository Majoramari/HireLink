// database/client.js
// import dotenv from "dotenv";
// dotenv.config();

import { PrismaClient } from "../src/generated/prisma/client.js";
//import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// connect to DB
export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

// disconnect from DB
export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log("🛑 Database connection closed.");
  } catch (error) {
    console.error("❌ Error closing database connection:", error);
  }
};

export default prisma;
