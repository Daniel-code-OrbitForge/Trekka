/**
 * DOCUMENTATION.JS - Documentation Page Specific JavaScript
 * Handles API documentation navigation and code examples
 */

(function() {
  'use strict';

  /**
   * Initialize documentation sidebar navigation
   */
  function initDocSidebar() {
    const sidebarLinks = document.querySelectorAll('.doc-sidebar a');
    
    sidebarLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // Remove active from all
        sidebarLinks.forEach(l => l.classList.remove('active'));
        
        // Add active to clicked
        link.classList.add('active');
      });
    });
    
    // Highlight current section on scroll
    if ('IntersectionObserver' in window) {
      initScrollSpy();
    }
  }

  /**
   * Scroll spy for documentation sections
   */
  function initScrollSpy() {
    const sections = document.querySelectorAll('[id^="section-"]');
    const sidebarLinks = document.querySelectorAll('.doc-sidebar a');
    
    const options = {
      threshold: 0.5,
      rootMargin: '-100px 0px -50% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          
          // Update sidebar
          sidebarLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              sidebarLinks.forEach(l => l.classList.remove('active'));
              link.classList.add('active');
            }
          });
        }
      });
    }, options);
    
    sections.forEach(section => observer.observe(section));
  }

  /**
   * Initialize code block copy buttons
   */
  function initCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
      // Create copy button
      const copyButton = document.createElement('button');
      copyButton.className = 'code-copy-btn';
      copyButton.textContent = 'Copy';
      copyButton.setAttribute('aria-label', 'Copy code');
      
      // Insert button
      const pre = block.parentElement;
      pre.style.position = 'relative';
      pre.appendChild(copyButton);
      
      // Copy functionality
      copyButton.addEventListener('click', async () => {
        const code = block.textContent;
        
        try {
          await navigator.clipboard.writeText(code);
          copyButton.textContent = 'Copied!';
          copyButton.classList.add('copied');
          
          setTimeout(() => {
            copyButton.textContent = 'Copy';
            copyButton.classList.remove('copied');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
          copyButton.textContent = 'Failed';
        }
      });
    });
  }

  /**
   * Initialize API endpoint tabs (if any)
   */
  function initApiTabs() {
    const tabs = document.querySelectorAll('[data-tab]');
    const tabPanels = document.querySelectorAll('[data-tab-panel]');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const targetPanel = tab.getAttribute('data-tab');
        
        // Update tabs
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update panels
        tabPanels.forEach(panel => {
          if (panel.getAttribute('data-tab-panel') === targetPanel) {
            panel.classList.add('active');
          } else {
            panel.classList.remove('active');
          }
        });
      });
    });
  }

  /**
   * Initialize search functionality for documentation
   */
  function initDocSearch() {
    const searchInput = document.getElementById('docSearch');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const sections = document.querySelectorAll('.doc-section');
      
      sections.forEach(section => {
        const content = section.textContent.toLowerCase();
        
        if (content.includes(searchTerm)) {
          section.style.display = 'block';
        } else {
          section.style.display = 'none';
        }
      });
    });
  }

  /**
   * Initialize all documentation page features
   */
  function init() {
    initDocSidebar();
    initCodeCopy();
    initApiTabs();
    initDocSearch();
    
    console.log('Documentation page scripts loaded');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
