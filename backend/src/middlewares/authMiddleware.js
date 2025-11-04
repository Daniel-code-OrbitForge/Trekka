// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import Company from "../models/companyModel.js";

export const protect = (entity = "any") => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Entity filtering (optional)
      if (entity !== "any" && decoded.role !== entity) {
        return res.status(403).json({ message: "Forbidden: Invalid role" });
      }

      let Model;
      switch (decoded.role) {
        case "user":
          Model = User;
          break;
        case "company":
          Model = Company;
          break;
        case "admin":
          Model = Admin;
          break;
        default:
          return res.status(400).json({ message: "Invalid entity type" });
      }

      const account = await Model.findById(decoded.id).select("-password");
      if (!account) {
        return res
          .status(401)
          .json({ message: "Unauthorized: Account not found" });
      }

      req.user = account; // unified property
      req.role = decoded.role;

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized: Token error",
        error: error.message,
      });
    }
  };
};
