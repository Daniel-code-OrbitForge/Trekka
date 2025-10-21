/**
 * ABOUT.JS - About Page Specific JavaScript
 * Handles about page animations and interactions
 */

(function() {
  'use strict';

  /**
   * Initialize timeline animations
   */
  function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    if (timelineItems.length === 0) return;

    // Use Intersection Observer for scroll animations
    if ('IntersectionObserver' in window) {
      const options = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, options);

      timelineItems.forEach(item => observer.observe(item));
    }
  }

  /**
   * Initialize team member interactions
   */
  function initTeamMembers() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
      // Add hover effect to reveal more information
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }

  /**
   * Animate statistics on scroll
   */
  function initStatsAnimation() {
    const stats = document.querySelectorAll('.stat-number, .value-number');
    
    if (stats.length === 0) return;

    const options = {
      threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const finalValue = element.textContent;
          const numericValue = parseInt(finalValue.replace(/[^0-9]/g, ''));
          
          if (!isNaN(numericValue)) {
            animateValue(element, 0, numericValue, 2000, finalValue);
          }
          
          observer.unobserve(element);
        }
      });
    }, options);

    stats.forEach(stat => observer.observe(stat));
  }

  /**
   * Animate a number from start to end
   */
  function animateValue(element, start, end, duration, finalText) {
    const range = end - start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    let current = start;

    const timer = setInterval(() => {
      current += increment * Math.ceil(range / 50);
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        element.textContent = finalText;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, stepTime);
  }

  /**
   * Initialize all about page features
   */
  function init() {
    initTimelineAnimations();
    initTeamMembers();
    initStatsAnimation();
    
    console.log('About page scripts loaded');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
