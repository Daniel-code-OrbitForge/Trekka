/**
 * PRESS.JS - Press Page Specific JavaScript
 * Handles press releases and media kit interactions
 */

(function() {
  'use strict';

  /**
   * Initialize press release filtering
   */
  function initPressFilters() {
    const filterButtons = document.querySelectorAll('[data-filter-year]');
    const pressItems = document.querySelectorAll('.press-item');
    
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        const year = button.getAttribute('data-filter-year');
        
        // Update active state
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter press items
        pressItems.forEach(item => {
          const itemYear = item.getAttribute('data-year');
          
          if (year === 'all' || itemYear === year) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /**
   * Initialize media kit download tracking
   */
  function initMediaKitDownloads() {
    const downloadButtons = document.querySelectorAll('[data-download]');
    
    downloadButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const assetName = button.getAttribute('data-download');
        
        // Track download (could send to analytics)
        console.log('Media kit download:', assetName);
        
        // Show confirmation toast
        if (window.TrekkaToast) {
          window.TrekkaToast.show(`Downloading ${assetName}...`, 'success');
        }
      });
    });
  }

  /**
   * Initialize share buttons for press releases
   */
  function initShareButtons() {
    const shareButtons = document.querySelectorAll('[data-share]');
    
    shareButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        
        const platform = button.getAttribute('data-share');
        const url = window.location.href;
        const title = document.title;
        
        let shareUrl;
        
        switch(platform) {
          case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            break;
          case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            break;
          case 'linkedin':
            shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            break;
          case 'email':
            shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
            break;
        }
        
        if (shareUrl) {
          window.open(shareUrl, '_blank', 'width=600,height=400');
        }
      });
    });
  }

  /**
   * Initialize all press page features
   */
  function init() {
    initPressFilters();
    initMediaKitDownloads();
    initShareButtons();
    
    console.log('Press page scripts loaded');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
