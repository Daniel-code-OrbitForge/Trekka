/**
 * TREKKA DASHBOARD - Theme Management
 * Handles light/dark theme toggle with localStorage persistence
 */

(function() {
  'use strict';
  
  // Initialize theme on page load
  function initTheme() {
    const savedTheme = localStorage.getItem('trekka-theme') || 'light';
    applyTheme(savedTheme);
    
    // Update toggle button
    updateThemeToggleIcon(savedTheme);
  }
  
  // Apply theme to document
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }
  
  // Toggle theme
  function toggleTheme() {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    applyTheme(newTheme);
    localStorage.setItem('trekka-theme', newTheme);
    updateThemeToggleIcon(newTheme);
    
    // Smooth transition animation
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }
  
  // Update theme toggle button icon
  function updateThemeToggleIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'fas fa-sun';
        } else {
          icon.className = 'fas fa-moon';
        }
      }
    }
  }
  
  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
  } else {
    initTheme();
  }
  
  // Make toggle function globally available
  window.toggleTheme = toggleTheme;
})();
