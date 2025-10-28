import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: "user" },
    isVerified: { type: Boolean, default: false },
    profilePicture: { type: String, default: "" },
    lastLogin: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
