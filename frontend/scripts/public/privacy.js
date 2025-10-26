/**
 * PRIVACY.JS - Privacy Policy Page Specific JavaScript
 * Handles table of contents and section navigation
 */

(function() {
  'use strict';

  /**
   * Generate table of contents from headings
   */
  function generateTableOfContents() {
    const content = document.querySelector('.policy-content');
    const tocContainer = document.getElementById('tableOfContents');
    
    if (!content || !tocContainer) return;
    
    const headings = content.querySelectorAll('h2, h3');
    
    if (headings.length === 0) return;
    
    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';
    
    headings.forEach((heading, index) => {
      // Add ID to heading if it doesn't have one
      if (!heading.id) {
        heading.id = `section-${index}`;
      }
      
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent;
      
      // Indent h3 items
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
   * Highlight current section in table of contents
   */
  function initTocHighlight() {
    const sections = document.querySelectorAll('[id^="section-"]');
    const tocLinks = document.querySelectorAll('.toc-list a');
    
    if (sections.length === 0 || tocLinks.length === 0) return;
    
    const options = {
      threshold: 0.5,
      rootMargin: '-100px 0px -50% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          
          // Update TOC
          tocLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
              tocLinks.forEach(l => l.classList.remove('active'));
              link.classList.add('active');
            }
          });
        }
      });
    }, options);
    
    sections.forEach(section => observer.observe(section));
  }

  /**
   * Initialize last updated date
   */
  function initLastUpdated() {
    const lastUpdated = document.getElementById('lastUpdated');
    
    if (lastUpdated && !lastUpdated.textContent) {
      const date = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      lastUpdated.textContent = date;
    }
  }

  /**
   * Initialize print button
   */
  function initPrintButton() {
    const printBtn = document.getElementById('printPolicy');
    
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  /**
   * Initialize all privacy page features
   */
  function init() {
    generateTableOfContents();
    initTocHighlight();
    initLastUpdated();
    initPrintButton();
    
    console.log('Privacy page scripts loaded');
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
