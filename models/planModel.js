import mongoose from "mongoose";

const planSchema = mongoose.Schema({
  name: {
    type: String,
    enum: ["free", "monthly", "yearly"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  durationInDays: {
    type: Number,
    required: true,
  },
  urlLimit: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
});

const Plan = mongoose.model("Plan", planSchema);

export { Plan };
