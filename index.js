import express from "express";
import urlRoutes from "./routes/urlRoutes.js";
import authRouter from "./routes/authRoutes.js";

import errorHandler from "./controllers/errorHandler.js";

// routes

const app = express();

// global middlewares
app.use(express.json());

app.use("/urls", urlRoutes);
app.use("/auth", authRouter);

app.use(errorHandler);

export default app;
