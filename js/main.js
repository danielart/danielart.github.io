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
    initCarousels();
    initLanguageSwitcher();
    initFooterYear();
    initCodeCopy();
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
    }, { passive: true });
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

    let ticking = false;

    // Show/hide button on scroll (throttled with rAF)
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (window.scrollY > 500) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // Scroll to top on click
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        // Return focus to top/logo for accessibility
        const logo = document.querySelector('.nav-logo');
        if (logo) {
            logo.focus({ preventScroll: true });
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
   Blog Filters
   -------------------------------------------------------------------------- */
function initBlogFilters() {
    const filterBtns = document.querySelectorAll('.blog-filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add to clicked
            btn.classList.add('active');

            // Trigger UI update to re-filter based on current language and new filter
            const currentLang = localStorage.getItem('lang') || 'en';
            updateLanguageUI(currentLang);
        });
    });
}

/* --------------------------------------------------------------------------
   Language Switcher
   -------------------------------------------------------------------------- */
function initLanguageSwitcher() {
    const switcher = document.querySelector('.language-switcher');
    if (!switcher) return;

    const langBtns = switcher.querySelectorAll('.lang-btn');
    
    // Initial language setup
    const savedLang = localStorage.getItem('lang') || 'en';
    updateLanguageUI(savedLang);

    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            localStorage.setItem('lang', lang);
            updateLanguageUI(lang);
        });
    });
}

