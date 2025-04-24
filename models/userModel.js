import mongoose, { mongo } from "mongoose";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError.js";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
      trim: true,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, "please enter your email address"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "please provide your password"],
      minlength: [8, "password must have atleast 8 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    plan: {
      name: String,
      price: Number,
      durationInDays: Number,
      urlLimit: Number,
      description: String,
      stripeProductId: String,
      stripePriceId: String,
      startDate: Date,
      endDate: Date,
    },
    remainingUrls: {
      type: Number,
      default: 0,
    },
    remainingDays: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
    stripeSubcriptionId: {
      type: String,
      default: null,
    },
    stripeSubcriptionStatus: {
      type: String,
      enum: ["active", "canceled", "incomplete", "past_due", "unpaid"],
      default: null,
    },
    urls: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Url",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

userSchema.virtual("confirmPassword").set(function (value) {
  this._confirmPassword = value;
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  // check confirm password and password field
  if (this._confirmPassword !== this.password) {
    return next(
      new AppError("password and confirm password should be same", 400)
    );
  }

  // create a hashing password
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

// check password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userSchema);

export default User;
