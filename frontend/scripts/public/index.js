/**
 * INDEX.JS - Homepage Specific JavaScript
 * Handles hero animations and page-specific interactions
 */

(function() {
  'use strict';

  /**
   * Initialize homepage animations
   */
  function initHeroAnimations() {
    // Hero section elements
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');
    const trustBadges = document.querySelector('.trust-badges');

    // Trigger animations with stagger effect
    if (heroTitle) {
      setTimeout(() => heroTitle.classList.add('fade-in'), 100);
    }
    if (heroSubtitle) {
      setTimeout(() => heroSubtitle.classList.add('fade-in'), 300);
    }
    if (heroCta) {
      setTimeout(() => heroCta.classList.add('fade-in'), 500);
    }
    if (trustBadges) {
      setTimeout(() => trustBadges.classList.add('fade-in'), 700);
    }
  }

  /**
   * Animate stats counter (counts up from 0 to target number)
   */
  function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Check if Intersection Observer is supported
    if (!('IntersectionObserver' in window)) {
      return; // Skip animation on older browsers
    }

    // Observer options
    const options = {
      threshold: 0.5 // Trigger when 50% visible
    };

    // Observer callback
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statElement = entry.target;
          const targetText = statElement.textContent;
          
          // Extract number from text (e.g., "50,000+" -> 50000)
          const targetNumber = parseInt(targetText.replace(/[^0-9]/g, ''));
          
          // Only animate if it's a valid number
          if (!isNaN(targetNumber) && targetNumber > 0) {
            animateCounter(statElement, targetNumber, targetText);
          }
          
          // Stop observing after animation
          observer.unobserve(statElement);
        }
      });
    }, options);

    // Observe each stat number
    statNumbers.forEach(stat => observer.observe(stat));
  }

  /**
   * Animate counter from 0 to target
   */
  function animateCounter(element, target, originalText) {
    const duration = 2000; // 2 seconds
    const steps = 60; // Number of updates
    const increment = target / steps;
    const stepDuration = duration / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      
      if (current >= target) {
        element.textContent = originalText; // Restore original text with formatting
        clearInterval(timer);
      } else {
        // Format number with commas
        const formattedNumber = Math.floor(current).toLocaleString();
        element.textContent = formattedNumber;
      }
    }, stepDuration);
  }

  /**
   * Initialize all homepage features when DOM is ready
   */
  function init() {
    initHeroAnimations();
    initStatsCounter();
    
    console.log('Index page scripts loaded');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
