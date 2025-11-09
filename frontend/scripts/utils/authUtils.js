/**
 * Handles redirection after successful authentication based on user role
 * @param {string} role - User role (user, company, admin)
 */
export function redirectBasedOnRole(role) {
  const baseUrl = window.location.origin;
  let redirectUrl = '';

  switch (role.toLowerCase()) {
    case 'admin':
      redirectUrl = '/pages/admin/adminDashboard.html';
      break;
    case 'company':
      redirectUrl = '/pages/company/companyDashboard.html';
      break;
    case 'user':
    default:
      redirectUrl = '/pages/user/dashboard.html';
  }

  // Store user data in session storage
  const userData = {
    isAuthenticated: true,
    role: role,
    lastLogin: new Date().toISOString()
  };
  sessionStorage.setItem('userData', JSON.stringify(userData));

  // Redirect to the appropriate dashboard
  window.location.href = baseUrl + redirectUrl;
}

/**
 * Checks if user is authenticated and redirects to login if not
 * @param {string} requiredRole - Required role to access the page
 */
export function requireAuth(requiredRole = 'user') {
  const userData = JSON.parse(sessionStorage.getItem('userData') || '{}');
  
  if (!userData.isAuthenticated) {
    window.location.href = '/pages/auth/login.html';
    return false;
  }

  if (requiredRole !== 'user' && userData.role !== requiredRole) {
    // If user doesn't have required role, redirect to their dashboard
    redirectBasedOnRole(userData.role);
    return false;
  }

  return true;
}
