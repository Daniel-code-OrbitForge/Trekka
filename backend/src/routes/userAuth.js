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
/**
 * @swagger
 * tags:
 *   name: User Authentication
 *   description: API endpoints for user authentication and management
 */

router.post("/signup", signup);
/**
 * @swagger
 * /api/user/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [User Authentication]
 *     requestBody:
 *      required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        required:
 *         - name
 *         - email
 *        - password
 *       properties:
 *        name:
 *        type: string
 *        example: Sam Loco
 *       email:
 *        type: string
 *        example: samloco@example.com
 *      password:
 *       type: string
 *       example: strongpassword123
 *    responses:
 *      201:
 *        description: User registered successfully
 *      400:
 *        description: Invalid input or user already exists.
 */
router.post("/signup", signup);

/**
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [User Authentication]
 *     requestBody:
 *      required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        required:
 *         - name
 *         - email
 *        - password
 *       properties:
 *        name:
 *        type: string
 *        example: Sam Loco
 *       email:
 *        type: string
 *        example: samloco@example.com
 *      password:
 *       type: string
 *       example: strongpassword123
 *    responses:
 *      200:
 *        description: Login successful, returns JWT token
 *      401:
 *        description: Invalid email or password.
 */
router.post("/login", login);

/**
 * @swagger
 * /api/user/verify-email/{token}:
 *   post:
 *     summary: Verify user email
 *     tags: [User Authentication]
 *     parameters:
 *      - in: path
 *       name: token
 *       schema:
 *        type: string
 *       required: true
 *       description: Email verification token sent to user's email
 *    responses:
 *      200:
 *        description: Email verified successfully
 *      400:
 *        description: Invalid token.
 */

router.get("/verify-email/:token", verifyEmail);

/**
 * @swagger
 * /api/user/resend-verification-email:
 *   post:
 *     summary: Resend email verification
 *     tags: [User Authentication]
 *     requestBody:
 *      required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         email:
 *          type: string
 *          example: samloco@example.com
 *    responses:
 *      200:
 *        description: Verification email resent successfully
 *      400:
 *        description: Invalid email or user already verified.
 */
router.post("/resend-verification-email", resendVerificationEmail);

/**
 * @swagger
 * /api/user/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [User Authentication]
 *     requestBody:
 *      required: true
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         email:
 *          type: string
 *          example: samloco@example.com
 *    responses:
 *      200:
 *        description: Password reset email sent successfully
 *      400:
 *        description: Invalid or unregistered email.
 */
router.post("/forgot-password", forgotPassword);

/**
 * @swagger
 * /api/user/reset-password/{token}:
 *   post:
 *     summary: Reset user password using valid token
 *     tags: [User Authentication]
 *    parameters:
 *    - in: path
 *      name: token
 *      required: true
 *      description: Password reset token
 *      schema:
 *        type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *         schema:
 *         type: object
 *        properties:
 *        newPassword:
 *          type: string
 *          example: newstrongpassword123
 *    responses:
 *      200:
 *        description: Password reset successfully
 *      400:
 *        description: Invalid or expired token.
 */
router.post("/reset-password/:token", resetPassword);

// Protected routes (require auth)
/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     summary: Log out the authenticated user
 *     tags: [User Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully.
 *       401:
 *         description: Unauthorized or missing token.
 */
router.post("/logout", authMiddleware("user"), logout);

/**
 * @swagger
 * /api/user/change-password:
 *   post:
 *     summary: Change user's password
 *     tags: [User Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 example: MyOldPassword123
 *               newPassword:
 *                 type: string
 *                 example: MyNewPassword456
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Invalid current password or weak new password.
 *       401:
 *         description: Unauthorized.
 */
router.post("/change-password", authMiddleware("user"), changePassword);

/**
 * @swagger
 * /api/user/update-profile:
 *   put:
 *     summary: Update user's profile details
 *     tags: [User Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: +233555444333
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Invalid data provided.
 *       401:
 *         description: Unauthorized.
 */
router.put("/update-profile", authMiddleware("user"), updateUserProfile);

/**
 * @swagger
 * /api/user/delete-account:
 *   delete:
 *     summary: Delete user's account permanently
 *     tags: [User Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Account deleted successfully.
 *       401:
 *         description: Unauthorized.
 */
router.delete("/delete-account", authMiddleware("user"), deleteUserAccount);

/**
 * @swagger
 * /api/user/auth-status:
 *   get:
 *     summary: Check if the user is currently authenticated
 *     tags: [User Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user details returned.
 *       401:
 *         description: Invalid or expired token.
 */
router.get("/auth-status", authMiddleware("user"), checkAuthStatus);

export default router;
