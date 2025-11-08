import Driver from "../models/driverModel.js";

/**
 * Create a new driver
 */
export const createDriverService = async (driverData) => {
  const driver = new Driver(driverData);
  return await driver.save();
};

/**
 * Get all drivers (with optional filters)
 */
export const getDriversService = async (filters = {}) => {
  const query = {};

  if (filters.companyId) query.companyId = filters.companyId;
  if (filters.status) query.status = filters.status;

  return await Driver.find(query)
    .populate("companyId", "name")
    .populate("assignedVehicle", "plateNumber model");
};

/**
 * Get a single driver by ID
 */
export const getDriverByIdService = async (id) => {
  return await Driver.findById(id)
    .populate("companyId", "name")
    .populate("assignedVehicle", "plateNumber model");
};

/**
 * Update driver by ID
 */
export const updateDriverService = async (id, updateData) => {
  return await Driver.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
};

/**
 * Delete driver by ID
 */
export const deleteDriverService = async (id) => {
  return await Driver.findByIdAndDelete(id);
};

/**
 * Assign or unassign vehicle to a driver
 */
export const assignVehicleService = async (id, vehicleId) => {
  const driver = await Driver.findById(id);
  if (!driver) return null;

  driver.assignedVehicle = vehicleId || null;
  await driver.save();

  return driver;
};