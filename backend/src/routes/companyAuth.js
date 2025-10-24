import express from "express";
import {
  companySignup,
  companyLogin,
  companyLogout,
  verifyCompanyEmail,
  resendCompanyVerificationEmail,
  companyForgotPassword,
  companyResetPassword,
  companyChangePassword,
  updateCompanyProfile,
  deleteCompanyAccount,
  checkCompanyAuthStatus,
} from "../controllers/companyAuthController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/company-signup", companySignup);
router.post("/company-login", companyLogin);
router.get("/verify-company-email/:token", verifyCompanyEmail);
router.post(
  "/resend-company-verification-email",
  resendCompanyVerificationEmail
);
router.post("/company-forgot-password", companyForgotPassword);
router.post("/company-reset-password/:token", companyResetPassword);

// Protected routes (require valid company JWT)
router.post("/company-logout", authMiddleware("company"), companyLogout);
router.post(
  "/company-change-password",
  authMiddleware("company"),
  companyChangePassword
);
router.put(
  "/update-company-profile",
  authMiddleware("company"),
  updateCompanyProfile
);
router.delete(
  "/delete-company-account",
  authMiddleware("company"),
  deleteCompanyAccount
);
router.get(
  "/company-auth-status",
  authMiddleware("company"),
  checkCompanyAuthStatus
);

export default router;
