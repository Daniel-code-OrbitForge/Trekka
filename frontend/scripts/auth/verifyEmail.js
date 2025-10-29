/**
 * EMAIL-VERIFICATION.JS - Trekka Email Verification Logic
 * 
 * CUSTOMIZATION POINTS:
 * - Line 180: Change API endpoint URL for OTP verification
 * - Line 205: Modify redirect URL after successful verification
 * - Line 275: Change API endpoint URL for resending OTP
 * - Line 300: Adjust OTP expiry time (currently 5 minutes)
 * - Line 320: Adjust resend cooldown time (currently 60 seconds)
 * 
 * BACKEND INTEGRATION:
 * When ready to connect to backend, replace the simulated postJSON function
 * with actual fetch calls to your API endpoints:
 * - POST /api/auth/verify-email - Verify OTP code
 * - POST /api/auth/resend-otp - Resend verification code
 */

// ===========================
// UTILITY FUNCTIONS
// ===========================

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
  return {
    success: true,
    message: 'Email verified successfully'
  };
}

// ===========================
// EXTRACT EMAIL FROM URL
// ===========================

function getEmailFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('email') || 'your-email@example.com';
}

// Display email in the subtitle
const userEmail = getEmailFromURL();
document.getElementById('userEmail').textContent = userEmail;

// ===========================
// OTP INPUT HANDLING
// ===========================

const otpInputs = document.querySelectorAll('.otp-input');

// Auto-focus next input on type
otpInputs.forEach((input, index) => {
  input.addEventListener('input', (e) => {
    const value = e.target.value;
    
    // Only allow digits
    if (!/^\d$/.test(value)) {
      e.target.value = '';
      return;
    }
    
    // Add filled class
    if (value) {
      e.target.classList.add('filled');
    }
    
    // Auto-focus next input
    if (value && index < otpInputs.length - 1) {
      otpInputs[index + 1].focus();
    }
  });
  
  // Handle backspace
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      otpInputs[index - 1].focus();
      otpInputs[index - 1].value = '';
      otpInputs[index - 1].classList.remove('filled');
    }
  });
  
  // Handle paste
  input.addEventListener('paste', (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');
    
    digits.forEach((digit, i) => {
      if (otpInputs[i]) {
        otpInputs[i].value = digit;
        otpInputs[i].classList.add('filled');
      }
    });
    
    // Focus last filled input or next empty
    const lastIndex = Math.min(digits.length, otpInputs.length - 1);
    otpInputs[lastIndex].focus();
  });
});

// Focus first input on page load
otpInputs[0].focus();

// ===========================
// FORM SUBMISSION HANDLER
// ===========================

document.getElementById('verificationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Collect OTP code
  const otp = Array.from(otpInputs).map(input => input.value).join('');
  
  // Clear previous errors
  document.getElementById('otpError').textContent = '';
  document.getElementById('otpError').classList.remove('visible');
  
  // Validate OTP
  if (otp.length !== 6) {
    document.getElementById('otpError').textContent = 'Please enter the complete 6-digit code';
    document.getElementById('otpError').classList.add('visible');
    return;
  }
  
  if (!/^\d{6}$/.test(otp)) {
    document.getElementById('otpError').textContent = 'Code must contain only numbers';
    document.getElementById('otpError').classList.add('visible');
    return;
  }
  
  // Show loading state
  const verifyBtn = document.getElementById('verifyBtn');
  verifyBtn.classList.add('btn-loading');
  verifyBtn.disabled = true;
  
  try {
    // EDIT THIS: Replace with actual API endpoint
    const response = await postJSON('/api/auth/verify-email', {
      email: userEmail,
      otp: otp
    });
    
    if (response.success) {
      // Stop timers
      stopOTPTimer();
      
      // Show success state
      document.querySelector('.otp-container').style.display = 'none';
      document.getElementById('timer').style.display = 'none';
      document.getElementById('verifyBtn').style.display = 'none';
      document.getElementById('resendBtn').parentElement.style.display = 'none';
      document.getElementById('successState').classList.remove('hidden');
      
      // Show toast
      showToast('Email verified successfully!', 'success');
      
      console.log('✅ Email verified successfully');
      console.log('📧 Verified email:', userEmail);
      console.log('🔐 OTP:', otp);
      
      // EDIT THIS: Modify redirect URL based on user role
      // In production, you would get the user's role from the response
      setTimeout(() => {
        const dashboardUrl = '../../pages/user/dashboard.html';
        console.log(`🔀 Redirecting to: ${dashboardUrl}`);
        
        // In production, uncomment this:
        // window.location.href = dashboardUrl;
        
        showToast(`Redirect: ${dashboardUrl}`, 'info');
      }, 2000);
      
    } else {
      document.getElementById('otpError').textContent = 'Invalid verification code. Please try again.';
      document.getElementById('otpError').classList.add('visible');
      showToast('Invalid verification code', 'error');
    }
    
  } catch (error) {
    console.error('Verification error:', error);
    document.getElementById('otpError').textContent = 'An error occurred. Please try again.';
    document.getElementById('otpError').classList.add('visible');
    showToast('An error occurred. Please try again.', 'error');
  } finally {
    // Remove loading state
    verifyBtn.classList.remove('btn-loading');
    verifyBtn.disabled = false;
  }
});

