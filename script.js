/**
 * ReadyWorkforce Mega Menu JavaScript
 * This file handles all the interactive functionality for the mega menu system,
 * including accessibility features, mobile responsiveness, and user interactions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const megaMenuToggle = document.getElementById('megaMenuToggle');
    const megaMenuPanel = document.getElementById('megaMenuPanel');
    const bentoClosed = document.getElementById('bentoClosed');
    const bentoHover = document.getElementById('bentoHover');
    const bentoOpen = document.getElementById('bentoOpen');
    
    // Constants
    const FOCUSABLE_SELECTORS = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const MOBILE_BREAKPOINT = 768;
    
    // State
    let lastFocusedElement = null;
    let focusTrapHandler = null;

    /**
     * Updates the bento icon state based on the specified state
     * @param {string} state - The state of the bento icon ('closed', 'hover', or 'open')
     */
    function showBento(state) {
        bentoClosed.style.display = (state === 'closed') ? '' : 'none';
        bentoHover.style.display = (state === 'hover') ? '' : 'none';
        bentoOpen.style.display = (state === 'open') ? '' : 'none';
    }

    /**
     * Updates the bento icon based on the mega menu's visibility state
     */
    function updateBentoState() {
        showBento(megaMenuPanel.classList.contains('hidden') ? 'closed' : 'open');
    }

    /**
     * Opens the mega menu and sets up focus trap
     */
    function openMegaMenu() {
        megaMenuPanel.classList.remove('hidden');
        megaMenuToggle.setAttribute('aria-expanded', 'true');
        lastFocusedElement = document.activeElement;
        trapFocus(megaMenuPanel);
        updateBentoState();
    }

    /**
     * Closes the mega menu and restores focus
     */
    function closeMegaMenu() {
        megaMenuPanel.classList.add('hidden');
        megaMenuToggle.setAttribute('aria-expanded', 'false');
        if (lastFocusedElement) lastFocusedElement.focus();
        releaseFocusTrap();
        updateBentoState();
    }

    /**
     * Implements focus trapping for accessibility
     * @param {HTMLElement} container - The container to trap focus within
     */
    function trapFocus(container) {
        const focusableEls = container.querySelectorAll(FOCUSABLE_SELECTORS);
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];

        focusTrapHandler = function(e) {
            if (e.key !== 'Tab') return;

            if (e.shiftKey && document.activeElement === firstEl) {
                e.preventDefault();
                lastEl.focus();
            } else if (!e.shiftKey && document.activeElement === lastEl) {
                e.preventDefault();
                firstEl.focus();
            }
        };

        container.addEventListener('keydown', focusTrapHandler);
        setTimeout(() => firstEl && firstEl.focus(), 10);
    }

    /**
     * Removes the focus trap event listener
     */
    function releaseFocusTrap() {
        if (focusTrapHandler) {
            megaMenuPanel.removeEventListener('keydown', focusTrapHandler);
            focusTrapHandler = null;
        }
    }

    // Event Listeners
    
    // Toggle menu on click
    megaMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        megaMenuPanel.classList.contains('hidden') ? openMegaMenu() : closeMegaMenu();
    });

    // Bento icon hover effects
    megaMenuToggle.addEventListener('mouseenter', () => {
        if (megaMenuPanel.classList.contains('hidden')) {
            showBento('hover');
        }
    });

    megaMenuToggle.addEventListener('mouseleave', updateBentoState);

    // Close menu with Escape key
    megaMenuPanel.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMegaMenu();
        }
    });

    // Close menu when clicking outside
    window.addEventListener('mousedown', (e) => {
        if (!megaMenuPanel.classList.contains('hidden') && 
            !megaMenuPanel.contains(e.target) && 
            !megaMenuToggle.contains(e.target)) {
            closeMegaMenu();
        }
    });

    // Mobile Menu Functionality
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        const megaPanel = item.querySelector('.mega-panel');
        if (!megaPanel) return;

        // Desktop hover effects
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth > MOBILE_BREAKPOINT) {
                megaPanel.style.display = 'block';
            }
        });

        item.addEventListener('mouseleave', () => {
            if (window.innerWidth > MOBILE_BREAKPOINT) {
                megaPanel.style.display = 'none';
            }
        });

        // Mobile click effects
        item.addEventListener('click', (e) => {
            if (window.innerWidth <= MOBILE_BREAKPOINT) {
                e.preventDefault();
                megaPanel.classList.toggle('active');
            }
        });
    });

    // Close mega panels when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= MOBILE_BREAKPOINT) {
            menuItems.forEach(item => {
                const megaPanel = item.querySelector('.mega-panel');
                if (megaPanel && !item.contains(e.target)) {
                    megaPanel.classList.remove('active');
                }
            });
        }
    });

    // Initialize bento state
    updateBentoState();
});
