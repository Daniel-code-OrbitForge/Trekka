import Vehicle from "../models/vehicleModel.js";
import Driver from "../models/driverModel.js";

/// VEHICLE ENDPOINTS

//@desc Add a new vehicle to the fleet
//@route POST /api/fleet/vehicles
//@access Company Admin
export const addVehicle = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;

    const {
      registrationNumber,
      make,
      model,
      year,
      capacity,
      vehicleType,
      features,
      insuranceDetails,
    } = req.body;

    const existingVehicle = await Vehicle.findOne({
      registrationNumber,
      companyId,
    });
    if (existingVehicle) {
      return res.status(400).json({
        message: "Vehicle with this registration number already exists.",
      });
    }

    // Create and save the new vehicle
    const vehicle = new Vehicle({
      companyId,
      registrationNumber,
      make,
      model,
      year,
      capacity,
      vehicleType,
      features,
      insuranceDetails,
    });

    // Initialize seats based on capacity
    vehicle.generateSeats();
    await vehicle.save();
    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: vehicle,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add vehicle",
      error: error.message,
    });
  }
};

//@desc Get all vehicles in the fleet
//@route GET /api/fleet/vehicles
//@access Company Admin
export const getAllVehicles = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;
    const { status, vehicleType } = req.query;

    // Build query filter object
    const filter = { companyId };
    if (status) filter.status = status;
    if (vehicleType) filter.vehicleType = vehicleType;

    const vehicles = await Vehicle.find(filter)
      .populate("assignedDriver", "firstName lastName licenseNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      count: vehicles.length,
      data: vehicles,
    });
  } catch (error) {
    console.error("Get vehicles error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
      error: error.message,
    });
  }
};

//@desc Get single vehicle by ID
//@route GET /api/fleet/vehicles/:id
//@access Company Admin
export const getVehicleById = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      companyId,
    }).populate(
      "assignedDriver",
      "firstName lastName licenseNumber phoneNumber"
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error("Get vehicle error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
      error: error.message,
    });
  }
};

//@desc Update vehicle details
//@route PUT /api/fleet/vehicles/:id
//@access Company Admin
export const updateVehicle = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      companyId,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Update allowed vehicle fields
    const allowedUpdates = [
      "make",
      "model",
      "year",
      "capacity",
      "vehicleType",
      "status",
      "features",
      "insuranceDetails",
      "assignedDriver",
    ];
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        vehicle[field] = req.body[field];
      }
    });

    await vehicle.save();

    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error("Update vehicle error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
      error: error.message,
    });
  }
};

//@desc Delete a vehicle
//@route DELETE /api/fleet/vehicles/:id
//@access Company Admin
export const deleteVehicle = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;
    const { vehicleId } = req.params;

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      companyId,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Check if vehicle is assigned to a driver
    const assignedDriver = await Driver.findOne({ assignedVehicle: vehicleId });
    if (assignedDriver) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete vehicle assigned to a driver",
      });
    }

    await vehicle.deleteOne();

    res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("Delete vehicle error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
      error: error.message,
    });
  }
};

//@desc Log maintenance activity for a vehicle
//@route POST /api/fleet/vehicles/:id/maintenance
//@access Company Admin
export const logMaintenance = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;
    const { vehicleId } = req.params;
    const { description, startDate, expectedCompletion, cost, performedBy } =
      req.body;

    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      companyId,
    });

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Add maintenance record
    vehicle.maintenanceHistory.push({
      description,
      startDate,
      expectedCompletion,
      cost,
      performedBy,
    });

    // Update vehicle status
    vehicle.status = "maintenance";
    vehicle.lastMaintenanceDate = startDate;

    await vehicle.save();

    res.status(201).json({
      success: true,
      message: "Maintenance logged successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error("Log maintenance error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to log maintenance",
      error: error.message,
    });
  }
};

/// DRIVER ENDPOINTS

//@desc Add a new driver
//@route POST /api/fleet/drivers
//@access Company Admin
export const addDriver = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      licenseNumber,
      licenseExpiryDate,
      address,
      emergencyContact,
    } = req.body;

    // Check for existing driver with same email or phone number
    const existingDriver = await Driver.findOne({ licenseNumber });
    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: "Driver with this license number already exists.",
      });
    }

    // Create new driver
    const driver = new Driver({
      companyId,
      firstName,
      lastName,
      email,
      phoneNumber,
      licenseNumber,
      licenseExpiryDate,
      address,
      emergencyContact,
      experience,
    });

    await driver.save();

    res.status(201).json({
      success: true,
      message: "Driver added successfully.",
      data: driver,
    });
  } catch (error) {
    console.error("Add driver error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add driver",
      error: error.message,
    });
  }
};

//@desc Get all drivers
//@route GET /api/fleet/drivers
//@access Company Admin
export const getDrivers = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;
    const { status } = req.query;

    const filter = { companyId };
    if (status) filter.status = status;

    const drivers = await Driver.find(filter)
      .populate("assignedVehicle", "registrationNumber make model")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Drivers retrieved successfully.",
      count: drivers.length,
      data: drivers,
    });
  } catch (error) {
    console.error("Get drivers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve drivers",
      error: error.message,
    });
  }
};

