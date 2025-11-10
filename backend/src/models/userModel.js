/**
 * User Model
 * Defines the schema for user data in the database
 */

import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
      type: String,
      validate: {
        validator: (v) => validator.isMobilePhone(v),
        message: "Please provide a valid phone number",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "driver", "company", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    passwordChangedAt: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Index email field for faster queries
userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);
export default User;
