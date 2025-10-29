/**
 * COMPANY-SIGNUP-NEW.JS - Trekka Company Registration Logic
 * Matches the new UI design from product designers
 * 
 * CUSTOMIZATION POINTS:
 * - Line 200: Change API endpoint URL for company registration
 * - Line 225: Modify redirect URL after successful registration
 * - Line 80: Adjust password strength requirements
 * - Line 260: Adjust file size limit (currently 5MB)
 * 
 * BACKEND INTEGRATION:
 * When ready to connect to backend, replace the simulated postJSON function
 * with actual fetch calls to your API endpoints:
 * - POST /api/auth/company/signup - Company registration endpoint
 * - POST /api/upload/document - Upload business documents
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
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 10;
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - {valid: boolean, reasons: string[]}
 */
function validatePassword(password) {
  const reasons = [];
  
  // EDIT THIS: Customize password requirements
  if (password.length < 8) {
    reasons.push('At least 8 characters required');
  }
  
  if (!/[A-Z]/.test(password)) {
    reasons.push('Include at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    reasons.push('Include at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    reasons.push('Include at least one number');
  }
  
  return {
    valid: reasons.length === 0,
    reasons
  };
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
  
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => {
    toast.remove();
  });
  
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
  
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    companyId: 'company_' + Date.now(),
    message: 'Company registered successfully',
    autoApproved: true
  };
}

// ===========================
// FILE UPLOAD HANDLING
// ===========================

let uploadedFile = null;

