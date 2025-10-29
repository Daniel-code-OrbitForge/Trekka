/**
 * LOGIN.JS - Trekka Login Page Logic
 * 
 * CUSTOMIZATION POINTS:
 * - Line 150: Change API endpoint URL for login
 * - Line 160-164: Modify redirect URLs for each role
 * - Line 22: Adjust rate limiting attempts/cooldown
 * 
 * BACKEND INTEGRATION:
 * When ready to connect to backend, replace the simulated postJSON function
 * with actual fetch calls to your API endpoints:
 * - POST /api/auth/login - Login endpoint
 * - POST /api/auth/google - Google OAuth callback
 * - POST /api/auth/apple - Apple OAuth callback
 */

// ===========================
// UTILITY FUNCTIONS
// ===========================

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid email format
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Show toast notification
 * @param {string} message - Message to display
 * @param {string} type - Type of toast (success, error, info, warning)
 */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  
  const iconMap = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  toast.innerHTML = `
    <span class="toast-icon">${iconMap[type] || iconMap.info}</span>
    <div class="toast-content">
      <p class="toast-message">${message}</p>
    </div>
    <button class="toast-close" aria-label="Close notification">×</button>
  `;
  
  container.appendChild(toast);
  
  // Close button handler
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    toast.remove();
  }, 5000);
}

/**
 * Simulate API request (replace with actual fetch in production)
 * @param {string} url - API endpoint
 * @param {object} data - Request payload
 * @returns {Promise} - Simulated response
 */
async function postJSON(url, data) {
  // EDIT THIS: Replace with actual API call
  console.log('📡 Simulated POST request to:', url);
  console.log('📦 Request payload:', data);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simulate successful response with JWT token
  return {
    success: true,
    token: 'simulated_jwt_token_' + Date.now(),
    user: {
      id: 'user_' + Date.now(),
      email: data.email,
      role: data.loginType,
      name: data.email.split('@')[0]
    }
  };
}

// ===========================
// RATE LIMITING
// ===========================

const rateLimit = {
  attempts: 0,
  maxAttempts: 3,
  cooldownTime: 5000, // 5 seconds
  lockedUntil: null,
  
  isLocked() {
    if (this.lockedUntil && Date.now() < this.lockedUntil) {
      return true;
    }
    if (this.lockedUntil && Date.now() >= this.lockedUntil) {
      this.reset();
    }
    return false;
  },
  
  incrementAttempts() {
    this.attempts++;
    if (this.attempts >= this.maxAttempts) {
      this.lockedUntil = Date.now() + this.cooldownTime;
      return true; // Locked
    }
    return false;
  },
  
  reset() {
    this.attempts = 0;
    this.lockedUntil = null;
  },
  
  getRemainingTime() {
    if (!this.lockedUntil) return 0;
    return Math.max(0, Math.ceil((this.lockedUntil - Date.now()) / 1000));
  }
};

// ===========================
// FORM VALIDATION
// ===========================

/**
 * Show error message for a form field
 * @param {string} fieldId - ID of the input field
 * @param {string} message - Error message to display
 */
function showError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + 'Error');
  
  input.classList.add('error');
  input.setAttribute('aria-invalid', 'true');
  errorElement.textContent = message;
  errorElement.classList.add('visible');
}

/**
 * Clear error message for a form field
 * @param {string} fieldId - ID of the input field
 */
function clearError(fieldId) {
  const input = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + 'Error');
  
  input.classList.remove('error');
  input.setAttribute('aria-invalid', 'false');
  errorElement.textContent = '';
  errorElement.classList.remove('visible');
}

/**
 * Validate the login form
 * @param {FormData} formData - Form data object
 * @returns {boolean} - True if form is valid
 */
