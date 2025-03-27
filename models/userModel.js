import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError.js";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
    },
    email: {
      type: String,
      required: [true, "please enter your email address"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please provide your password"],
      minlength: [8, "password must have atleast 8 characters"],
      maxlength: [16, "password must have maximum 16 characters"],
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
