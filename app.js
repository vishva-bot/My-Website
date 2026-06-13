document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE DRAWER MENU
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const mobileDrawer = document.querySelector('.mobile-drawer');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function toggleMenu() {
        const isOpen = mobileDrawer.classList.contains('open');
        mobileDrawer.classList.toggle('open');
        mobileToggle.setAttribute('aria-expanded', !isOpen);
        // Toggle scroll locking on body
        document.body.style.overflow = isOpen ? '' : 'hidden';
    }

    mobileToggle.addEventListener('click', toggleMenu);

    drawerLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileDrawer.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // Close drawer menu if screen is resized beyond mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileDrawer.classList.contains('open')) {
            toggleMenu();
        }
    });

    /* ==========================================================================
       LIGHT/DARK THEME TOGGLE
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Check local storage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    // Apply theme on load
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    themeToggle.addEventListener('click', () => {
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
        currentTheme = nextTheme;
        updateThemeIcon(nextTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-sun';
        } else {
            themeIcon.className = 'fa-solid fa-moon';
        }
    }

    /* ==========================================================================
       TYPING TEXT EFFECT
       ========================================================================== */
    const typedTextEl = document.getElementById('typed-text');
    const words = ["Full Stack Developer", "Creative Designer", "Problem Solver"];
    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentWord = words[wordIdx];
        
        if (isDeleting) {
            typedTextEl.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // Faster deleting speed
        } else {
            typedTextEl.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100; // Normal typing speed
        }

        // Handle word completion or deletion completion
        if (!isDeleting && charIdx === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500; // Pause at end of word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (typedTextEl) {
        typeEffect();
    }

    /* ==========================================================================
       SCROLL-REVEAL & HEADER HIGHLIGHT OBSERVER
       ========================================================================== */
    // Scroll reveal fade-ins
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Active Section Link Highlight in Navbar
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-80px 0px 0px 0px'
    });

    sections.forEach(sec => navObserver.observe(sec));

    /* ==========================================================================
       PROJECT CATEGORY FILTER
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active status from other buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Animate filter change using CSS opacity & scale
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    /* ==========================================================================
       CONTACT FORM VALIDATION & INTERACTIVE STATE
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const successAlert = document.getElementById('form-success');
    
    // Regular expression for basic email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function validateField(inputEl) {
        const value = inputEl.value.trim();
        const formGroup = inputEl.parentElement;
        let isValid = true;

        if (value === '') {
            isValid = false;
        } else if (inputEl.type === 'email' && !emailRegex.test(value)) {
            isValid = false;
        }

        if (isValid) {
            formGroup.classList.remove('invalid');
        } else {
            formGroup.classList.add('invalid');
        }

        return isValid;
    }

    if (contactForm) {
        // Add real-time visual feedback on typing/blur
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.parentElement.classList.contains('invalid')) {
                    validateField(input);
                }
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isFormValid = true;
            inputs.forEach(input => {
                const isValid = validateField(input);
                if (!isValid) isFormValid = false;
            });

            if (isFormValid) {
                // Submit Form Animation State
                const submitBtn = contactForm.querySelector('.btn-submit');
                const originalText = submitBtn.querySelector('span').textContent;
                
                submitBtn.disabled = true;
                submitBtn.querySelector('span').textContent = 'Sending...';
                submitBtn.querySelector('i').className = 'fa-solid fa-spinner fa-spin';

                // Simulate brief API call latency (1.5 seconds)
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.disabled = false;
                    submitBtn.querySelector('span').textContent = originalText;
                    submitBtn.querySelector('i').className = 'fa-solid fa-paper-plane';
                    
                    // Show custom beautiful success overlay screen
                    successAlert.classList.add('show');
                    
                    // Auto-hide success screen after 5 seconds
                    setTimeout(() => {
                        successAlert.classList.remove('show');
                    }, 5000);
                }, 1500);
            }
        });
    }
});
