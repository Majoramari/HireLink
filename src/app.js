import express from "express";
import env from "./config/env.js";
import applyGlobalMiddleware from "./middleware/applyGlobals.js";
import errorHandler from "./middleware/errorHandler.js";
import NotFoundMiddleware from "./middleware/notFound.js";
import routes from "./routes/index.js";

const app = express();

// Apply middleware
applyGlobalMiddleware(app);

// Setup routes
app.use(`/api/${env.API_VERSION}`, routes);

// 404 not found
app.use(NotFoundMiddleware);

// Error handler
app.use(errorHandler);

export default app;
