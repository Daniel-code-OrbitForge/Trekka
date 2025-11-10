// scripts/utils/authUtils.js

export function redirectBasedOnRole(role) {
  console.log("Redirecting based on role:", role);

  switch (role) {
    case "user":
      window.location.href = "../users/dashboard.html";
      break;
    case "company":
      window.location.href = "../company/companyDashboard.html";
      break;
    case "admin":
      window.location.href = "../admin/adminDashboard.html";
      break;
    case "driver":
      window.location.href = "../drivers/driverDashboard.html";
      break;
    default:
      console.warn("Unknown role:", role);
      window.location.href = "../users/dashboard.html";
  }
}

// Check if user is authenticated
export function isAuthenticated() {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  return !!token;
}

// Get current user role
export function getUserRole() {
  return localStorage.getItem("userRole");
}

// Get user data
export function getUserData() {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
}

// Logout function
export function logout() {
  localStorage.removeItem("authToken");
  sessionStorage.removeItem("authToken");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userData");
  window.location.href = "../auth/login.html";
}

// Protect routes - call this on dashboard pages
export function protectRoute(allowedRoles = []) {
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  const userRole = getUserRole();

  if (!token) {
    window.location.href = "../auth/login.html";
    return false;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    alert("Access denied. You do not have permission to view this page.");
    window.location.href = "../auth/login.html";
    return false;
  }

  return true;
}
