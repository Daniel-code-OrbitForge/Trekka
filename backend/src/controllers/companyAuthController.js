import { companyAuthService } from "../services/companyAuthService.js";
import { tokenService } from "../services/tokenService.js";
import User from "../models/userModel.js";

export const companySignup = async (req, res) => {
  try {
    const { companyName, companyEmail, password, industry } = req.body;
    const company = await companyAuthService.signUpCompany({
      companyName,
      companyEmail,
      password,
      industry,
    });
    company.role = "company";
    company.industry = industry;
    await company.save();
    res.status(201).json({
      message: "Company registered successfully",
      company: {
        id: company._id,
        companyName: company.companyName,
        companyEmail: company.companyEmail,
        role: "company",
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const companyLogin = async (req, res) => {
  try {
    const { company, token } = await companyAuthService.loginCompany(req.body);
    if (company.role !== "company")
      throw new Error("Not authorized as company");
    res.status(200).json({
      message: "Login successful",
      company: {
        id: company._id,
        companyName: company.companyName,
        companyEmail: company.companyEmail,
        role: "company",
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const companyLogout = async (req, res) => {
  try {
    // For JWT, logout can be handled on the client side by deleting the token.
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyCompanyEmail = async (req, res) => {
  try {
    const { token, email } = req.params;
    const company = await User.findOne({ email });
    if (!company) throw new Error("Company not found");
    // Verify the token (implementation depends on your token strategy)
    const isValid = await companyAuthService.verifyToken(token, company);
    if (!isValid) throw new Error("Invalid or expired token");
    res.status(200).json({ message: "Email verified successfully", company });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resendCompanyVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const company = await User.findOne({ email });
    if (!company) throw new Error("Company not found");
    if (company.emailVerified) throw new Error("Email already verified");
    await companyAuthService.sendVerificationEmail(company);
    res.status(200).json({ message: "Verification email resent", company });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const companyForgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const company = await User.findOne({ email });
    if (!company) throw new Error("Company not found");
    await companyAuthService.sendPasswordResetEmail(company);
    res.status(200).json({ message: "Password reset email sent", company });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const companyResetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const company = await companyAuthService.verifyPasswordResetToken(token);
    if (!company) throw new Error("Invalid or expired token");
    company.password = newPassword;
    await company.save();
    res.status(200).json({ message: "Password reset successfully", company });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const companyChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const company = await User.findById(req.user.id);
    if (!company || company.role !== "company")
      throw new Error("Not authorized as company");
    const isMatch = await companyAuthService.comparePassword(
      currentPassword,
      company.password
    );
    if (!isMatch) throw new Error("Current password is incorrect");
    company.password = newPassword;
    await company.save();
    res.status(200).json({ message: "Password changed successfully", company });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateCompanyProfile = async (req, res) => {
  try {
    const updates = req.body;
    const company = await User.findById(req.user.id);
    if (!company || company.role !== "company")
      throw new Error("Not authorized as company");
    Object.assign(company, updates);
    await company.save();
    res.status(200).json({ message: "Profile updated successfully", company });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteCompanyAccount = async (req, res) => {
  try {
    const company = await User.findById(req.user.id);
    if (!company || company.role !== "company")
      throw new Error("Not authorized as company");
    await company.remove();
    res.status(200).json({ message: "Company account deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const checkCompanyAuthStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "company")
      throw new Error("Not authorized as company");
    res.status(200).json({ message: "User is authenticated", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
