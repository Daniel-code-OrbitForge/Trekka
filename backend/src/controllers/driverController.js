import driverModel from "../models/driverModel";
import { errorMiddleware } from "../middlewares/errorMiddleware";

export const createDriver = async (req, res) => {
  try {
    const {
      companyId,
      firstName,
      lastName,
      email,
      phoneNumber,
      licenseNumber,
    } = req.body;
    if (
      !companyId ||
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !licenseNumber
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required field",
      });
    }
    const driver = new driver({
      companyId,
      firstName,
      lastName,
      email,
      phoneNumber,
      licenseNumber,
    });
    await driver.save();
    return res.status(201).json({
      success: true,
      data: driver,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
