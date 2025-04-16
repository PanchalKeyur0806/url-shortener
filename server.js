// installed modules
import mongoose from "mongoose";
import dotenv from "dotenv";

// custom modules
import app from "./index.js";

dotenv.config({ path: "./config.env" });

// connect to the database
const DB =
  "mongodb+srv://PanchalKeyur08:BleachIsPeak8@cluster0.kqdlh.mongodb.net/UrlShortner";
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Database connected successfully"))
  .catch((err) =>
    console.error("❌ MongoDB connection error:", err.name, err.message)
  );

// start the app
app.listen(3000, () => console.log("server is running on port 3000"));
