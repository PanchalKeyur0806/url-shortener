// core modules
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import morgan from "morgan";

// installed modules
import express, { urlencoded } from "express";
import cookieParser from "cookie-parser";
import ejs from "ejs";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";

// custom modules
import indexRouter from "./routes/indexRoutes.js";
import errorHandler from "./controllers/errorHandler.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import userDashboardRoutes from "./routes/userDashboardRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

import { stripeWebhook } from "./controllers/stripeController.js";
import User from "./models/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// creating the app
const app = express();

// setting up template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  stripeWebhook
);

// global middlewares
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// 1. Create a writable stream (open "access.log" file for writing logs)
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" } // 'a' means append mode, it doesn't overwrite
);

// 2. Setup Morgan middleware to log in 'combined' format and save into access.log
app.use(morgan("combined", { stream: accessLogStream }));

// middleware
app.use((req, res, next) => {
  const originalRender = res.render;

  res.render = async function (view, options, callback) {
    let isLoggedIn = false;
    let isAdmin = false;

    try {
      const token = req.cookies.jwt;
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const findUser = await User.findById(decoded.id);

        if (findUser) {
          isLoggedIn = true;
          isAdmin = findUser.role === "admin";
        }
      }
    } catch (err) {
      console.error("JWT or user error:", err.message);
    }

    options = options || {};
    options.isLoggedIn = isLoggedIn;
    options.isAdmin = isAdmin;

    originalRender.call(this, view, options, callback);
  };

  next();
});

// get to the static page
app.use("/admin", adminRoutes);
app.use("/dashboard", userDashboardRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/subscription", subscriptionRoutes);
app.use("/", indexRouter);

// global error hadnling middleware
app.all("*", (req, res) => {
  res.status(404).render("404", { url: req.originalUrl });
});

app.use(errorHandler);

export default app;
