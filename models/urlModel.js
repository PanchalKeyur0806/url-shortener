import mongoose from "mongoose";

const urlSchema = mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      // required: true,
    },
    visitHistory: [{ timestamp: { type: Number, default: Date.now } }],
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", urlSchema);

export default Url;
