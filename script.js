document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle logic
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

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
    // NEWSLETTER POPUP LOGIC
    // =========================================
    const popup = document.getElementById('newsletter-popup');
    const closeBtn = document.getElementById('close-popup');

    if (popup && closeBtn) {
        // Function to show popup
        const showPopup = () => {
            // Check session storage to ensure it only shows once per session
            if (!sessionStorage.getItem('newsletterPopupShown')) {
                popup.classList.add('width-visible');
                sessionStorage.setItem('newsletterPopupShown', 'true');
            }
        };

        // Trigger: Show after 6 seconds of engagement
        setTimeout(showPopup, 6000);

        // Close: Button Click
        closeBtn.addEventListener('click', () => {
            popup.classList.remove('width-visible');
        });

        // Close: Click Outside Card
        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.classList.remove('width-visible');
            }
        });

        // Close: Escape Key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && popup.classList.contains('width-visible')) {
                popup.classList.remove('width-visible');
            }
        });
    }
});
