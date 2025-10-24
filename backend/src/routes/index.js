import express from "express";
import userAuthRoutes from "./routes/userAuth.js";
import companyAuthRoutes from "./routes/companyAuth.js";
import adminAuthRoutes from "./routes/adminAuth.js";

const router = express.Router();

router.use("/api/user", userAuthRoutes);
router.use("/api/company", companyAuthRoutes);
router.use("/api/admin", adminAuthRoutes);

export default router;
