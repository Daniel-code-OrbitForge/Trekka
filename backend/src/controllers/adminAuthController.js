import { adminAuthService } from "../services/adminAuthService.js";
import { tokenService } from "../services/tokenService.js";
import User from "../models/userModel.js";

export const adminSignup = async (req, res) => {
  try {
    const admin = await adminAuthService.signUpAdmin(req.body);
    admin.role = "admin";
    await admin.save();
    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { admin, token } = await adminAuthService.loginAdmin(req.body);
    if (admin.role !== "admin") throw new Error("Not authorized as admin");
    res.status(200).json({ message: "Login successful", admin, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const adminGetAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" });
  res.status(200).json({ users });
};

export const adminGetAllCompanies = async (req, res) => {
  const companies = await User.find({ role: "company" });
  res.status(200).json({ companies });
};

export const adminDeleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const adminDeleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    await User.findByIdAndDelete(companyId);
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const adminLogout = async (req, res) => {
  try {
    // For JWT, logout can be handled on the client side by deleting the token.
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const adminCreateCompany = async (req, res) => {
  try {
    const company = await adminAuthService.signUpCompany(req.body);
    company.role = "company";
    await company.save();
    res.status(201).json({ message: "Company created successfully", company });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const checkAdminAuthStatus = async (req, res) => {
  try {
    res.status(200).json({ message: "Admin is authenticated", user: req.user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
