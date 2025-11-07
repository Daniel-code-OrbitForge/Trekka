// src/middlewares/roleMiddleware.js
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        message: "Forbidden: Access is denied",
      });
    }

    next();
  };
};
