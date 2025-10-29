/**
 * USER-SIGNUP.JS - Trekka User Signup Page Logic
 * 
 * CUSTOMIZATION POINTS:
 * - Line 190: Change API endpoint URL for user registration
 * - Line 215: Modify redirect URL after successful signup
 * - Line 80: Adjust password strength requirements
 * 
 * BACKEND INTEGRATION:
 * When ready to connect to backend, replace the simulated postJSON function
 * with actual fetch calls to your API endpoints:
 * - POST /api/auth/signup - User registration endpoint
 * - POST /api/auth/send-verification - Send verification email
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
 * Validate phone number format (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid phone format
 */
function validatePhone(phone) {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  // Should have at least 10 digits
  return digitsOnly.length >= 10;
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - {valid: boolean, reasons: string[], strength: number}
 */
function validatePassword(password) {
  const reasons = [];
  let strength = 0;
  
  // EDIT THIS: Customize password requirements
  if (password.length < 8) {
    reasons.push('At least 8 characters required');
  } else {
    strength += 25;
  }
  
  if (!/[A-Z]/.test(password)) {
    reasons.push('Include at least one uppercase letter');
  } else {
    strength += 25;
  }
  
  if (!/[a-z]/.test(password)) {
    reasons.push('Include at least one lowercase letter');
  } else {
    strength += 25;
  }
  
  if (!/[0-9]/.test(password)) {
    reasons.push('Include at least one number');
  } else {
    strength += 25;
  }
  
  // Bonus points for special characters
  if (/[^A-Za-z0-9]/.test(password)) {
    strength = Math.min(100, strength + 10);
  }
  
  return {
    valid: reasons.length === 0,
    reasons,
    strength: Math.min(100, strength)
  };
}

/**
 * Update password strength indicator
 * @param {number} strength - Strength percentage (0-100)
 */
function updatePasswordStrength(strength) {
  const bar = document.getElementById('passwordStrengthBar');
  const fill = document.getElementById('passwordStrengthFill');
  const text = document.getElementById('passwordStrengthText');
  
  if (strength === 0) {
    bar.style.display = 'none';
    text.style.display = 'none';
    return;
  }
  
  bar.style.display = 'block';
  text.style.display = 'block';
  
  fill.style.width = strength + '%';
  
  // Set color and text based on strength
  if (strength < 40) {
    fill.style.background = 'var(--error)';
    text.textContent = 'Weak password';
    text.style.color = 'var(--error)';
  } else if (strength < 70) {
    fill.style.background = 'var(--warning)';
    text.textContent = 'Fair password';
    text.style.color = 'var(--warning)';
  } else if (strength < 90) {
    fill.style.background = 'var(--info)';
    text.textContent = 'Good password';
    text.style.color = 'var(--info)';
  } else {
    fill.style.background = 'var(--success)';
    text.textContent = 'Strong password';
    text.style.color = 'var(--success)';
  }
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
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate successful response
  return {
    success: true,
    userId: 'user_' + Date.now(),
    message: 'Account created successfully'
  };
}

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
  
  if (input && errorElement) {
    input.classList.add('error');
    input.setAttribute('aria-invalid', 'true');
    errorElement.textContent = message;
    errorElement.classList.add('visible');
  }
}

/**
 * Clear error message for a form field
 * @param {string} fieldId - ID of the input field
 */
function clearError(fieldId) {
  const input = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + 'Error');
  
  if (input && errorElement) {
    input.classList.remove('error');
    input.setAttribute('aria-invalid', 'false');
    errorElement.textContent = '';
    errorElement.classList.remove('visible');
  }
}

/**
 * Validate the signup form
 * @param {FormData} formData - Form data object
 * @returns {boolean} - True if form is valid
 */