//@desc Get single driver by ID
//@route GET /api/fleet/drivers/:id
//@access Company Admin
export const getDriverById = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;
    const { driverId } = req.params;

    const driver = await Driver.findOne({
      _id: driverId,
      companyId,
    }).populate(
      "assignedVehicle",
      "registrationNumber make model capacity status"
    );

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Driver retrieved successfully.",
      data: driver,
    });
  } catch (error) {
    console.error("Get driver by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch driver",
      error: error.message,
    });
  }
};

//@desc Update driver details
//@route PUT /api/fleet/drivers/:id
//@access Company Admin
export const updateDriver = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;
    const { driverId } = req.params;

    const driver = await Driver.findOne({
      _id: driverId,
      companyId,
    });
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Update allowed driver fields
    const allowedUpdates = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "licenseNumber",
      "licenseExpiryDate",
      "address",
      "emergencyContact",
      "status",
      "assignedVehicle",
      "experience",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        driver[field] = req.body[field];
      }
    });

    await driver.save();

    res.status(200).json({
      success: true,
      message: "Driver updated successfully.",
      data: driver,
    });
  } catch (error) {
    console.error("Update driver error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update driver",
      error: error.message,
    });
  }
};

//@desc Delete a driver
//@route DELETE /api/fleet/drivers/:id
//@access Company Admin
export const deleteDriver = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;
    const { driverId } = req.params;

    const driver = await Driver.findOne({
      _id: driverId,
      companyId,
    });
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    await driver.deleteOne();

    res.status(200).json({
      success: true,
      message: "Driver deleted successfully.",
    });
  } catch (error) {
    console.error("Delete driver error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete driver",
      error: error.message,
    });
  }
};

/// ASSIGNMENT ENDPOINTS

//@desc Assign a driver to a vehicle
//@route POST /api/fleet/assign
//@access Company Admin
export const assignDriverToVehicle = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;
    const { driverId, vehicleId } = req.body;

    // Validate driver belonging to company
    const driver = await Driver.findOne({ _id: driverId, companyId });
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    // Validate vehicle belonging to company
    const vehicle = await Vehicle.findOne({ _id: vehicleId, companyId });
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    // Check if driver is already assigned
    if (
      driver.assignedVehicle &&
      driver.assignedVehicle.toString() !== vehicleId
    ) {
      return res.status(400).json({
        success: false,
        message: "Driver is already assigned to another vehicle",
      });
    }

    // Check driver status
    if (driver.status !== "active") {
      return res.status(400).json({
        success: false,
        message: `Cannot assign driver with status. Driver status: ${driver.status}`,
      });
    }

    // Check vehicle status
    if (vehicle.status !== "active") {
      return res.status(400).json({
        success: false,
        message: `Cannot assign vehicle with status. Vehicle status: ${vehicle.status}`,
      });
    }

    // Assign driver to vehicle
    driver.assignedVehicle = vehicleId;
    await driver.save();

    // Populate assigned driver in vehicle
    await driver.populate("assignedVehicle", "registrationNumber make model");

    res.status(200).json({
      success: true,
      message: "Driver assigned to vehicle successfully.",
      data: driver,
    });
  } catch (error) {
    console.error("Assign driver error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to assign driver to vehicle",
      error: error.message,
    });
  }
};

//@desc Unassign a driver from a vehicle
//@route POST /api/fleet/unassign
//@access Company Admin
export const unassignDriver = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;
    const { driverId } = req.params;

    const driver = await Driver.findOne({ _id: driverId, companyId });
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found",
      });
    }

    if (!driver.assignedVehicle) {
      return res.status(400).json({
        success: false,
        message: "Driver is not assigned to any vehicle",
      });
    }

    driver.assignedVehicle = null;
    await driver.save();

    res.status(200).json({
      success: true,
      message: "Driver unassigned successfully",
      data: driver,
    });
  } catch (error) {
    console.error("Unassign driver error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to unassign driver",
      error: error.message,
    });
  }
};

/// DASHBOARD ENDPOINTS

//@desc Get fleet statistics
//@route GET /api/fleet/stats
//@access Company Admin
export const getFleetStats = async (req, res) => {
  try {
    const companyId = req.user.companyId || req.user._id;

    const [
      totalVehicles,
      activeVehicles,
      maintenanceVehicles,
      totalDrivers,
      activeDrivers,
      assignedDrivers,
    ] = await Promise.all([
      Vehicle.countDocuments({ companyId }),
      Vehicle.countDocuments({ companyId, status: "active" }),
      Vehicle.countDocuments({ companyId, status: "maintenance" }),
      Driver.countDocuments({ companyId }),
      Driver.countDocuments({ companyId, status: "active" }),
      Driver.countDocuments({ companyId, assignedVehicle: { $ne: null } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        vehicles: {
          total: totalVehicles,
          active: activeVehicles,
          maintenance: maintenanceVehicles,
          inactive: totalVehicles - activeVehicles - maintenanceVehicles,
        },
        drivers: {
          total: totalDrivers,
          active: activeDrivers,
          assigned: assignedDrivers,
          unassigned: totalDrivers - assignedDrivers,
        },
      },
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: error.message,
    });
  }
};
