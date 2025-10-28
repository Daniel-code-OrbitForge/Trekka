import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, default: "company" },
    companyAddress: String,
    companyPhone: String,
    industry: String,
    isCompanyVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Company", companySchema);
