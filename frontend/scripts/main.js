/**
 * TREKKA MAIN JAVASCRIPT
 * Global behaviors and utilities for all pages
 * Handles navigation, sticky header, smooth scrolling, forms, and notifications
 */

// If animation helpers are loaded via a script tag, they will provide
// a global `initAnimations` function. Avoid using ES module import here
// so this file can be loaded with a regular <script> tag.

/**
 * UTILITY: Debounce function
 * Limits how often a function can be called (useful for scroll/resize events)
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Update CSS variable --header-height with the current header height
 * so pages with a fixed header can account for it in layout (hero, page-hero)
 */
function updateHeaderHeightVar() {
  const header = document.querySelector('.header');
  if (!header) return;
  const height = header.getBoundingClientRect().height;
  document.documentElement.style.setProperty('--header-height', `${Math.ceil(height)}px`);
}

/**
 * MOBILE NAVIGATION TOGGLE
 * Opens and closes the mobile navigation menu
 * Includes proper focus trap and enhanced accessibility
 */
function initMobileNav() {
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  // If toggle button doesn't exist, exit (not on all pages)
  if (!navToggle || !nav) return;

  // Get all focusable elements in nav for focus trap
  let focusableElements = [];
  let firstFocusable = null;
  let lastFocusable = null;

  function updateFocusableElements() {
    focusableElements = nav.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    firstFocusable = focusableElements[0];
    lastFocusable = focusableElements[focusableElements.length - 1];
  }

  // Focus trap handler
  function handleFocusTrap(e) {
    if (!nav.classList.contains('active')) return;

    // If Tab is pressed
    if (e.key === 'Tab') {
      // If Shift+Tab on first element, move to last
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } 
      // If Tab on last element, move to first
      else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  }

  // Click handler for toggle button
  navToggle.addEventListener('click', () => {
    // Toggle the 'active' class on navigation
    const isExpanded = nav.classList.toggle('active');
    
    // Update ARIA attributes for accessibility
    navToggle.setAttribute('aria-expanded', isExpanded);
    nav.setAttribute('aria-hidden', !isExpanded);
    
    // Prevent body scroll when menu is open
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
      
      // Update focusable elements and focus first
      updateFocusableElements();
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
      
      // Add focus trap listener
      document.addEventListener('keydown', handleFocusTrap);
    } else {
      document.body.style.overflow = '';
      
      // Remove focus trap listener
      document.removeEventListener('keydown', handleFocusTrap);
      
      // Return focus to toggle button
      navToggle.focus();
    }
  });

  // Close menu when clicking a navigation link
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeNav();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (nav.classList.contains('active')) {
      // Check if click is outside nav and toggle button
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) {
        closeNav();
      }
    }
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('active')) {
      closeNav();
    }
  });

  // Helper function to close nav
  function closeNav() {
    nav.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    nav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleFocusTrap);
    navToggle.focus();
  }
}

/**
 * STICKY HEADER ON SCROLL
 * Adds 'sticky' class to header when user scrolls down
 */
function initStickyHeader() {
  const header = document.querySelector('.header');
  
  // If header doesn't exist, exit
  if (!header) return;

  // Scroll handler with debounce for performance
  const handleScroll = debounce(() => {
    // Add sticky class when scrolled more than 100px
    if (window.scrollY > 100) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  }, 50);

  // Listen to scroll events
  window.addEventListener('scroll', handleScroll);
}

/**
 * SMOOTH SCROLLING FOR ANCHOR LINKS
 * Smoothly scrolls to sections when clicking anchor links (#links)
 */
