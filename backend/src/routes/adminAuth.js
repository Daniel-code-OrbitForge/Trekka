import express from "express";
import {
  adminSignup,
  adminLogin,
  adminLogout,
  adminCreateCompany,
  adminGetAllUsers,
  adminGetAllCompanies,
  adminDeleteUser,
  adminDeleteCompany,
  checkAdminAuthStatus,
} from "../controllers/adminAuthController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin Auth
 *   description: Authentication and management endpoints for system administrators
 */

/**
 * @swagger
 * /api/admin/admin-signup:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 *       400:
 *         description: Invalid input or admin already exists
 */
router.post("/admin-signup", adminSignup);

/**
 * @swagger
 * /api/admin/admin-login:
 *   post:
 *     summary: Login an existing admin
 *     tags: [Admin Auth]
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
router.post("/admin-login", adminLogin);

/**
 * @swagger
 * /api/admin/admin-logout:
 *   post:
 *     summary: Logout the current admin
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/admin-logout", protect("admin"), adminLogout);

/**
 * @swagger
 * /api/admin/admin-create-company:
 *   post:
 *     summary: Create a new company account
 *     tags: [Admin Auth]
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Company created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/admin-create-company", protect("admin"), adminCreateCompany);

/**
 * @swagger
 * /api/admin/admin-all-users:
 *   get:
 *     summary: Get all users in the system
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/admin-all-users", protect("admin"), adminGetAllUsers);

/**
 * @swagger
 * /api/admin/admin-all-companies:
 *   get:
 *     summary: Get all registered companies
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of companies retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/admin-all-companies", protect("admin"), adminGetAllCompanies);

/**
 * @swagger
 * /api/admin/admin-delete-user/{userId}:
 *   delete:
 *     summary: Delete a specific user by ID
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/admin-delete-user/:userId", protect("admin"), adminDeleteUser);

/**
 * @swagger
 * /api/admin/admin-delete-company/{companyId}:
 *   delete:
 *     summary: Delete a specific company by ID
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: companyId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the company to delete
 *     responses:
 *       200:
 *         description: Company deleted successfully
 *       404:
 *         description: Company not found
 *       401:
 *         description: Unauthorized
 */
router.delete(
  "/admin-delete-company/:companyId",
  protect("admin"),
  adminDeleteCompany
);

/**
 * @swagger
 * /api/admin/admin-auth-status:
 *   get:
 *     summary: Check if admin is authenticated
 *     tags: [Admin Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin is authenticated
 *       401:
 *         description: Unauthorized
 */
router.get("/admin-auth-status", protect("admin"), checkAdminAuthStatus);

export default router;
