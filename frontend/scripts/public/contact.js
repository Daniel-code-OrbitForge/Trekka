/**
 * CONTACT.JS - Contact Page Specific JavaScript
 * Handles contact form submission with validation
 */

(function() {
  'use strict';

  /**
   * Initialize contact form
   */
  function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();
      const subject = document.getElementById('subject')?.value;
      const message = document.getElementById('message')?.value.trim();
      
      // Validate required fields
      if (!name || !email || !subject || !message) {
        showFormMessage('Please fill in all required fields', 'error');
        return;
      }
      
      // Validate email format
      if (!isValidEmail(email)) {
        showFormMessage('Please enter a valid email address', 'error');
        return;
      }
      
      // Get submit button to show loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      
      try {
        // Send POST request to /api/contact
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            phone,
            subject,
            message
          })
        });
        
        if (response.ok) {
          // Success - clear form and show success message
          contactForm.reset();
          showFormMessage('Message sent successfully! We\'ll get back to you soon.', 'success');
          
          // Also show toast notification if available
          if (window.TrekkaToast) {
            window.TrekkaToast.show('Message sent successfully!', 'success');
          }
        } else {
          // Server error
          const errorData = await response.json().catch(() => ({}));
          showFormMessage(errorData.message || 'Failed to send message. Please try again.', 'error');
        }
      } catch (error) {
        // Network error
        console.error('Contact form error:', error);
        showFormMessage('Network error. Please check your connection and try again.', 'error');
      } finally {
        // Restore button state
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  /**
   * Show form message (success or error)
   */
  function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    
    if (!formMessage) return;
    
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
      setTimeout(() => {
        formMessage.style.display = 'none';
      }, 5000);
    }
  }

  /**
   * Validate email format
   */
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Add real-time validation feedback
   */
  function initFormValidation() {
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('name');
    const messageInput = document.getElementById('message');
    
    // Email validation on blur
    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        if (emailInput.value && !isValidEmail(emailInput.value)) {
          emailInput.style.borderColor = '#ef4444';
        } else {
          emailInput.style.borderColor = '';
        }
      });
      
      emailInput.addEventListener('input', () => {
        if (emailInput.style.borderColor) {
          emailInput.style.borderColor = '';
        }
      });
    }
    
    // Name validation
    if (nameInput) {
      nameInput.addEventListener('blur', () => {
        if (!nameInput.value.trim()) {
          nameInput.style.borderColor = '#ef4444';
        }
      });
      
      nameInput.addEventListener('input', () => {
        if (nameInput.style.borderColor) {
          nameInput.style.borderColor = '';
        }
      });
    }
    
    // Message validation (minimum 10 characters)
    if (messageInput) {
      messageInput.addEventListener('blur', () => {
        if (messageInput.value.trim().length < 10) {
          messageInput.style.borderColor = '#ef4444';
        }
      });
      
      messageInput.addEventListener('input', () => {
        if (messageInput.style.borderColor) {
          messageInput.style.borderColor = '';
        }
      });
    }
  }

  /**
   * Initialize all contact page features
   */
  function init() {
    initContactForm();
    initFormValidation();
    
    console.log('Contact page scripts loaded');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
