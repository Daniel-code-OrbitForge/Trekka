/**
 * PARTNERSHIP.JS - Partnership Page Specific JavaScript
 * Handles partner registration and information
 */

(function() {
  'use strict';

  /**
   * Initialize partner type selection
   */
  function initPartnerTypeSelection() {
    const partnerTypes = document.querySelectorAll('.partner-type-card');
    
    partnerTypes.forEach(card => {
      card.addEventListener('click', () => {
        // Remove active class from all
        partnerTypes.forEach(c => c.classList.remove('active'));
        
        // Add active class to clicked card
        card.classList.add('active');
        
        // Get partner type
        const partnerType = card.getAttribute('data-partner-type');
        
        // Update form or show relevant information
        updatePartnerForm(partnerType);
      });
    });
  }

  /**
   * Update partner registration form based on type
   */
  function updatePartnerForm(partnerType) {
    const form = document.getElementById('partnerForm');
    
    if (!form) return;
    
    // You can show/hide different form fields based on partner type
    console.log('Selected partner type:', partnerType);
    
    // Example: Update form title
    const formTitle = form.querySelector('h3');
    if (formTitle) {
      formTitle.textContent = `Register as ${partnerType}`;
    }
  }

  /**
   * Initialize partner registration form
   */
  function initPartnerForm() {
    const partnerForm = document.getElementById('partnerForm');
    
    if (!partnerForm) return;

    partnerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(partnerForm);
      const data = Object.fromEntries(formData.entries());
      
      // Validate required fields
      if (!data.companyName || !data.email || !data.phone) {
        if (window.TrekkaToast) {
          window.TrekkaToast.show('Please fill in all required fields', 'error');
        }
        return;
      }
      
      // Show loading state
      const submitBtn = partnerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      
      try {
        // Send to API
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: data.companyName,
            email: data.email,
            message: `Partnership inquiry - Type: ${data.partnerType}, Phone: ${data.phone}`,
          })
        });
        
        if (response.ok) {
          partnerForm.reset();
          if (window.TrekkaToast) {
            window.TrekkaToast.show('Partnership request submitted successfully!', 'success');
          }
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        console.error('Partner form error:', error);
        if (window.TrekkaToast) {
          window.TrekkaToast.show('Failed to submit. Please try again.', 'error');
        }
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  /**
   * Initialize benefit cards animation
   */
  function initBenefitAnimations() {
    const benefitCards = document.querySelectorAll('.benefit-card');
    
    if (benefitCards.length === 0) return;

    const options = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('slide-up');
          observer.unobserve(entry.target);
        }
      });
    }, options);

    benefitCards.forEach(card => observer.observe(card));
  }

  /**
   * Initialize all partnership page features
   */
  function init() {
    initPartnerTypeSelection();
    initPartnerForm();
    initBenefitAnimations();
    
    console.log('Partnership page scripts loaded');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
