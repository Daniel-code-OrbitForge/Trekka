import {
  createDriverService,
  getDriversService,
  getDriverByIdService,
  updateDriverService,
  deleteDriverService,
  assignVehicleService,
} from "../services/driverService.js";

// Create new driver
export const createDriver = async (req, res) => {
  try {
    const driver = await createDriverService(req.body);
    res.status(201).json({ success: true, data: driver });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get all drivers
export const getDrivers = async (req, res) => {
  try {
    const drivers = await getDriversService(req.query);
    res.status(200).json({ success: true, count: drivers.length, data: drivers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get driver by ID
export const getDriverById = async (req, res) => {
  try {
    const driver = await getDriverByIdService(req.params.id);
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });
    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update driver
export const updateDriver = async (req, res) => {
  try {
    const driver = await updateDriverService(req.params.id, req.body);
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });
    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete driver
export const deleteDriver = async (req, res) => {
  try {
    const driver = await deleteDriverService(req.params.id);
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });
    res.status(200).json({ success: true, message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Assign vehicle
export const assignVehicle = async (req, res) => {
  try {
    const driver = await assignVehicleService(req.params.id, req.body.vehicleId);
    if (!driver) return res.status(404).json({ success: false, message: "Driver not found" });
    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};