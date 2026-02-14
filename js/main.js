/**
 * Main JavaScript - Animations & Interactions
 * Portfolio site for Daniel Artola
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initScrollReveal();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initTypingEffect();
    initBackToTop();
    initBlogFilters();
    // initCardTilt is optional and unused in the current DOM structure
});

/* --------------------------------------------------------------------------
   Theme Toggle
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Get saved theme or use system preference
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme || (prefersDark.matches ? 'dark' : 'light');

    setTheme(initialTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Listen for system theme changes
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

/* --------------------------------------------------------------------------
   Scroll Reveal Animation
   -------------------------------------------------------------------------- */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if (!reveals.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    reveals.forEach(el => observer.observe(el));
}

/* --------------------------------------------------------------------------
   Navbar Scroll Effect
   -------------------------------------------------------------------------- */
function initNavbar() {
    const navbar = document.querySelector('.navbar');

    if (!navbar) return;

    let ticking = false;

    // Optimized scroll listener using requestAnimationFrame to reduce main thread blocking
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const currentScroll = window.scrollY;

                if (currentScroll > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
                ticking = false;
            });

            ticking = true;
        }
    });
}

/* --------------------------------------------------------------------------
   Mobile Menu
   -------------------------------------------------------------------------- */
function initMobileMenu() {
    const toggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
}

/* --------------------------------------------------------------------------
   Back to Top
   -------------------------------------------------------------------------- */
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');

    if (!backToTopBtn) return;

    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Return focus to top/logo for accessibility
        const logo = document.querySelector('.nav-logo');
        if (logo) {
            logo.focus({ preventScroll: true }); // preventScroll because we're already scrolling
        }
    });
}

/* --------------------------------------------------------------------------
   Smooth Scroll
   -------------------------------------------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* --------------------------------------------------------------------------
   Typing Effect
   -------------------------------------------------------------------------- */
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');

    if (!typingElement) return;

    const text = typingElement.getAttribute('data-text') || typingElement.textContent;
    typingElement.textContent = '';

    let i = 0;
    const speed = 80;

    function type() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    // Start typing after a short delay
    setTimeout(type, 500);
}

/* --------------------------------------------------------------------------
   Card Tilt Effect (Optional - Enhanced Interactivity)
   -------------------------------------------------------------------------- */
function initCardTilt() {
    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        let ticking = false;
        let animationFrameId;

        card.addEventListener('mousemove', (e) => {
            if (!ticking) {
                animationFrameId = window.requestAnimationFrame(() => {
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;

                    const rotateX = (y - centerY) / 20;
                    const rotateY = (centerX - x) / 20;

                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                    ticking = false;
                });

                ticking = true;
            }
        });

        card.addEventListener('mouseleave', () => {
            if (ticking) {
                window.cancelAnimationFrame(animationFrameId);
                ticking = false;
            }
            card.style.transform = '';
        });
    });
}

/* --------------------------------------------------------------------------
   Blog Filters
   -------------------------------------------------------------------------- */
function initBlogFilters() {
    const filterBtns = document.querySelectorAll('.blog-filter-btn');
    const posts = document.querySelectorAll('.blog-post-card');

    if (!filterBtns.length || !posts.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            posts.forEach(post => {
                const tags = (post.getAttribute('data-tags') || '').split(',');

                let shouldShow = false;
                if (filterValue === 'all') {
                    shouldShow = true;
                } else {
                    shouldShow = tags.includes(filterValue);
                }

                if (shouldShow) {
                    post.style.display = ''; // grid items are usually block/flex, glass-card is flex column
                    // Use setTimeout to allow display to apply before opacity transition
                    setTimeout(() => {
                        post.style.opacity = '1';
                        post.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    post.style.opacity = '0';
                    post.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        post.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}
