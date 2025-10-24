import express from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUserProfile,
  deleteUserAccount,
  checkAuthStatus,
} from "../controllers/userAuthController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification-email", resendVerificationEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Protected routes (require auth)
router.post("/logout", authMiddleware("user"), logout);
router.post("/change-password", authMiddleware("user"), changePassword);
router.put("/update-profile", authMiddleware("user"), updateUserProfile);
router.delete("/delete-account", authMiddleware("user"), deleteUserAccount);
router.get("/auth-status", authMiddleware("user"), checkAuthStatus);

export default router;
