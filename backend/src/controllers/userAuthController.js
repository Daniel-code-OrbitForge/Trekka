import { authService } from "../services/userAuthService.js";
import { tokenService } from "../services/tokenService.js";
import User from "../models/userModel.js";

export const signup = async (req, res) => {
  try {
    const user = await authService.signUpUser(req.body);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { user, token } = await authService.loginUser(req.body);
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: "user",
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    // For JWT, logout can be handled on the client side by deleting the token.
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.params;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    if (user.emailVerificationToken !== token) throw new Error("Invalid token");
    if (user.emailVerificationExpires < Date.now())
      throw new Error("Token expired");

    user.emailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    if (user.emailVerified) throw new Error("Email already verified");

    // Generate a new email verification token and expiration
    user.emailVerificationToken = authService.generateToken();
    user.emailVerificationExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Send the verification email
    await authService.sendVerificationEmail(
      user.email,
      user.emailVerificationToken
    );

    res.status(200).json({ message: "Verification email resent successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");
    // Generate a password reset token and expiration
    user.passwordResetToken = authService.generateToken();
    user.passwordResetExpires = Date.now() + 3600000;
    await user.save();

    // Send the password reset email
    await authService.sendPasswordResetEmail(
      user.email,
      user.passwordResetToken
    );
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new Error("Invalid or expired token");

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("User not found");
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) throw new Error("Current password is incorrect");
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    if (!user) throw new Error("User not found");
    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    if (!user) throw new Error("User not found");
    res.status(200).json({ message: "User account deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const checkAuthStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) throw new Error("User not found");
    res.status(200).json({ message: "User is authenticated", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
