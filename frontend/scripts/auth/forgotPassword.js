/**
 * FORGOT-PASSWORD.JS - Trekka Forgot Password Logic
 * 
 * CUSTOMIZATION POINTS:
 * - Line 110: Change API endpoint URL for password reset
 * 
 * BACKEND INTEGRATION:
 * When ready to connect to backend, replace the simulated postJSON function
 * with actual fetch calls to your API endpoint:
 * - POST /api/auth/forgot-password - Send password reset email
 * 
 * SECURITY NOTE:
 * Always return a generic success message regardless of whether the email exists
 * to prevent email enumeration attacks.
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
  
  // Simulate successful response
  // NOTE: In production, always return success regardless of whether email exists
  // This prevents email enumeration attacks
  return {
    success: true,
    message: 'If an account exists, a reset link has been sent'
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

// ===========================
// FORM SUBMISSION HANDLER
// ===========================

document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const email = formData.get('email')?.trim();
  
  // Clear previous errors
  clearError('email');
  
  // Validate email
  if (!email) {
    showError('email', 'Email is required');
    return;
  }
  
  if (!validateEmail(email)) {
    showError('email', 'Please enter a valid email address');
    return;
  }
  
  // Show loading state
  const resetBtn = document.getElementById('resetBtn');
  resetBtn.classList.add('btn-loading');
  resetBtn.disabled = true;
  
  try {
    // EDIT THIS: Replace with actual API endpoint
    const response = await postJSON('/api/auth/forgot-password', { email });
    
    if (response.success) {
      // Hide form, show success message
      document.getElementById('forgotPasswordForm').querySelector('.form-group').style.display = 'none';
      document.getElementById('resetBtn').style.display = 'none';
      document.getElementById('successMessage').classList.remove('hidden');
      
      // Show toast
      showToast('Password reset email sent (if account exists)', 'success');
      
      console.log('✅ Password reset request processed');
      console.log('📧 Reset link would be sent to:', email);
      console.log('🔒 Security: Generic message shown regardless of account existence');
    } else {
      showToast('Unable to process request. Please try again.', 'error');
    }
    
  } catch (error) {
    console.error('Forgot password error:', error);
    showToast('An error occurred. Please try again.', 'error');
  } finally {
    // Remove loading state
    resetBtn.classList.remove('btn-loading');
    resetBtn.disabled = false;
  }
});

// ===========================
// REAL-TIME INPUT VALIDATION
// ===========================

document.getElementById('email').addEventListener('input', () => clearError('email'));

// ===========================
// ACCESSIBILITY: ANNOUNCE PAGE LOAD
// ===========================

window.addEventListener('load', () => {
  console.log('✅ Forgot password page loaded');
  console.log('📌 Ready for backend integration');
  console.log('');
  console.log('INTEGRATION CHECKLIST:');
  console.log('1. Replace postJSON() function with actual fetch API call');
  console.log('2. Implement POST /api/auth/forgot-password endpoint');
  console.log('3. Backend should send password reset email with time-limited token');
  console.log('4. Always return generic success message (prevent email enumeration)');
  console.log('5. Create password reset page to handle the reset token');
});