function updateLanguageUI(lang) {
    // 1. Update Switcher active state
    document.querySelectorAll('.language-switcher .lang-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });

    // 2. Filter blog posts (only by language now)
    const currentFilter = 'all';

    document.querySelectorAll('.blog-post-card').forEach(post => {
        const postLang = post.getAttribute('data-lang');
        const postTags = (post.getAttribute('data-tags') || '').split(',').map(t => t.trim());

        const matchesLang = postLang === lang || !postLang;
        const matchesFilter = currentFilter === 'all' || postTags.includes(currentFilter);

        if (matchesLang && matchesFilter) {
            post.style.display = '';
            requestAnimationFrame(() => {
                post.style.opacity = '1';
                post.style.transform = 'translateY(0)';
            });
        } else {
            post.style.opacity = '0';
            post.style.transform = 'translateY(20px)';
            // Use transitionend to hide after animation completes
            const onTransitionEnd = () => {
                // Re-check if it should still be hidden at the time the transition ends
                const currentLang = localStorage.getItem('lang') || 'en';
                const activeFilterValue = 'all';
                const stillMatchesLang = postLang === currentLang || !postLang;
                const stillMatchesFilter = activeFilterValue === 'all' || postTags.includes(activeFilterValue);
                if (!(stillMatchesLang && stillMatchesFilter)) {
                    post.style.display = 'none';
                }
                post.removeEventListener('transitionend', onTransitionEnd);
            };
            post.addEventListener('transitionend', onTransitionEnd, { once: true });
        }
    });

    // 3. Update UI Strings
    const texts = {
        en: {
            blogTitle: 'Engineering Blog',
            blogDesc: 'Thoughts on AI, Web Development, and Engineering Leadership.',
            filterAll: 'All',
            filterAI: 'AI & Agents',
            filterWeb: 'Web Dev',
            filterLeadership: 'Leadership',
            contactHeading: 'How I can help you',
            service1Title: 'AI Advisor & Consultant',
            service1Desc: 'Strategy, architecture, and integrating AI into workflows.',
            service2Title: 'Custom AI Agents & Automation',
            service2Desc: 'Building specialized agents and orchestrating systems (Mastra, n8n).',
            contactConnectHeading: 'Let\'s connect',
            contactDesc: 'Interested in Brisa, AI agents, or modern web architecture?',
            followMeText: 'Follow me on:',
            statusText: 'System Status: Available for projects',
            sayHelloBtn: 'Say Hello <i class="fas fa-paper-plane" aria-hidden="true"></i>'
        },
        es: {
            blogTitle: 'Blog de Ingeniería',
            blogDesc: 'Reflexiones sobre IA, Desarrollo Web y Liderazgo de Ingeniería.',
            filterAll: 'Todos',
            filterAI: 'IA y Agentes',
            filterWeb: 'Desarrollo Web',
            filterLeadership: 'Liderazgo',
            contactHeading: 'Cómo puedo ayudarte',
            service1Title: 'Asesor y Consultor de IA',
            service1Desc: 'Estrategia, arquitectura e integración de IA en flujos de trabajo.',
            service2Title: 'Agentes de IA a medida y Automatización',
            service2Desc: 'Creación de agentes especializados y orquestación de sistemas (Mastra, n8n).',
            contactConnectHeading: 'Conectemos',
            contactDesc: '¿Interesado en Brisa, agentes de IA o arquitectura web moderna?',
            followMeText: 'Sígueme en:',
            statusText: 'Estado del sistema: Disponible para proyectos',
            sayHelloBtn: 'Di Hola <i class="fas fa-paper-plane" aria-hidden="true"></i>'
        }
    };

    const strings = texts[lang];
    if (!strings) return;

    const title = document.querySelector('.blog-header h1');
    if (title) title.innerHTML = `<i class="fab fa-dev"></i> ${strings.blogTitle}`;
    
    const desc = document.querySelector('.blog-header p');
    if (desc) desc.textContent = strings.blogDesc;



    // Update Contact Section Strings if they exist on the page
    const el = (id) => document.getElementById(id);
    if(el('contact-heading')) el('contact-heading').textContent = strings.contactHeading;
    if(el('service-1-title')) el('service-1-title').textContent = strings.service1Title;
    if(el('service-1-desc')) el('service-1-desc').textContent = strings.service1Desc;
    if(el('service-2-title')) el('service-2-title').textContent = strings.service2Title;
    if(el('service-2-desc')) el('service-2-desc').textContent = strings.service2Desc;
    if(el('contact-connect-heading')) el('contact-connect-heading').textContent = strings.contactConnectHeading;
    if(el('contact-desc')) el('contact-desc').textContent = strings.contactDesc;
    if(el('follow-me-text')) el('follow-me-text').textContent = strings.followMeText;
    if(el('status-text')) el('status-text').textContent = strings.statusText;
    if(el('say-hello-btn')) el('say-hello-btn').innerHTML = strings.sayHelloBtn;
}

/* --------------------------------------------------------------------------
   Carousel Navigation
   -------------------------------------------------------------------------- */
function initCarousels() {
    const carousels = document.querySelectorAll('.blog-carousel');
    
    carousels.forEach(carousel => {
        const container = carousel.querySelector('.carousel-container');
        const slides = carousel.querySelectorAll('.carousel-slide');
        
        if (!container || !slides.length) return;
        
        const controls = document.createElement('div');
        controls.className = 'carousel-controls';
        
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                container.scrollTo({
                    left: container.offsetWidth * index,
                    behavior: 'smooth'
                });
            });
            controls.appendChild(dot);
        });
        
        carousel.appendChild(controls);
        
        container.addEventListener('scroll', () => {
            const index = Math.round(container.scrollLeft / container.offsetWidth);
            const dots = controls.querySelectorAll('.carousel-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }, { passive: true });
    });
}

/* --------------------------------------------------------------------------
   Dynamic Footer Year
   -------------------------------------------------------------------------- */
function initFooterYear() {
    const yearSpans = document.querySelectorAll('.current-year');
    const currentYear = new Date().getFullYear();
    yearSpans.forEach(span => {
        span.textContent = currentYear;
    });
}

/**
 * Copy to Clipboard functionality for code blocks
 */
function initCodeCopy() {
    const copyBtns = document.querySelectorAll('.copy-code-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation(); // Prevent toggling <details>

            const details = btn.closest('.collapsible-code');
            const code = details.querySelector('code');
            
            if (!code) return;

            try {
                await navigator.clipboard.writeText(code.textContent);
                
                // Visual feedback
                const icon = btn.querySelector('i');
                const originalClass = icon.className;
                
                btn.classList.add('copied');
                icon.className = 'fas fa-check';
                
                setTimeout(() => {
                    btn.classList.remove('copied');
                    icon.className = originalClass;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        });
    });
}
