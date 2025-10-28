import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Admin from "../models/adminModel.js";
import Company from "../models/companyModel.js";

export const authMiddleware = (entity = "user") => {
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

      if (decoded.role !== entity && entity !== "any") {
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

      // dynamically assign the account to req.user, req.company, or req.admin
      req[entity] = account;
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
