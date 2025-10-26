/**
 * TREKKA ANIMATION HELPERS
 * Simple, beginner-friendly animation utilities
 * Supports fade-in, slide-up, and scroll-reveal effects
 */

/**
 * Fade in an element with optional delay
 * @param {HTMLElement} element - The element to fade in
 * @param {number} delay - Delay in milliseconds before starting animation (default: 0)
 */
function fadeIn(element, delay = 0) {
  // Check if element exists
  if (!element) {
    console.warn('fadeIn: Element not found');
    return;
  }

  // Set initial opacity to 0
  element.style.opacity = '0';
  element.style.transition = 'opacity 0.6s ease';

  // Wait for delay, then fade in
  setTimeout(() => {
    element.style.opacity = '1';
  }, delay);
}

/**
 * Slide up an element with optional delay
 * @param {HTMLElement} element - The element to slide up
 * @param {number} delay - Delay in milliseconds before starting animation (default: 0)
 */
function slideUp(element, delay = 0) {
  // Check if element exists
  if (!element) {
    console.warn('slideUp: Element not found');
    return;
  }

  // Set initial state - below viewport and transparent
  element.style.opacity = '0';
  element.style.transform = 'translateY(30px)';
  element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

  // Wait for delay, then slide up
  setTimeout(() => {
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }, delay);
}

/**
 * Reveal elements when they scroll into view
 * Uses Intersection Observer API for performance
 * @param {string} selector - CSS selector for elements to reveal (e.g., '.slide-up', '.fade-in')
 * @param {number} offset - How far into viewport before triggering (0.0 to 1.0, default: 0.1)
 */
function revealOnScroll(selector, offset = 0.1) {
  // Find all elements matching the selector
  const elements = document.querySelectorAll(selector);

  // If no elements found, exit early
  if (elements.length === 0) {
    return;
  }

  // Check if browser supports Intersection Observer
  if (!('IntersectionObserver' in window)) {
    // Fallback: just show all elements immediately
    elements.forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
    return;
  }

  // Configuration for Intersection Observer
  const observerOptions = {
    // Trigger when element is 10% visible (or custom offset)
    threshold: offset,
    // Start observing slightly before element enters viewport
    rootMargin: '0px 0px -50px 0px'
  };

  // Callback function when element enters viewport
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      // Check if element is intersecting (visible in viewport)
      if (entry.isIntersecting) {
        // Add 'visible' class to trigger CSS animation
        entry.target.classList.add('visible');
        
        // Alternative: Trigger animation via JavaScript
        // Uncomment below if you prefer JS-based animation
        // entry.target.style.opacity = '1';
        // entry.target.style.transform = 'translateY(0)';
        
        // Stop observing this element (animation only happens once)
        observer.unobserve(entry.target);
      }
    });
  };

  // Create the Intersection Observer
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Start observing each element
  elements.forEach(element => {
    observer.observe(element);
  });
}

/**
 * Initialize all scroll-based animations
 * Call this function when DOM is ready
 * Respects user's prefers-reduced-motion setting
 */
function initAnimations() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    // Show all elements immediately without animations
    const elements = document.querySelectorAll('.slide-up, .fade-in');
    elements.forEach(element => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    });
    return;
  }
  
  // Reveal elements with 'slide-up' class when scrolling
  revealOnScroll('.slide-up', 0.15);
  
  // Reveal elements with 'fade-in' class when scrolling
  revealOnScroll('.fade-in', 0.15);
  
  // You can add more reveal animations here
  // Example: revealOnScroll('.custom-animation', 0.2);
}

/**
 * Stagger animation for multiple elements
 * Animates elements one after another with a delay
 * @param {string} selector - CSS selector for elements to animate
 * @param {number} delayBetween - Delay between each element in milliseconds (default: 100)
 * @param {string} animationType - Type of animation: 'fadeIn' or 'slideUp' (default: 'slideUp')
 */
function staggerAnimation(selector, delayBetween = 100, animationType = 'slideUp') {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    const delay = index * delayBetween;
    
    if (animationType === 'fadeIn') {
      fadeIn(element, delay);
    } else {
      slideUp(element, delay);
    }
  });
}

// Expose functions as globals for usage when this file is loaded via a regular <script> tag
// (keeps backward compatibility without using ES modules)
/* istanbul ignore next */
if (typeof window !== 'undefined') {
  window.fadeIn = fadeIn;
  window.slideUp = slideUp;
  window.revealOnScroll = revealOnScroll;
  window.initAnimations = initAnimations;
  window.staggerAnimation = staggerAnimation;
}

// Also support CommonJS environments (optional)
/* istanbul ignore next */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fadeIn,
    slideUp,
    revealOnScroll,
    initAnimations,
    staggerAnimation
  };
}
