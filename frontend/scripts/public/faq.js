/**
 * FAQ.JS - FAQ Page Specific JavaScript
 * Handles accordion functionality for FAQ items
 */

(function() {
  'use strict';

  /**
   * Initialize FAQ accordion
   */
  function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      if (!question) return;
      
      question.addEventListener('click', () => {
        // Close all other items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle current item
        item.classList.toggle('active');
      });
    });
  }

  /**
   * Initialize category filtering
   */
  function initCategoryFilter() {
    const categories = document.querySelectorAll('.faq-category');
    
    if (categories.length === 0) return;

    categories.forEach(category => {
      category.addEventListener('click', () => {
        const categoryName = category.getAttribute('data-category');
        
        // Highlight active category
        categories.forEach(cat => cat.classList.remove('active'));
        category.classList.add('active');
        
        // Filter FAQ items
        filterFaqItems(categoryName);
      });
    });
  }

  /**
   * Filter FAQ items by category
   */
  function filterFaqItems(categoryName) {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category');
      
      if (!categoryName || categoryName === 'all' || itemCategory === categoryName) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
        item.classList.remove('active'); // Close if hidden
      }
    });
  }

  /**
   * Handle deep linking to specific FAQ items
   * Example: faq.html#booking
   */
  function handleDeepLink() {
    const hash = window.location.hash.substring(1);
    
    if (!hash) return;
    
    // Find FAQ item with matching ID or category
    const targetItem = document.getElementById(hash) || 
                      document.querySelector(`[data-category="${hash}"]`);
    
    if (targetItem) {
      // If it's a category, filter by it
      if (targetItem.classList.contains('faq-category')) {
        targetItem.click();
      }
      // If it's an FAQ item, open it and scroll to it
      else if (targetItem.classList.contains('faq-item')) {
        targetItem.classList.add('active');
        setTimeout(() => {
          targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  }

  /**
   * Add search functionality for FAQ
   */
  function initFaqSearch() {
    const searchInput = document.getElementById('faqSearch');
    
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase().trim();
      const faqItems = document.querySelectorAll('.faq-item');
      
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question')?.textContent.toLowerCase() || '';
        const answer = item.querySelector('.faq-answer')?.textContent.toLowerCase() || '';
        
        if (question.includes(searchTerm) || answer.includes(searchTerm)) {
          item.style.display = 'block';
          
          // Optionally expand matching items
          if (searchTerm.length > 2) {
            item.classList.add('active');
          }
        } else {
          item.style.display = 'none';
          item.classList.remove('active');
        }
      });
    });
  }

  /**
   * Initialize all FAQ page features
   */
  function init() {
    initFaqAccordion();
    initCategoryFilter();
    initFaqSearch();
    handleDeepLink();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleDeepLink);
    
    console.log('FAQ page scripts loaded');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
