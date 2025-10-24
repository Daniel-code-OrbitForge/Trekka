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

import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/admin-signup", adminSignup);
router.post("/admin-login", adminLogin);

// Protected admin routes
router.post("/admin-logout", authMiddleware("admin"), adminLogout);
router.post(
  "/admin-create-company",
  authMiddleware("admin"),
  adminCreateCompany
);
router.get("/admin-all-users", authMiddleware("admin"), adminGetAllUsers);
router.get(
  "/admin-all-companies",
  authMiddleware("admin"),
  adminGetAllCompanies
);
router.delete(
  "/admin-delete-user/:userId",
  authMiddleware("admin"),
  adminDeleteUser
);
router.delete(
  "/admin-delete-company/:companyId",
  authMiddleware("admin"),
  adminDeleteCompany
);
router.get("/admin-auth-status", authMiddleware("admin"), checkAdminAuthStatus);

export default router;
