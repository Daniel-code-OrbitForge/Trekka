import crypto, { sign } from "crypto";
import Company from "../models/companyModel.js";
import { tokenService } from "./tokenService.js";
import { passwordService } from "./passwordService.js";
import { emailService } from "./emailService.js";
import User from "../models/userModel.js";

export const companyAuthService = {
  async signUpCompany({
    companyName,
    companyEmail,
    password,
    companyAddress,
    companyPhone,
    industry,
  }) {
    const existingCompany = await Company.findOne({ companyEmail });

    if (existingCompany) throw new Error("Company already exists");

    const hashedPassword = await passwordService.hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const company = await Company.create({
      companyName,
      companyEmail,
      password: hashedPassword,
      role: "company",
      companyAddress,
      companyPhone,
      industry,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: Date.now() + 3600000, // 1 hour
    });

    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}&email=${companyEmail}`;
    await emailService.sendEmail(
      company.companyEmail,
      "Verify your company email",
      `<p>Welcome ${companyName}! Please verify your email by clicking <a href="${verifyUrl}">here</a></p>`
    );
    return company;
  },

  async loginCompany({ companyEmail, password }) {
    const company = await Company.findOne({ companyEmail, role: "company" });
    if (!company) throw new Error("Invalid email or password");

    const validPassword = await passwordService.comparePassword(
      password,
      company.password
    );
    if (!validPassword) throw new Error("Invalid email or password");

    const token = tokenService.generateToken({
      id: company._id,
      role: company.role,
    });
    company.lastLogin = Date.now();
    await company.save();

    return { company, token };
  },

  async verifyCompanyEmail(token) {
    const company = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
      role: "company",
    });
    if (!company) throw new Error("Invalid or expired token");

    company.isCompanyVerified = true;
    company.emailVerificationToken = undefined;
    company.emailVerificationExpires = undefined;
    await company.save();

    return company;
  },

  async forgetCompanyPassword(companyEmail) {
    const company = await User.findOne({ companyEmail, role: "company" });
    if (!company) throw new Error("Company not found");

    // Generate a password reset token and expiration
    const resetToken = crypto.randomBytes(32).toString("hex");
    company.passwordResetToken = resetToken;
    company.passwordResetExpires = Date.now() + 3600000; // 1 hour
    await company.save();

    // Send the password reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${companyEmail}`;
    await emailService.sendEmail(
      company.companyEmail,
      "Reset your password",
      `<p>Please reset your password by clicking <a href="${resetUrl}">here</a></p>`
    );
  },

  async resetCompanyPassword(token, newPassword) {
    const company = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
      role: "company",
    });
    if (!company) throw new Error("Invalid or expired token");

    company.password = await passwordService.hashPassword(newPassword);
    company.passwordResetToken = undefined;
    company.passwordResetExpires = undefined;
    await company.save();

    return company;
  },

  async checkCompanyAuthStatus(companyId) {
    const company = await User.findById(companyId);
    if (!company || company.role !== "company") {
      throw new Error("Unauthorized");
    }
  },
};
