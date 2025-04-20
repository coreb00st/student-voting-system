document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelector('.nav-links');
    const loginBtn = document.querySelector('.login-btn');
    const body = document.body;
    let lastScrollPosition = window.pageYOffset;

    // Check if user is logged in
    const userSession = JSON.parse(localStorage.getItem('user_session'));
    
    if (userSession) {
        // Update navigation for logged-in users
        loginBtn.textContent = 'Profile';
        loginBtn.href = 'Profile.html';
        
        // Add Elections link
        const electionsLink = document.createElement('a');
        electionsLink.href = 'Election.html';
        electionsLink.textContent = 'Elections';
        navLinks.insertBefore(electionsLink, loginBtn);
    }

    // Handle navbar visibility on scroll
    function handleNavbarVisibility() {
        const currentScrollPosition = window.pageYOffset;
        const navbar = document.querySelector('.header');
        
        if (currentScrollPosition > lastScrollPosition && currentScrollPosition > 60) {
            navbar.classList.add('nav-hidden');
        } else {
            navbar.classList.remove('nav-hidden');
        }
        
        lastScrollPosition = currentScrollPosition;
    }

    window.addEventListener('scroll', handleNavbarVisibility);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle register button click
    const registerBtn = document.querySelector('.btn-primary');
    if (userSession && registerBtn) {
        registerBtn.textContent = 'Go to Profile';
        registerBtn.href = 'Profile.html';
    }
});