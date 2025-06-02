document.addEventListener('DOMContentLoaded', () => {
    // Mega menu toggle logic with animation, accessibility, and icon update
    const megaMenuToggle = document.getElementById('megaMenuToggle');
    const megaMenuPanel = document.getElementById('megaMenuPanel');
    const bentoClosed = document.getElementById('bentoClosed');
    const bentoHover = document.getElementById('bentoHover');
    const bentoOpen = document.getElementById('bentoOpen');
    const focusableSelectors = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';
    let lastFocusedElement = null;

    // --- All logic below uses these variables only ---

    function showBento(state) {
        bentoClosed.style.display = (state === 'closed') ? '' : 'none';
        bentoHover.style.display = (state === 'hover') ? '' : 'none';
        bentoOpen.style.display = (state === 'open') ? '' : 'none';
    }
    function updateBentoState() {
        if (megaMenuPanel.classList.contains('hidden')) {
            showBento('closed');
        } else {
            showBento('open');
        }
    }
    // Initial icon state
    updateBentoState();

    function openMegaMenu() {
        megaMenuPanel.classList.remove('hidden');
        megaMenuToggle.setAttribute('aria-expanded', 'true');
        lastFocusedElement = document.activeElement;
        // Trap focus inside the menu
        trapFocus(megaMenuPanel);
        updateBentoState();
    }

    function closeMegaMenu() {
        megaMenuPanel.classList.add('hidden');
        megaMenuToggle.setAttribute('aria-expanded', 'false');
        // Restore focus to last focused element
        if (lastFocusedElement) lastFocusedElement.focus();
        releaseFocusTrap();
        updateBentoState();
    }

    megaMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Prevent bubbling to window/document
        if (megaMenuPanel.classList.contains('hidden')) {
            openMegaMenu();
        } else {
            closeMegaMenu();
        }
    });

    megaMenuToggle.addEventListener('mouseenter', () => {
        if (megaMenuPanel.classList.contains('hidden')) {
            showBento('hover');
        }
    });
    megaMenuToggle.addEventListener('mouseleave', () => {
        updateBentoState();
    });

    // Accessibility: close menu with Escape
    megaMenuPanel.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMegaMenu();
        }
    });

    // Focus trap implementation
    let focusTrapHandler = null;
    function trapFocus(container) {
        const focusableEls = container.querySelectorAll(focusableSelectors);
        const firstEl = focusableEls[0];
        const lastEl = focusableEls[focusableEls.length - 1];
        focusTrapHandler = function(e) {
            if (e.key !== 'Tab') return;
            if (e.shiftKey) {
                if (document.activeElement === firstEl) {
                    e.preventDefault();
                    lastEl.focus();
                }
            } else {
                if (document.activeElement === lastEl) {
                    e.preventDefault();
                    firstEl.focus();
                }
            }
        };
        container.addEventListener('keydown', focusTrapHandler);
        document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const menuList = document.querySelector('.menu-list');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuList.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Mega menu hover functionality
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        if (item.classList.contains('has-submenu')) {
            const megaPanel = item.querySelector('.mega-panel');
            
            item.addEventListener('mouseenter', () => {
                megaPanel.style.display = 'block';
            });

            item.addEventListener('mouseleave', () => {
                megaPanel.style.display = 'none';
            });
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuList.contains(e.target) && !menuToggle.contains(e.target)) {
            menuList.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
});
        setTimeout(() => firstEl && firstEl.focus(), 10);
    }
    function releaseFocusTrap() {
        if (focusTrapHandler) {
            megaMenuPanel.removeEventListener('keydown', focusTrapHandler);
            focusTrapHandler = null;
        }
    }

    // Optional: close menu when clicking outside
    window.addEventListener('mousedown', function(e) {
        // Don't close if clicking the toggle button or any of its children (the bento icons)
        if (!megaMenuPanel.classList.contains('hidden') && !megaMenuPanel.contains(e.target) && !megaMenuToggle.contains(e.target)) {
            closeMegaMenu();
        }
    });



    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const menuItems = document.querySelector('.menu-items');

    menuToggle.addEventListener('click', () => {
        menuItems.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !menuItems.contains(e.target)) {
            menuItems.classList.remove('active');
        }
    });

    // Mega menu hover effects
    const menuItemsList = document.querySelectorAll('.menu-item');

    menuItemsList.forEach(item => {
        const megaPanel = item.querySelector('.mega-panel');
        
        // Desktop hover effect
        item.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                megaPanel.style.display = 'block';
            }
        });

        item.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) {
                megaPanel.style.display = 'none';
            }
        });

        // Mobile click effect
        item.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                megaPanel.classList.toggle('active');
            }
        });
    });

    // Close mega panel when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            menuItemsList.forEach(item => {
                const megaPanel = item.querySelector('.mega-panel');
                if (megaPanel && !item.contains(e.target)) {
                    megaPanel.classList.remove('active');
                }
            });
        }
    });
});
