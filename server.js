// installed modules
import mongoose from "mongoose";
import dotenv from "dotenv";

// custom modules
import app from "./index.js";

dotenv.config({ path: "./config.env" });

// connect to the database
const DB = "mongodb://localhost:27017/UrlShortner";
mongoose
  .connect(DB)
  .then((data) => console.log("Database connected successfully"))
  .catch((err) => console.log("Error occured : ", err));

// start the app
app.listen(3000, () => console.log("server is running on port 3000"));
