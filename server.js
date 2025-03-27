// installed modules
import mongoose from "mongoose";

// custom modules
import app from "./index.js";

const DB = "mongodb://localhost:27017/UrlShortner";
mongoose
  .connect(DB)
  .then((data) => console.log("Database connected successfully"))
  .catch((err) => console.log("Error occured : ", err));

app.listen(3000, () => console.log("server is running on port 3000"));
