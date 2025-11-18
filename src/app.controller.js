import authRouter from "./Routes/auth.routes.js";
import userRouter from "./Routes/user.routes.js";
import profileRouter from "./Routes/profile.routes.js";
import adminRouter from "./Routes/admin.routes.js";
import companyRouter from "./Routes/company.routes.js";
import jobsRouter from "./Routes/jobs.routes.js";
import notificationRouter from "./Routes/notification.routes.js"; // ✅ أضفنا Notification
import { globalErrorHandler } from "./Utils/errorHandling.utils.js";
import { connectDB } from "../prisma/client.js";

const bootstrap = async (app , express) => {
    
    app.use(express.json());
 
    // connect to database
    await connectDB();
    
    // all routes
    app.use("/api/auth" , authRouter);
    app.use("/api/user" , userRouter);
    app.use("/api/profile", profileRouter)
    app.use("/api/admin" , adminRouter);
    app.use("/api/company" , companyRouter);
    app.use("/api/jobs", jobsRouter );
    app.use("/api/notifications", notificationRouter); // ✅ Route للـ Notifications

    // 404 error Route Not Found
    app.all("/*" , (req , res, next) => {
      return next(new Error("Route Not Found!!", {cause : 404}));
    });
    
    // global error handler middleware
    app.use(globalErrorHandler);
}

export default bootstrap;