function validateForm(formData) {
  let isValid = true;
  
  // Clear all previous errors
  ['firstName', 'lastName', 'email', 'phone', 'country', 'password', 'confirmPassword', 'terms'].forEach(clearError);
  
  // Validate first name
  const firstName = formData.get('firstName')?.trim();
  if (!firstName) {
    showError('firstName', 'First name is required');
    isValid = false;
  }
  
  // Validate last name
  const lastName = formData.get('lastName')?.trim();
  if (!lastName) {
    showError('lastName', 'Last name is required');
    isValid = false;
  }
  
  // Validate email
  const email = formData.get('email')?.trim();
  if (!email) {
    showError('email', 'Email is required');
    isValid = false;
  } else if (!validateEmail(email)) {
    showError('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  // Validate phone
  const phone = formData.get('phone')?.trim();
  if (!phone) {
    showError('phone', 'Phone number is required');
    isValid = false;
  } else if (!validatePhone(phone)) {
    showError('phone', 'Please enter a valid phone number');
    isValid = false;
  }
  
  // Validate country
  const country = formData.get('country');
  if (!country) {
    showError('country', 'Please select your country');
    isValid = false;
  }
  
  // Validate password
  const password = formData.get('password');
  if (!password) {
    showError('password', 'Password is required');
    isValid = false;
  } else {
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      showError('password', passwordValidation.reasons[0]);
      isValid = false;
    }
  }
  
  // Validate confirm password
  const confirmPassword = formData.get('confirmPassword');
  if (!confirmPassword) {
    showError('confirmPassword', 'Please confirm your password');
    isValid = false;
  } else if (password !== confirmPassword) {
    showError('confirmPassword', 'Passwords do not match');
    isValid = false;
  }
  
  // Validate terms acceptance
  const terms = formData.get('terms');
  if (!terms) {
    showError('terms', 'You must accept the terms and conditions');
    isValid = false;
  }
  
  return isValid;
}

// ===========================
// FORM SUBMISSION HANDLER
// ===========================

document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  // Validate form
  if (!validateForm(formData)) {
    return;
  }
  
  // Prepare signup data
  const signupData = {
    role: 'user', // Auto-assign user role
    firstName: formData.get('firstName')?.trim(),
    lastName: formData.get('lastName')?.trim(),
    email: formData.get('email')?.trim(),
    phone: formData.get('phone')?.trim(),
    country: formData.get('country'),
    password: formData.get('password'),
    termsAccepted: true
  };
  
  // Show loading state
  const signupBtn = document.getElementById('signupBtn');
  signupBtn.classList.add('btn-loading');
  signupBtn.disabled = true;
  
  try {
    // EDIT THIS: Replace with actual API endpoint
    const response = await postJSON('/api/auth/signup', signupData);
    
    if (response.success) {
      // Show success message
      showToast('Account created successfully! Verification email sent.', 'success');
      
      console.log('✅ User created:', response);
      console.log('📧 Verification email would be sent to:', signupData.email);
      
      // EDIT THIS: Modify redirect URL
      // Redirect to email verification page after 2 seconds
      setTimeout(() => {
        const verifyUrl = 'email-verification.html?email=' + encodeURIComponent(signupData.email);
        console.log(`🔀 Redirecting to: ${verifyUrl}`);
        
        // In production, uncomment this:
        // window.location.href = verifyUrl;
        
        showToast(`Redirect: ${verifyUrl}`, 'info');
      }, 2000);
      
    } else {
      showToast('Registration failed. Please try again.', 'error');
    }
    
  } catch (error) {
    console.error('Signup error:', error);
    showToast('An error occurred. Please try again.', 'error');
  } finally {
    // Remove loading state
    signupBtn.classList.remove('btn-loading');
    signupBtn.disabled = false;
  }
});

// ===========================
// PASSWORD STRENGTH INDICATOR
// ===========================

document.getElementById('password').addEventListener('input', (e) => {
  const password = e.target.value;
  
  if (password.length === 0) {
    updatePasswordStrength(0);
    return;
  }
  
  const validation = validatePassword(password);
  updatePasswordStrength(validation.strength);
});

// ===========================
// SOCIAL SIGNUP HANDLERS
// ===========================

/**
 * Handle Google signup
 * EDIT THIS: Implement actual Google OAuth flow
 */
document.getElementById('googleSignupBtn').addEventListener('click', () => {
  console.log('🔵 Google signup initiated');
  console.log('Provider attribute:', document.getElementById('googleSignupBtn').dataset.provider);
  
  // In production, redirect to Google OAuth:
  // window.location.href = '/api/auth/google';
  
  showToast('Google signup would be initiated here', 'info');
});

/**
 * Handle Apple signup
 * EDIT THIS: Implement actual Apple OAuth flow
 */
document.getElementById('appleSignupBtn').addEventListener('click', () => {
  console.log('🍎 Apple signup initiated');
  console.log('Provider attribute:', document.getElementById('appleSignupBtn').dataset.provider);
  
  // In production, redirect to Apple OAuth:
  // window.location.href = '/api/auth/apple';
  
  showToast('Apple signup would be initiated here', 'info');
});

// ===========================
// REAL-TIME INPUT VALIDATION
// ===========================

// Clear errors on input
['firstName', 'lastName', 'email', 'phone', 'country', 'password', 'confirmPassword'].forEach(fieldId => {
  const element = document.getElementById(fieldId);
  if (element) {
    element.addEventListener('input', () => clearError(fieldId));
    element.addEventListener('change', () => clearError(fieldId));
  }
});

// Clear terms error when checkbox is checked
document.getElementById('terms')?.addEventListener('change', () => clearError('terms'));

// ===========================
// ACCESSIBILITY: ANNOUNCE PAGE LOAD
// ===========================

window.addEventListener('load', () => {
  console.log('✅ User signup page loaded');
  console.log('📌 Ready for backend integration');
  console.log('');
  console.log('INTEGRATION CHECKLIST:');
  console.log('1. Replace postJSON() function with actual fetch API calls');
  console.log('2. Implement POST /api/auth/signup endpoint');
  console.log('3. Implement POST /api/auth/send-verification endpoint');
  console.log('4. Implement POST /api/auth/google endpoint for Google OAuth');
  console.log('5. Implement POST /api/auth/apple endpoint for Apple OAuth');
  console.log('6. Enable actual redirects (uncomment window.location.href)');
});