function initSmoothScroll() {
  // Find all links that start with #
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Get the target element ID
      const targetId = link.getAttribute('href');
      
      // Skip if it's just '#' or empty
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      
      // If target element exists, scroll to it
      if (targetElement) {
        e.preventDefault(); // Prevent default jump behavior
        
        // Calculate position (accounting for fixed header)
        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
        const targetPosition = targetElement.offsetTop - headerHeight - 20;
        
        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * TOAST NOTIFICATION SYSTEM
 * Shows success/error messages to users
 * Note: Creates toast container dynamically (progressive enhancement)
 * Alternatively, add <div class="toast-container"></div> to HTML
 */
const Toast = {
  // Container for all toasts
  container: null,

  // Initialize toast container
  init() {
    // Try to find existing container first
    this.container = document.querySelector('.toast-container');
    
    // If not found, create one (progressive enhancement)
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      this.container.setAttribute('aria-live', 'polite');
      this.container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(this.container);
    }
  },

  // Show a toast message (XSS-safe implementation)
  show(message, type = 'success', duration = 5000) {
    this.init();

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'status');
    
    // Create icon element (using className for Font Awesome)
    const iconElement = document.createElement('i');
    iconElement.className = type === 'success' 
      ? 'toast-icon fas fa-check-circle' 
      : 'toast-icon fas fa-exclamation-circle';
    
    // Create message element (using textContent to prevent XSS)
    const messageSpan = document.createElement('span');
    messageSpan.className = 'toast-message';
    messageSpan.textContent = message; // Safe from XSS - uses textContent not innerHTML
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'toast-close';
    closeBtn.setAttribute('aria-label', 'Close notification');
    closeBtn.textContent = '×';
    
    // Assemble toast DOM
    toast.appendChild(iconElement);
    toast.appendChild(messageSpan);
    toast.appendChild(closeBtn);

    // Add to container
    this.container.appendChild(toast);

    // Close button handler
    closeBtn.addEventListener('click', () => {
      this.remove(toast);
    });

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(toast);
      }, duration);
    }
  },

  // Remove a toast
  remove(toast) {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(400px)';
    
    setTimeout(() => {
      if (toast.parentElement) {
        toast.parentElement.removeChild(toast);
      }
    }, 300);
  }
};

/**
 * NEWSLETTER FORM HANDLER
 * Handles newsletter subscription form submission
 */
function initNewsletterForm() {
  const newsletterForms = document.querySelectorAll('#newsletterForm');
  
  newsletterForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get email input
      const emailInput = form.querySelector('input[type="email"]');
      const email = emailInput.value.trim();
      
      // Basic validation
      if (!email || !email.includes('@')) {
        Toast.show('Please enter a valid email address', 'error');
        return;
      }
      
      // Get submit button to show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;
      
      try {
        // Send POST request to /api/contact endpoint
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Newsletter Subscriber',
            email: email,
            message: 'Newsletter subscription request'
          })
        });
        
        if (response.ok) {
          // Success
          Toast.show('Successfully subscribed to newsletter!', 'success');
          emailInput.value = ''; // Clear the input
        } else {
          // Server error
          const errorData = await response.json().catch(() => ({}));
          Toast.show(errorData.message || 'Subscription failed. Please try again.', 'error');
        }
      } catch (error) {
        // Network error
        console.error('Newsletter subscription error:', error);
        Toast.show('Network error. Please check your connection and try again.', 'error');
      } finally {
        // Restore button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  });
}

/**
 * ACTIVE NAVIGATION LINK HIGHLIGHTING
 * Highlights the current page in navigation
 */
function initActiveNavLink() {
  // Get current page path
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  
  // Find all navigation links
  const navLinks = document.querySelectorAll('.nav a');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    
    // Check if link matches current page
    if (href === currentPage || 
        (currentPage === '' && href === 'index.html') ||
        (currentPage === '/' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * FORM VALIDATION HELPER
 * Adds real-time validation feedback to form fields
 * @param {HTMLFormElement} form - The form to validate
 */
function addFormValidation(form) {
  if (!form) return;

  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  
  inputs.forEach(input => {
    // Validate on blur (when user leaves the field)
    input.addEventListener('blur', () => {
      if (!input.value.trim()) {
        input.style.borderColor = '#ef4444';
      } else if (input.type === 'email' && !input.value.includes('@')) {
        input.style.borderColor = '#ef4444';
      } else {
        input.style.borderColor = '';
      }
    });
    
    // Remove error styling on input
    input.addEventListener('input', () => {
      if (input.style.borderColor === 'rgb(239, 68, 68)') {
        input.style.borderColor = '';
      }
    });
  });
}

/**
 * INITIALIZE ALL MAIN FUNCTIONALITY
 * This function runs when the page loads
 */
function init() {
  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    return;
  }

  // Initialize all features
  // Update CSS variable for header height so hero sections account for fixed header
  updateHeaderHeightVar();
  // Recompute on resize (debounced)
  window.addEventListener('resize', debounce(updateHeaderHeightVar, 100));

  initMobileNav();
  initStickyHeader();
  initSmoothScroll();
  initNewsletterForm();
  initActiveNavLink();
  
  // Initialize animations from animation.js
  if (typeof initAnimations === 'function') {
    initAnimations();
  }
  
  // Add validation to all forms
  document.querySelectorAll('form').forEach(form => {
    addFormValidation(form);
  });
  
  console.log('Trekka: All scripts initialized successfully');
}

// Start initialization
init();

// Export Toast for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Toast, debounce };
}

// Make Toast globally available for page-specific scripts
window.TrekkaToast = Toast;
window.TrekkaDebounce = debounce;
