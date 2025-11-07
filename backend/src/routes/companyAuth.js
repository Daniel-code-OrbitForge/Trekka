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

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Company Auth
 *   description: Authentication and account management endpoints for transport companies
 */

/**
 * @swagger
 * /api/company/company-signup:
 *   post:
 *     summary: Register a new company
 *     tags: [Company Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Company registered successfully
 *       400:
 *         description: Invalid input or company already exists
 */
router.post("/company-signup", companySignup);

/**
 * @swagger
 * /api/company/company-login:
 *   post:
 *     summary: Login a company account
 *     tags: [Company Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post("/company-login", companyLogin);

/**
 * @swagger
 * /api/company/verify-company-email/{token}:
 *   get:
 *     summary: Verify company email using token
 *     tags: [Company Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Verification token sent to the company's email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.get("/verify-company-email/:token", verifyCompanyEmail);

/**
 * @swagger
 * /api/company/resend-company-verification-email:
 *   post:
 *     summary: Resend company email verification link
 *     tags: [Company Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email resent successfully
 *       400:
 *         description: Invalid email or company already verified
 */
router.post(
  "/resend-company-verification-email",
  resendCompanyVerificationEmail
);

/**
 * @swagger
 * /api/company/company-forgot-password:
 *   post:
 *     summary: Request password reset link
 *     tags: [Company Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset link sent to email
 *       404:
 *         description: Company not found
 */
router.post("/company-forgot-password", companyForgotPassword);

/**
 * @swagger
 * /api/company/company-reset-password/{token}:
 *   post:
 *     summary: Reset password using reset token
 *     tags: [Company Auth]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token sent to the company's email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post("/company-reset-password/:token", companyResetPassword);

/**
 * @swagger
 * /api/company/company-logout:
 *   post:
 *     summary: Logout a company account
 *     tags: [Company Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
router.post("/company-logout", protect("company"), companyLogout);

/**
 * @swagger
 * /api/company/company-change-password:
 *   post:
 *     summary: Change the company password (requires authentication)
 *     tags: [Company Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/company-change-password",
  protect("company"),
  companyChangePassword
);

/**
 * @swagger
 * /api/company/update-company-profile:
 *   put:
 *     summary: Update company profile information
 *     tags: [Company Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               address:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company profile updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.put("/update-company-profile", protect("company"), updateCompanyProfile);

/**
 * @swagger
 * /api/company/delete-company-account:
 *   delete:
 *     summary: Delete the company account permanently
 *     tags: [Company Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company account deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/delete-company-account",
  protect("company"),
  deleteCompanyAccount
);

/**
 * @swagger
 * /api/company/company-auth-status:
 *   get:
 *     summary: Check if the company is authenticated (JWT verification)
 *     tags: [Company Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company is authenticated
 *       401:
 *         description: Unauthorized or token expired
 */
router.get("/company-auth-status", protect("company"), checkCompanyAuthStatus);

export default router;
