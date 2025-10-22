/**
 * CAREERS.JS - Careers Page Specific JavaScript
 * Handles job filtering and application interactions
 */

(function() {
  'use strict';

  /**
   * Initialize job filtering
   */
  function initJobFilters() {
    const departmentFilters = document.querySelectorAll('[data-filter-department]');
    const locationFilters = document.querySelectorAll('[data-filter-location]');
    const positionCards = document.querySelectorAll('.position-card');
    
    // Department filter
    departmentFilters.forEach(filter => {
      filter.addEventListener('click', () => {
        const department = filter.getAttribute('data-filter-department');
        filterPositions('department', department);
        
        // Update active state
        departmentFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
      });
    });
    
    // Location filter
    locationFilters.forEach(filter => {
      filter.addEventListener('click', () => {
        const location = filter.getAttribute('data-filter-location');
        filterPositions('location', location);
        
        // Update active state
        locationFilters.forEach(f => f.classList.remove('active'));
        filter.classList.add('active');
      });
    });
  }

  /**
   * Filter job positions
   */
  function filterPositions(filterType, filterValue) {
    const positions = document.querySelectorAll('.position-card');
    
    positions.forEach(position => {
      const positionValue = position.getAttribute(`data-${filterType}`);
      
      if (filterValue === 'all' || positionValue === filterValue) {
        position.style.display = 'block';
        // Add animation
        position.style.animation = 'fadeIn 0.5s ease';
      } else {
        position.style.display = 'none';
      }
    });
  }

  /**
   * Handle application button clicks
   */
  function initApplicationButtons() {
    const applyButtons = document.querySelectorAll('.btn-apply, [data-action="apply"]');
    
    applyButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        // If it's a mailto link, let it proceed normally
        if (button.getAttribute('href')?.startsWith('mailto:')) {
          return;
        }
        
        e.preventDefault();
        
        // Get job title
        const positionCard = button.closest('.position-card');
        const jobTitle = positionCard?.querySelector('h3')?.textContent || 'Unknown Position';
        
        // Show confirmation
        if (window.TrekkaToast) {
          window.TrekkaToast.show(`Redirecting to application for: ${jobTitle}`, 'success');
        }
        
        // Could redirect to application form or open modal
        // For now, just log
        console.log('Apply for:', jobTitle);
      });
    });
  }

  /**
   * Initialize position card animations
   */
  function initPositionAnimations() {
    const positionCards = document.querySelectorAll('.position-card');
    
    if (positionCards.length === 0) return;

    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animation
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, index * 100);
          
          observer.unobserve(entry.target);
        }
      });
    }, options);

    positionCards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      observer.observe(card);
    });
  }

  /**
   * Initialize all careers page features
   */
  function init() {
    initJobFilters();
    initApplicationButtons();
    initPositionAnimations();
    
    console.log('Careers page scripts loaded');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
