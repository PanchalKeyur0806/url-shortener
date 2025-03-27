// installed modules
import express from "express";
import cookieParser from "cookie-parser";

// custom modules
import urlRoutes from "./routes/urlRoutes.js";
import authRouter from "./routes/authRoutes.js";
import errorHandler from "./controllers/errorHandler.js";

// creating the app
const app = express();

// global middlewares
app.use(express.json());
app.use(cookieParser());

// routes for the application
app.use("/urls", urlRoutes);
app.use("/auth", authRouter);

// global error hadnling middleware
app.use(errorHandler);

export default app;
