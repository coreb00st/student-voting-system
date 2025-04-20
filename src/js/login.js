document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const loginButton = document.querySelector('.login-button');

    // Check if already logged in
    const userSession = JSON.parse(localStorage.getItem('user_session'));
    if (userSession) {
        window.location.href = 'Profile.html';
        return;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showError(element, message) {
        element.textContent = message;
        element.style.display = 'block';
    }

    function clearError(element) {
        element.textContent = '';
        element.style.display = 'none';
    }

    // Fixed Password toggle functionality
    togglePasswordBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePasswordBtn.textContent = type === 'password' ? 'Show' : 'Hide';
    });

    emailInput.addEventListener('input', () => {
        if (validateEmail(emailInput.value)) {
            clearError(emailError);
            emailInput.classList.remove('error');
        } else {
            showError(emailError, 'Please enter a valid email address');
            emailInput.classList.add('error');
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.length >= 8) {
            clearError(passwordError);
            passwordInput.classList.remove('error');
        } else {
            showError(passwordError, 'Password must be at least 8 characters long');
            passwordInput.classList.add('error');
        }
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = emailInput.value;
        const password = passwordInput.value;

        // Validate inputs
        if (!validateEmail(email)) {
            showError(emailError, 'Please enter a valid email address');
            return;
        }

        if (password.length < 8) {
            showError(passwordError, 'Password must be at least 8 characters long');
            return;
        }

        try {
            // Show loading state
            loginButton.classList.add('loading');
            loginButton.disabled = true;

            // Get registered user data
            const userData = JSON.parse(localStorage.getItem('registered_user'));
            
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            if (!userData || userData.email !== email || userData.password !== password) {
                throw new Error('Invalid credentials');
            }

            // Create session
            const session = {
                email: email,
                loggedInAt: new Date().toISOString()
            };
            
            localStorage.setItem('user_session', JSON.stringify(session));

            // Redirect to profile page
            window.location.href = 'Profile.html';
        } catch (error) {
            console.error('Login error:', error);
            showError(emailError, 'Invalid email or password');
            showError(passwordError, 'Invalid email or password');
            emailInput.classList.add('error');
            passwordInput.classList.add('error');
        } finally {
            loginButton.classList.remove('loading');
            loginButton.disabled = false;
        }
    });

    // Handle forgot password
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        const email = prompt('Please enter your registered email address:');
        
        if (email) {
            if (validateEmail(email)) {
                // In a real application, this would trigger a password reset email
                alert('If an account exists with this email, you will receive password reset instructions.');
            } else {
                alert('Please enter a valid email address');
            }
        }
    });
});