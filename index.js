// core modules
import path from "path";
import { fileURLToPath } from "url";

// installed modules
import express from "express";
import cookieParser from "cookie-parser";
import ejs from "ejs";

// custom modules
import urlRoutes from "./routes/urlRoutes.js";
import authRouter from "./routes/authRoutes.js";
import viewsRouter from "./routes/viewsRoutes.js";
import errorHandler from "./controllers/errorHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// creating the app
const app = express();

// setting up template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// global middlewares
app.use(express.json());
app.use(cookieParser());

// routes for the application's api
app.use("/urls", urlRoutes);
app.use("/auth", authRouter);

// get to the static page
app.use("/", viewsRouter);

// global error hadnling middleware
app.use(errorHandler);

export default app;