// ===========================
// RESEND CODE HANDLING
// ===========================

let resendCooldown = null;

document.getElementById('resendBtn').addEventListener('click', async () => {
  // Check if on cooldown
  if (resendCooldown) {
    return;
  }
  
  try {
    // EDIT THIS: Replace with actual API endpoint
    const response = await postJSON('/api/auth/resend-otp', {
      email: userEmail
    });
    
    if (response.success) {
      showToast('Verification code resent successfully', 'success');
      console.log('📧 New OTP sent to:', userEmail);
      
      // Reset OTP timer
      resetOTPTimer();
      
      // Start resend cooldown (60 seconds)
      startResendCooldown(60);
    } else {
      showToast('Failed to resend code. Please try again.', 'error');
    }
    
  } catch (error) {
    console.error('Resend error:', error);
    showToast('An error occurred. Please try again.', 'error');
  }
});

function startResendCooldown(seconds) {
  document.getElementById('resendBtn').disabled = true;
  document.getElementById('resendBtn').style.opacity = '0.5';
  document.getElementById('resendCooldown').classList.remove('hidden');
  
  let remaining = seconds;
  document.getElementById('resendTimer').textContent = remaining;
  
  resendCooldown = setInterval(() => {
    remaining--;
    document.getElementById('resendTimer').textContent = remaining;
    
    if (remaining <= 0) {
      clearInterval(resendCooldown);
      resendCooldown = null;
      document.getElementById('resendBtn').disabled = false;
      document.getElementById('resendBtn').style.opacity = '1';
      document.getElementById('resendCooldown').classList.add('hidden');
    }
  }, 1000);
}

// ===========================
// OTP EXPIRY TIMER
// ===========================

let otpTimer = null;
let otpExpiryTime = 5 * 60; // EDIT THIS: 5 minutes in seconds

function startOTPTimer() {
  let remaining = otpExpiryTime;
  updateTimerDisplay(remaining);
  
  otpTimer = setInterval(() => {
    remaining--;
    updateTimerDisplay(remaining);
    
    if (remaining <= 0) {
      stopOTPTimer();
      handleOTPExpired();
    } else if (remaining <= 60) {
      // Turn red when less than 1 minute remaining
      document.getElementById('timer').classList.add('timer-expired');
    }
  }, 1000);
}

function stopOTPTimer() {
  if (otpTimer) {
    clearInterval(otpTimer);
    otpTimer = null;
  }
}

function resetOTPTimer() {
  stopOTPTimer();
  document.getElementById('timer').classList.remove('timer-expired');
  startOTPTimer();
}

function updateTimerDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  document.getElementById('timerCountdown').textContent = 
    `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function handleOTPExpired() {
  document.getElementById('otpError').textContent = 'Verification code has expired. Please request a new one.';
  document.getElementById('otpError').classList.add('visible');
  
  // Disable OTP inputs
  otpInputs.forEach(input => {
    input.disabled = true;
    input.style.opacity = '0.5';
  });
  
  // Disable verify button
  document.getElementById('verifyBtn').disabled = true;
  
  showToast('Verification code expired. Please request a new one.', 'warning');
}

// ===========================
// INITIALIZE
// ===========================

window.addEventListener('load', () => {
  // Start the OTP expiry timer
  startOTPTimer();
  
  console.log('✅ Email verification page loaded');
  console.log('📧 Email to verify:', userEmail);
  console.log('⏱️  OTP expires in:', otpExpiryTime, 'seconds');
  console.log('📌 Ready for backend integration');
  console.log('');
  console.log('INTEGRATION CHECKLIST:');
  console.log('1. Replace postJSON() function with actual fetch API calls');
  console.log('2. Implement POST /api/auth/verify-email endpoint');
  console.log('3. Implement POST /api/auth/resend-otp endpoint');
  console.log('4. Backend should validate OTP and mark email as verified');
  console.log('5. Backend should enforce OTP expiry (default 5 minutes)');
  console.log('6. Enable actual redirects (uncomment window.location.href)');
});