function validateForm(formData) {
  let isValid = true;
  
  // Clear all previous errors
  ['loginType', 'email', 'password'].forEach(clearError);
  
  // Validate login type
  const loginType = formData.get('loginType');
  if (!loginType) {
    showError('loginType', 'Please select an account type');
    isValid = false;
  }
  
  // Validate email
  const email = formData.get('email');
  if (!email) {
    showError('email', 'Email is required');
    isValid = false;
  } else if (!validateEmail(email)) {
    showError('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  // Validate password
  const password = formData.get('password');
  if (!password) {
    showError('password', 'Password is required');
    isValid = false;
  }
  
  return isValid;
}

// ===========================
// FORM SUBMISSION HANDLER
// ===========================

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Check rate limiting
  if (rateLimit.isLocked()) {
    const remaining = rateLimit.getRemainingTime();
    showToast(`Too many failed attempts. Please wait ${remaining} seconds.`, 'error');
    return;
  }
  
  const formData = new FormData(e.target);
  
  // Validate form
  if (!validateForm(formData)) {
    return;
  }
  
  // Get form values
  const loginData = {
    loginType: formData.get('loginType'),
    email: formData.get('email'),
    password: formData.get('password'),
    rememberMe: formData.get('rememberMe') === 'on'
  };
  
  // Show loading state
  const loginBtn = document.getElementById('loginBtn');
  loginBtn.classList.add('btn-loading');
  loginBtn.disabled = true;
  
  try {
    // EDIT THIS: Replace with actual API endpoint
    const response = await postJSON('/api/auth/login', loginData);
    
    if (response.success) {
      // Reset rate limit on success
      rateLimit.reset();
      
      // Show success message
      showToast('Login successful! Redirecting...', 'success');
      
      // Simulate storing JWT token (in production, use httpOnly cookies or secure storage)
      console.log('🔑 JWT Token:', response.token);
      console.log('👤 User Data:', response.user);
      
      // EDIT THIS: Modify redirect URLs for each role
      // Simulate role-based redirect after 1.5 seconds
      setTimeout(() => {
        const redirectMap = {
          user: '../../pages/user/dashboard.html',
          driver: '../../pages/driver/dashboard.html',
          company: '../../pages/company/dashboard.html',
          admin: '../../pages/admin/dashboard.html'
        };
        
        const redirectUrl = redirectMap[loginData.loginType] || '/';
        console.log(`🔀 Redirecting to: ${redirectUrl}`);
        
        // In production, uncomment this:
        // window.location.href = redirectUrl;
        
        showToast(`Redirect: ${redirectUrl}`, 'info');
      }, 1500);
      
    } else {
      // Handle failed login
      const isLocked = rateLimit.incrementAttempts();
      
      if (isLocked) {
        const cooldown = rateLimit.getRemainingTime();
        showToast(`Too many failed attempts. Please wait ${cooldown} seconds.`, 'error');
      } else {
        showToast('Invalid email or password', 'error');
      }
    }
    
  } catch (error) {
    console.error('Login error:', error);
    showToast('An error occurred. Please try again.', 'error');
  } finally {
    // Remove loading state
    loginBtn.classList.remove('btn-loading');
    loginBtn.disabled = false;
  }
});

// ===========================
// SOCIAL LOGIN HANDLERS
// ===========================

/**
 * Handle Google login
 * EDIT THIS: Implement actual Google OAuth flow
 */
document.getElementById('googleLoginBtn').addEventListener('click', () => {
  console.log('🔵 Google login initiated');
  console.log('Provider attribute:', document.getElementById('googleLoginBtn').dataset.provider);
  
  // In production, redirect to Google OAuth:
  // window.location.href = '/api/auth/google';
  
  showToast('Google login would be initiated here', 'info');
});

/**
 * Handle Apple login
 * EDIT THIS: Implement actual Apple OAuth flow
 */
document.getElementById('appleLoginBtn').addEventListener('click', () => {
  console.log('🍎 Apple login initiated');
  console.log('Provider attribute:', document.getElementById('appleLoginBtn').dataset.provider);
  
  // In production, redirect to Apple OAuth:
  // window.location.href = '/api/auth/apple';
  
  showToast('Apple login would be initiated here', 'info');
});

// ===========================
// REAL-TIME INPUT VALIDATION
// ===========================

// Clear errors on input
['loginType', 'email', 'password'].forEach(fieldId => {
  const element = document.getElementById(fieldId);
  if (element) {
    element.addEventListener('input', () => clearError(fieldId));
    element.addEventListener('change', () => clearError(fieldId));
  }
});

// ===========================
// ACCESSIBILITY: ANNOUNCE PAGE LOAD
// ===========================

window.addEventListener('load', () => {
  console.log('✅ Login page loaded');
  console.log('📌 Ready for backend integration');
  console.log('');
  console.log('INTEGRATION CHECKLIST:');
  console.log('1. Replace postJSON() function with actual fetch API calls');
  console.log('2. Implement POST /api/auth/login endpoint');
  console.log('3. Implement POST /api/auth/google endpoint for Google OAuth');
  console.log('4. Implement POST /api/auth/apple endpoint for Apple OAuth');
  console.log('5. Handle JWT token storage securely');
  console.log('6. Enable actual redirects (uncomment window.location.href)');
});