document.getElementById('businessDocuments').addEventListener('change', (e) => {
  const file = e.target.files[0];
  const fileInfo = document.getElementById('fileInfo');
  
  if (!file) {
    uploadedFile = null;
    fileInfo.classList.add('hidden');
    fileInfo.textContent = '';
    return;
  }
  
  // EDIT THIS: Adjust file size limit (currently 5MB)
  const maxSize = 5 * 1024 * 1024;
  
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    showToast('Invalid file type. Please upload PDF, JPG, or PNG files.', 'error');
    e.target.value = '';
    return;
  }
  
  if (file.size > maxSize) {
    showToast(`File too large. Maximum size is ${maxSize / 1024 / 1024}MB.`, 'error');
    e.target.value = '';
    return;
  }
  
  uploadedFile = file;
  fileInfo.textContent = `Selected: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
  fileInfo.classList.remove('hidden');
  
  console.log('✅ File selected:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);
});

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
  }
}

/**
 * Validate the company signup form
 * @param {FormData} formData - Form data object
 * @returns {boolean} - True if form is valid
 */
function validateForm(formData) {
  let isValid = true;
  
  const fields = [
    'companyName', 'companyEmail', 'companyPhone', 'registrationNumber',
    'numberOfVehicles', 'companyAddress', 'contactPersonName',
    'contactPersonPosition', 'password', 'confirmPassword'
  ];
  
  fields.forEach(clearError);
  
  // Company Name
  const companyName = formData.get('companyName')?.trim();
  if (!companyName) {
    showError('companyName', 'Company name is required');
    isValid = false;
  }
  
  // Company Email
  const companyEmail = formData.get('companyEmail')?.trim();
  if (!companyEmail) {
    showError('companyEmail', 'Company email is required');
    isValid = false;
  } else if (!validateEmail(companyEmail)) {
    showError('companyEmail', 'Please enter a valid email address');
    isValid = false;
  }
  
  // Company Phone
  const companyPhone = formData.get('companyPhone')?.trim();
  if (!companyPhone) {
    showError('companyPhone', 'Company phone is required');
    isValid = false;
  } else if (!validatePhone(companyPhone)) {
    showError('companyPhone', 'Please enter a valid phone number');
    isValid = false;
  }
  
  // Registration Number
  const registrationNumber = formData.get('registrationNumber')?.trim();
  if (!registrationNumber) {
    showError('registrationNumber', 'Registration number is required');
    isValid = false;
  }
  
  // Number of Vehicles
  const numberOfVehicles = formData.get('numberOfVehicles');
  if (!numberOfVehicles || numberOfVehicles < 0) {
    showError('numberOfVehicles', 'Please enter a valid number of vehicles');
    isValid = false;
  }
  
  // Company Address
  const companyAddress = formData.get('companyAddress')?.trim();
  if (!companyAddress) {
    showError('companyAddress', 'Company address is required');
    isValid = false;
  }
  
  // Contact Person Name
  const contactPersonName = formData.get('contactPersonName')?.trim();
  if (!contactPersonName) {
    showError('contactPersonName', 'Contact person name is required');
    isValid = false;
  }
  
  // Contact Person Position
  const contactPersonPosition = formData.get('contactPersonPosition')?.trim();
  if (!contactPersonPosition) {
    showError('contactPersonPosition', 'Contact person position is required');
    isValid = false;
  }
  
  // Password
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
  
  // Confirm Password
  const confirmPassword = formData.get('confirmPassword');
  if (!confirmPassword) {
    showError('confirmPassword', 'Please confirm your password');
    isValid = false;
  } else if (password !== confirmPassword) {
    showError('confirmPassword', 'Passwords do not match');
    isValid = false;
  }
  
  return isValid;
}

// ===========================
// FORM SUBMISSION HANDLER
// ===========================

document.getElementById('companySignupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  
  if (!validateForm(formData)) {
    return;
  }
  
  const companyData = {
    role: 'company-admin',
    companyName: formData.get('companyName')?.trim(),
    companyEmail: formData.get('companyEmail')?.trim(),
    companyPhone: formData.get('companyPhone')?.trim(),
    registrationNumber: formData.get('registrationNumber')?.trim(),
    numberOfVehicles: parseInt(formData.get('numberOfVehicles')),
    companyAddress: formData.get('companyAddress')?.trim(),
    contactPersonName: formData.get('contactPersonName')?.trim(),
    contactPersonPosition: formData.get('contactPersonPosition')?.trim(),
    password: formData.get('password'),
    hasUploadedDocument: !!uploadedFile,
    documentFileName: uploadedFile?.name || null,
    documentFileSize: uploadedFile?.size || null
  };
  
  const registerBtn = document.getElementById('registerBtn');
  registerBtn.disabled = true;
  registerBtn.textContent = 'Registering...';
  
  try {
    // EDIT THIS: Replace with actual API endpoint
    const response = await postJSON('/api/auth/company/signup', companyData);
    
    if (response.success) {
      showToast('Company registered successfully!', 'success');
      
      console.log('✅ Company created:', response);
      console.log('📄 Document uploaded:', uploadedFile?.name || 'None');
      
      // EDIT THIS: Modify redirect URL
      setTimeout(() => {
        const dashboardUrl = '../../pages/company/dashboard.html';
        console.log(`🔀 Redirecting to: ${dashboardUrl}`);
        
        // In production, uncomment this:
        // window.location.href = dashboardUrl;
        
        showToast(`Redirect: ${dashboardUrl}`, 'info');
      }, 2000);
      
    } else {
      showToast('Registration failed. Please try again.', 'error');
    }
    
  } catch (error) {
    console.error('Company signup error:', error);
    showToast('An error occurred. Please try again.', 'error');
  } finally {
    registerBtn.disabled = false;
    registerBtn.textContent = 'Register Company';
  }
});

// ===========================
// SOCIAL SIGNUP HANDLERS
// ===========================

document.getElementById('googleSignupBtn').addEventListener('click', () => {
  console.log('🔵 Google company signup initiated');
  console.log('Provider attribute:', document.getElementById('googleSignupBtn').dataset.provider);
  
  // In production, redirect to Google OAuth:
  // window.location.href = '/api/auth/google?type=company';
  
  showToast('Google signup would be initiated here', 'info');
});

document.getElementById('appleSignupBtn').addEventListener('click', () => {
  console.log('🍎 Apple company signup initiated');
  console.log('Provider attribute:', document.getElementById('appleSignupBtn').dataset.provider);
  
  // In production, redirect to Apple OAuth:
  // window.location.href = '/api/auth/apple?type=company';
  
  showToast('Apple signup would be initiated here', 'info');
});

// ===========================
// REAL-TIME INPUT VALIDATION
// ===========================

const fieldIds = [
  'companyName', 'companyEmail', 'companyPhone', 'registrationNumber',
  'numberOfVehicles', 'companyAddress', 'contactPersonName',
  'contactPersonPosition', 'password', 'confirmPassword'
];

fieldIds.forEach(fieldId => {
  const element = document.getElementById(fieldId);
  if (element) {
    element.addEventListener('input', () => clearError(fieldId));
    element.addEventListener('change', () => clearError(fieldId));
  }
});

// ===========================
// INITIALIZE
// ===========================

window.addEventListener('load', () => {
  console.log('✅ Company signup page loaded');
  console.log('📌 Ready for backend integration');
  console.log('');
  console.log('INTEGRATION CHECKLIST:');
  console.log('1. Replace postJSON() function with actual fetch API calls');
  console.log('2. Implement POST /api/auth/company/signup endpoint');
  console.log('3. Implement POST /api/upload/document endpoint for file uploads');
  console.log('4. Implement POST /api/auth/google endpoint for Google OAuth');
  console.log('5. Implement POST /api/auth/apple endpoint for Apple OAuth');
  console.log('6. Enable actual redirects (uncomment window.location.href)');
});
