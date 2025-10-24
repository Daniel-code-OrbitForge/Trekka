import crypto from "crypto";
import User from "../models/userModel.js";
import { tokenService } from "./tokenService.js";
import { passwordService } from "./passwordService.js";
import { emailService } from "./emailService.js";
import { get } from "http";

export const adminAuthService = {
  async signUpAdmin({ username, email, password }) {
    const existingAdmin = await User.findOne({ email, role: "admin" });
    if (existingAdmin) throw new Error("Admin already exists");

    const hashedPassword = await passwordService.hashPassword(password);

    const admin = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    });
    return admin;
  },

  async loginAdmin({ email, password }) {
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) throw new Error("Invalid email or password");

    const validPassword = await passwordService.comparePassword(
      password,
      admin.password
    );
    if (!validPassword) throw new Error("Invalid email or password");

    const token = tokenService.generateToken({
      id: admin._id,
      role: admin.role,
    });
    return { admin, token };
  },

  async getAllUsers() {
    return await User.find({ role: "user" });
  },

  async getAllCompanies() {
    return await User.find({ role: "company" });
  },

  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new Error("User not found");
    return user;
  },

  async deleteCompany(companyId) {
    const company = await User.findByIdAndDelete(companyId);
    if (!company) throw new Error("Company not found");
    return company;
  },

  async logoutAdmin() {
    // For JWT, logout can be handled on the client side by deleting the token.
    return;
  },
};
