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
    const FOCUSABLE_SELECTORS = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const KEYCODES = {
        ESCAPE: 'Escape',
        TAB: 'Tab',
        ENTER: 'Enter',
        SPACE: ' ',
        ARROW_UP: 'ArrowUp',
        ARROW_DOWN: 'ArrowDown',
        ARROW_LEFT: 'ArrowLeft',
        ARROW_RIGHT: 'ArrowRight',
        HOME: 'Home',
        END: 'End'
    };
    
    // State
    let lastFocusedElement = null;
    let focusTrapHandler = null;
    let currentFocusIndex = -1;
    let focusableElements = [];

    /**
     * Updates the list of focusable elements within the mega menu
     */
    function updateFocusableElements() {
        focusableElements = Array.from(megaMenuPanel.querySelectorAll(FOCUSABLE_SELECTORS))
            .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
    }

    /**
     * Handles keyboard navigation within the mega menu
     * @param {KeyboardEvent} e - The keyboard event
     */
    function handleKeyboardNavigation(e) {
        if (!megaMenuPanel.classList.contains('hidden')) {
            switch (e.key) {
                case KEYCODES.ARROW_RIGHT:
                    e.preventDefault();
                    navigateCards(1);
                    break;
                case KEYCODES.ARROW_LEFT:
                    e.preventDefault();
                    navigateCards(-1);
                    break;
                case KEYCODES.ARROW_DOWN:
                    e.preventDefault();
                    navigateCards(3); // Assuming 3 cards per row
                    break;
                case KEYCODES.ARROW_UP:
                    e.preventDefault();
                    navigateCards(-3); // Assuming 3 cards per row
                    break;
                case KEYCODES.HOME:
                    e.preventDefault();
                    navigateToIndex(0);
                    break;
                case KEYCODES.END:
                    e.preventDefault();
                    navigateToIndex(focusableElements.length - 1);
                    break;
            }
        }
    }

    /**
     * Navigates through cards by a specified offset
     * @param {number} offset - The number of positions to move
     */
    function navigateCards(offset) {
        updateFocusableElements();
        if (focusableElements.length === 0) return;

        if (currentFocusIndex === -1) {
            currentFocusIndex = 0;
        } else {
            currentFocusIndex = (currentFocusIndex + offset + focusableElements.length) % focusableElements.length;
        }

        focusableElements[currentFocusIndex].focus();
    }

    /**
     * Navigates to a specific index
     * @param {number} index - The index to navigate to
     */
    function navigateToIndex(index) {
        updateFocusableElements();
        if (focusableElements.length === 0) return;

        currentFocusIndex = Math.max(0, Math.min(index, focusableElements.length - 1));
        focusableElements[currentFocusIndex].focus();
    }

    /**
     * Updates the bento icon state
     * @param {string} state - The state of the bento icon ('closed', 'hover', or 'open')
     */
    function showBento(state) {
        bentoClosed.style.display = (state === 'closed') ? '' : 'none';
        bentoHover.style.display = (state === 'hover') ? '' : 'none';
        bentoOpen.style.display = (state === 'open') ? '' : 'none';
    }

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
        
        // Update ARIA states
        megaMenuPanel.setAttribute('aria-hidden', 'false');
        
        // Set up focus management
        updateFocusableElements();
        trapFocus(megaMenuPanel);
        
        // Focus the first focusable element
        if (focusableElements.length > 0) {
            currentFocusIndex = 0;
            focusableElements[0].focus();
        }
        
        updateBentoState();
    }

    /**
     * Closes the mega menu and restores focus
     */
    function closeMegaMenu() {
        megaMenuPanel.classList.add('hidden');
        megaMenuToggle.setAttribute('aria-expanded', 'false');
        
        // Update ARIA states
        megaMenuPanel.setAttribute('aria-hidden', 'true');
        
        // Restore focus
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
        
        releaseFocusTrap();
        currentFocusIndex = -1;
        updateBentoState();
    }

    /**
     * Implements focus trapping for accessibility
     * @param {HTMLElement} container - The container to trap focus within
     */
    function trapFocus(container) {
        updateFocusableElements();
        
        focusTrapHandler = function(e) {
            if (e.key === KEYCODES.TAB) {
                const firstEl = focusableElements[0];
                const lastEl = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                } else if (!e.shiftKey && document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        };

        container.addEventListener('keydown', focusTrapHandler);
    }

    /**
     * Removes the focus trap
     */
    function releaseFocusTrap() {
        if (focusTrapHandler) {
            megaMenuPanel.removeEventListener('keydown', focusTrapHandler);
            focusTrapHandler = null;
        }
    }

    // Event Listeners
    megaMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        megaMenuPanel.classList.contains('hidden') ? openMegaMenu() : closeMegaMenu();
    });

    // Toggle menu with Enter or Space
    megaMenuToggle.addEventListener('keydown', (e) => {
        if (e.key === KEYCODES.ENTER || e.key === KEYCODES.SPACE) {
            e.preventDefault();
            megaMenuPanel.classList.contains('hidden') ? openMegaMenu() : closeMegaMenu();
        }
    });

    // Bento icon hover effects
    megaMenuToggle.addEventListener('mouseenter', () => {
        if (megaMenuPanel.classList.contains('hidden')) {
            showBento('hover');
        }
    });

    megaMenuToggle.addEventListener('mouseleave', updateBentoState);

    // Close menu with Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === KEYCODES.ESCAPE && !megaMenuPanel.classList.contains('hidden')) {
            closeMegaMenu();
        }
    });

    // Handle keyboard navigation
    megaMenuPanel.addEventListener('keydown', handleKeyboardNavigation);

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

    // Initialize states
    updateBentoState();
    megaMenuPanel.setAttribute('aria-hidden', 'true');
});
