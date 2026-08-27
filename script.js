document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle logic
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay && mobileMenu) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    if (mobileMenu && navLinks) {
        const toggleMenu = () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
            overlay.classList.toggle('active');
            body.style.overflow = body.style.overflow === 'hidden' ? '' : 'hidden';
        };

        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            body.style.overflow = '';
        };

        mobileMenu.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', closeMenu);

        // Close menu only when a real page link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            const href = link.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('javascript:')) {
                link.addEventListener('click', closeMenu);
            }
        });

        // Dropdown toggle on click/touch for mobile & desktop support
        document.querySelectorAll('.dropdown > a').forEach(dropTrigger => {
            dropTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                const parent = dropTrigger.parentElement;
                parent.classList.toggle('open');
            });
        });
    }

    // =========================================
    // ACTIVE LINK HIGHLIGHTING LOGIC
    // =========================================
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allNavLinks = document.querySelectorAll('.nav-links a, .logo');

    allNavLinks.forEach(link => {
        const linkPath = link.getAttribute('href');
        // Handle home page case
        if ((currentPath === 'index.html' || currentPath === '') && (linkPath === '/' || linkPath === 'index.html')) {
            link.classList.add('active');
        } else if (linkPath && currentPath.includes(linkPath) && linkPath !== '/') {
            link.classList.add('active');
        }
    });

    // =========================================
    // FAQ ACCORDION LOGIC
    // =========================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;

            // Optional: Close other items
            // document.querySelectorAll('.faq-item').forEach(otherItem => {
            //     if (otherItem !== item) otherItem.classList.remove('active');
            // });

            item.classList.toggle('active');
        });
    });

    // =========================================
    // STAT NUMBER ANIMATION LOGIC
    // =========================================
    const animateStats = () => {
        const stats = document.querySelectorAll('.stat-number');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseFloat(el.getAttribute('data-target'));
                    const prefix = el.getAttribute('data-prefix') || '';
                    const suffix = el.getAttribute('data-suffix') || '';
                    const decimals = parseInt(el.getAttribute('data-decimals')) || 0;
                    const duration = 2000; // 2 seconds
                    const startTime = performance.now();

                    const updateCount = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Ease out cubic
                        const easeProgress = 1 - Math.pow(1 - progress, 3);
                        
                        const currentCount = easeProgress * target;
                        el.textContent = prefix + currentCount.toFixed(decimals) + suffix;

                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            el.textContent = prefix + target.toFixed(decimals) + suffix;
                        }
                    };

                    requestAnimationFrame(updateCount);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.1 });

        stats.forEach(stat => observer.observe(stat));
    };

    animateStats();

    // =========================================
    // SCROLL TO TOP BUTTON (Dynamic Injection)
    // =========================================
    const createScrollToTopButton = () => {
        const btn = document.createElement('button');
        btn.id = 'scroll-to-top';
        btn.className = 'scroll-to-top';
        btn.setAttribute('aria-label', 'Retour en haut');
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><polyline points="18 15 12 9 6 15"></polyline></svg>';
        document.body.appendChild(btn);

        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // =========================================
    // SERVICES CAROUSEL LOGIC
    // =========================================
    const initServicesCarousel = () => {
        const servicesTrack = document.getElementById('services-carousel-track');
        const servicesPrevBtn = document.getElementById('services-carousel-prev');
        const servicesNextBtn = document.getElementById('services-carousel-next');
        const servicesDotsContainer = document.getElementById('services-carousel-dots');
        const servicesItems = Array.from(document.querySelectorAll('.services-carousel-item'));

        if (!servicesTrack || servicesItems.length === 0) return;

        let currentServicesIndex = 0;

        const getVisibleCount = () => {
            if (window.innerWidth <= 680) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        };

        const getMaxIndex = () => {
            const visible = getVisibleCount();
            return Math.max(0, servicesItems.length - visible);
        };

        const updateDots = () => {
            if (!servicesDotsContainer) return;
            servicesDotsContainer.innerHTML = '';
            const maxIdx = getMaxIndex();
            const totalSteps = maxIdx + 1;

            if (totalSteps <= 1) {
                servicesDotsContainer.style.display = 'none';
                if (servicesPrevBtn) servicesPrevBtn.style.display = 'none';
                if (servicesNextBtn) servicesNextBtn.style.display = 'none';
                return;
            } else {
                servicesDotsContainer.style.display = 'flex';
                if (servicesPrevBtn) servicesPrevBtn.style.display = 'flex';
                if (servicesNextBtn) servicesNextBtn.style.display = 'flex';
            }

            for (let i = 0; i <= maxIdx; i++) {
                const dot = document.createElement('div');
                dot.className = 'carousel-dot' + (i === currentServicesIndex ? ' active' : '');
                dot.addEventListener('click', () => {
                    currentServicesIndex = i;
                    updateCarouselPosition();
                });
                servicesDotsContainer.appendChild(dot);
            }
        };

        const updateCarouselPosition = () => {
            const maxIdx = getMaxIndex();
            if (currentServicesIndex > maxIdx) currentServicesIndex = maxIdx;
            if (currentServicesIndex < 0) currentServicesIndex = 0;

            const itemWidth = servicesItems[0].getBoundingClientRect().width;
            const gap = 28;
            const offset = currentServicesIndex * (itemWidth + gap);
            servicesTrack.style.transform = `translateX(-${offset}px)`;

            if (servicesPrevBtn) servicesPrevBtn.disabled = currentServicesIndex === 0;
            if (servicesNextBtn) servicesNextBtn.disabled = currentServicesIndex >= maxIdx;

            if (servicesDotsContainer) {
                const dots = servicesDotsContainer.querySelectorAll('.carousel-dot');
                dots.forEach((dot, idx) => {
                    dot.classList.toggle('active', idx === currentServicesIndex);
                });
            }
        };

        if (servicesPrevBtn) {
            servicesPrevBtn.addEventListener('click', () => {
                if (currentServicesIndex > 0) {
                    currentServicesIndex--;
                    updateCarouselPosition();
                }
            });
        }

        if (servicesNextBtn) {
            servicesNextBtn.addEventListener('click', () => {
                const maxIdx = getMaxIndex();
                if (currentServicesIndex < maxIdx) {
                    currentServicesIndex++;
                    updateCarouselPosition();
                }
            });
        }

        window.addEventListener('resize', () => {
            updateDots();
            updateCarouselPosition();
        });

        // Initialize position and pagination dots
        updateDots();
        updateCarouselPosition();
    };

    createScrollToTopButton();
    initServicesCarousel();

});

