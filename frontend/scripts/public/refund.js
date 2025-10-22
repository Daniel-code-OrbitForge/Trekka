/**
 * REFUND.JS - Refund Policy Page Specific JavaScript
 * Handles refund policy navigation and refund request form
 */

(function() {
  'use strict';

  /**
   * Generate table of contents
   */
  function generateTableOfContents() {
    const content = document.querySelector('.refund-content, .policy-content');
    const tocContainer = document.getElementById('tableOfContents');
    
    if (!content || !tocContainer) return;
    
    const headings = content.querySelectorAll('h2, h3');
    
    if (headings.length === 0) return;
    
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `section-${index}`;
      }
      
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      
      if (heading.tagName === 'H3') {
        li.style.paddingLeft = '1rem';
        li.style.fontSize = '0.875rem';
      }
      
      li.appendChild(link);
      tocList.appendChild(li);
    });
    
    tocContainer.appendChild(tocList);
  }

  /**
   * Initialize refund request form
   */
  function initRefundForm() {
    const refundForm = document.getElementById('refundRequestForm');
    
    if (!refundForm) return;

    refundForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Get form data
      const formData = new FormData(refundForm);
      const data = Object.fromEntries(formData.entries());
      
      // Validate
      if (!data.bookingId || !data.email || !data.reason) {
        if (window.TrekkaToast) {
          window.TrekkaToast.show('Please fill in all required fields', 'error');
        }
        return;
      }
      
      // Show loading
      const submitBtn = refundForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Submitting...';
      submitBtn.disabled = true;
      
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Refund Request',
            email: data.email,
            message: `Refund request for booking ${data.bookingId}. Reason: ${data.reason}. Details: ${data.details || 'N/A'}`
          })
        });
        
        if (response.ok) {
          refundForm.reset();
          if (window.TrekkaToast) {
            window.TrekkaToast.show('Refund request submitted successfully!', 'success');
          }
        } else {
          throw new Error('Submission failed');
        }
      } catch (error) {
        console.error('Refund form error:', error);
        if (window.TrekkaToast) {
          window.TrekkaToast.show('Failed to submit request. Please try again.', 'error');
        }
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  /**
   * Initialize refund eligibility calculator
   */
  function initEligibilityCalculator() {
    const calculator = document.getElementById('eligibilityCalculator');
    
    if (!calculator) return;
    
    const dateInput = calculator.querySelector('input[type="date"]');
    const checkBtn = calculator.querySelector('button');
    const result = calculator.querySelector('.result');
    
    if (dateInput && checkBtn && result) {
      checkBtn.addEventListener('click', () => {
        const bookingDate = new Date(dateInput.value);
        const today = new Date();
        const daysDiff = Math.floor((today - bookingDate) / (1000 * 60 * 60 * 24));
        
        // Example: 30-day refund policy
        if (daysDiff <= 30) {
          result.textContent = `✓ Your booking is eligible for a refund (${30 - daysDiff} days remaining)`;
          result.className = 'result success';
        } else {
          result.textContent = `✗ Your booking is past the 30-day refund window (${daysDiff} days since booking)`;
          result.className = 'result error';
        }
        
        result.style.display = 'block';
      });
    }
  }

  /**
   * Initialize all refund page features
   */
  function init() {
    generateTableOfContents();
    initRefundForm();
    initEligibilityCalculator();
    
    console.log('Refund page scripts loaded');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
