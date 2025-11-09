/**
 * Admin Theme Manager
 * Handles theme switching and persistence
 *
 * FEATURES:
 * - Light/Dark theme toggle (prepared for future use)
 * - Theme persistence in localStorage
 * - CSS variable updates
 */

class AdminTheme {
    constructor() {
        this.themeName = 'light';
        this.initTheme();
    }

    /**
     * Initialize theme from localStorage or use default
     */
    initTheme() {
        const savedTheme = localStorage.getItem('trekka_admin_theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            this.setTheme('light');
        }
    }

    /**
     * Set active theme
     * @param {string} theme - Theme name (light, dark, etc.)
     */
    setTheme(theme) {
        this.themeName = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('trekka_admin_theme', theme);
        this.applyThemeVariables();
    }

    /**
     * Apply CSS variables for active theme
     * Extend this function to support more themes
     */
    applyThemeVariables() {
        const root = document.documentElement;

        if (this.themeName === 'dark') {
            // Dark theme variables (prepared for implementation)
            root.style.setProperty('--color-secondary', '#1e1e1e');
            root.style.setProperty('--color-text-dark', '#e0e0e0');
            root.style.setProperty('--color-text-light', '#b0b0b0');
            root.style.setProperty('--color-border', '#404040');
        } else {
            // Light theme (default)
            root.style.setProperty('--color-secondary', '#F5F5F5');
            root.style.setProperty('--color-text-dark', '#212529');
            root.style.setProperty('--color-text-light', '#6C757D');
            root.style.setProperty('--color-border', '#DEE2E6');
        }
    }

    /**
     * Toggle between themes
     */
    toggleTheme() {
        const newTheme = this.themeName === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    /**
     * Get current theme
     * @returns {string} Current theme name
     */
    getCurrentTheme() {
        return this.themeName;
    }
}

// Initialize theme on page load
const adminTheme = new AdminTheme();

/**
 * PUBLIC API
 * Usage in HTML: onclick="adminTheme.toggleTheme()"
 */
window.adminTheme = adminTheme;
