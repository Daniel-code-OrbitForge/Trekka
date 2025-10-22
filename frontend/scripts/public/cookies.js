/**
 * COOKIES.JS - Cookie Policy Page Specific JavaScript
 * Handles cookie preferences and consent management
 */

(function() {
  'use strict';

  /**
   * Generate table of contents
   */
  function generateTableOfContents() {
    const content = document.querySelector('.cookie-content, .policy-content');
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
   * Initialize cookie consent banner
   */
  function initCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    const acceptBtn = document.getElementById('acceptCookies');
    const rejectBtn = document.getElementById('rejectCookies');
    const customizeBtn = document.getElementById('customizeCookies');
    
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent && banner) {
      banner.style.display = 'block';
    }
    
    // Accept all cookies
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        if (banner) banner.style.display = 'none';
        if (window.TrekkaToast) {
          window.TrekkaToast.show('Cookie preferences saved', 'success');
        }
      });
    }
    
    // Reject all cookies
    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'rejected');
        if (banner) banner.style.display = 'none';
        if (window.TrekkaToast) {
          window.TrekkaToast.show('Cookie preferences saved', 'success');
        }
      });
    }
    
    // Customize cookies
    if (customizeBtn) {
      customizeBtn.addEventListener('click', () => {
        showCookiePreferences();
      });
    }
  }

  /**
   * Show cookie preferences modal/panel
   */
  function showCookiePreferences() {
    const modal = document.getElementById('cookiePreferencesModal');
    
    if (modal) {
      modal.style.display = 'block';
    } else {
      // If no modal exists, scroll to preferences section
      const prefsSection = document.getElementById('cookie-preferences');
      if (prefsSection) {
        prefsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  /**
   * Initialize cookie preferences form
   */
  function initCookiePreferences() {
    const prefsForm = document.getElementById('cookiePreferencesForm');
    
    if (!prefsForm) return;

    prefsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const formData = new FormData(prefsForm);
      const preferences = {
        necessary: true, // Always true
        analytics: formData.get('analytics') === 'on',
        marketing: formData.get('marketing') === 'on',
        preferences: formData.get('preferences') === 'on'
      };
      
      // Save preferences
      localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
      localStorage.setItem('cookieConsent', 'customized');
      
      // Hide modal/banner
      const banner = document.getElementById('cookieBanner');
      const modal = document.getElementById('cookiePreferencesModal');
      if (banner) banner.style.display = 'none';
      if (modal) modal.style.display = 'none';
      
      if (window.TrekkaToast) {
        window.TrekkaToast.show('Cookie preferences saved', 'success');
      }
    });
  }

  /**
   * Load saved cookie preferences
   */
  function loadCookiePreferences() {
    const saved = localStorage.getItem('cookiePreferences');
    
    if (!saved) return;
    
    try {
      const preferences = JSON.parse(saved);
      
      // Update checkboxes if they exist
      if (preferences.analytics !== undefined) {
        const checkbox = document.getElementById('analyticsCheckbox');
        if (checkbox) checkbox.checked = preferences.analytics;
      }
      if (preferences.marketing !== undefined) {
        const checkbox = document.getElementById('marketingCheckbox');
        if (checkbox) checkbox.checked = preferences.marketing;
      }
      if (preferences.preferences !== undefined) {
        const checkbox = document.getElementById('preferencesCheckbox');
        if (checkbox) checkbox.checked = preferences.preferences;
      }
    } catch (error) {
      console.error('Error loading cookie preferences:', error);
    }
  }

  /**
   * Initialize reset cookies button
   */
  function initResetCookies() {
    const resetBtn = document.getElementById('resetCookies');
    
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        localStorage.removeItem('cookieConsent');
        localStorage.removeItem('cookiePreferences');
        
        if (window.TrekkaToast) {
          window.TrekkaToast.show('Cookie preferences reset', 'success');
        }
        
        // Reload page to show banner again
        setTimeout(() => {
          location.reload();
        }, 1000);
      });
    }
  }

  /**
   * Initialize all cookie page features
   */
  function init() {
    generateTableOfContents();
    initCookieBanner();
    initCookiePreferences();
    loadCookiePreferences();
    initResetCookies();
    
    console.log('Cookie page scripts loaded');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
