// src/routes/fleetRoutes.js
import express from "express";
import {
  addVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  logMaintenance,
  addDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  assignDriverToVehicle,
  unassignDriver,
  getFleetStats,
} from "../controllers/fleetController.js";

import { protect } from "../middlewares/authMiddleware.js";
import { authorize } from "../middlewares/roleMiddleware.js";

const router = express.Router();

/// VEHICLE ROUTES
router.post("/vehicles", protect(), authorize("company"), addVehicle);
router.get("/vehicles", protect(), authorize("company"), getAllVehicles);
router.get(
  "/vehicles/:vehicleId",
  protect(),
  authorize("company"),
  getVehicleById
);
router.put(
  "/vehicles/:vehicleId",
  protect(),
  authorize("company"),
  updateVehicle
);
router.delete(
  "/vehicles/:vehicleId",
  protect(),
  authorize("company", "admin"),
  deleteVehicle
);
router.post(
  "/vehicles/:vehicleId/maintenance",
  protect(),
  authorize("company"),
  logMaintenance
);

/// DRIVER ROUTES
router.post("/drivers", protect(), authorize("company"), addDriver);
router.get("/drivers", protect(), authorize("company"), getDrivers);
router.get(
  "/drivers/:driverId",
  protect(),
  authorize("company"),
  getDriverById
);
router.put("/drivers/:driverId", protect(), authorize("company"), updateDriver);
router.delete(
  "/drivers/:driverId",
  protect(),
  authorize("company", "admin"),
  deleteDriver
);

/// ASSIGNMENT ROUTES
router.patch("/assign", protect(), authorize("company"), assignDriverToVehicle);
router.patch(
  "/unassign/:driverId",
  protect(),
  authorize("company"),
  unassignDriver
);

/// DASHBOARD ROUTES
router.get("/stats", protect(), authorize("company"), getFleetStats);

export default router;
