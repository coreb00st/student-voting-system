document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    const submitBtn = form.querySelector('.submit-btn');
    
    // Validation patterns
    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
        mobile: /^[0-9]{10}$/,
        aadhar: /^[0-9]{12}$/,
        password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    };

    // Error messages
    const errorMessages = {
        name: 'Name should contain only letters and be 2-50 characters long',
        email: 'Please enter a valid email address',
        mobile: 'Mobile number should be 10 digits',
        aadhar: 'Aadhar number should be 12 digits',
        password: 'Password must be at least 8 characters with letters and numbers',
        confirmPassword: 'Passwords do not match',
        dateOfBirth: 'You must be at least 18 years old to register',
        parentName: 'Parent name is required'
    };

    // Age validation
    function isAtLeast18(birthDate) {
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            return age - 1 >= 18;
        }
        return age >= 18;
    }

    // Validate individual field
    function validateField(field) {
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        switch(fieldName) {
            case 'name':
            case 'parentName':
                isValid = patterns.name.test(field.value);
                errorMessage = errorMessages[fieldName];
                break;
            
            case 'email':
                isValid = patterns.email.test(field.value);
                errorMessage = errorMessages.email;
                break;
            
            case 'mobile':
                isValid = patterns.mobile.test(field.value);
                errorMessage = errorMessages.mobile;
                break;
            
            case 'aadhar':
                isValid = patterns.aadhar.test(field.value);
                errorMessage = errorMessages.aadhar;
                break;
            
            case 'password':
                isValid = patterns.password.test(field.value);
                errorMessage = errorMessages.password;
                break;
            
            case 'confirmPassword':
                const password = document.getElementById('password').value;
                isValid = field.value === password;
                errorMessage = errorMessages.confirmPassword;
                break;
            
            case 'dateOfBirth':
                isValid = isAtLeast18(new Date(field.value));
                errorMessage = errorMessages.dateOfBirth;
                break;
        }

        const errorElement = document.getElementById(`${field.id}Error`);
        if (!isValid && field.value) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
        } else {
            field.classList.remove('error');
            errorElement.textContent = '';
        }

        return isValid;
    }

    // Validate all fields
    function validateForm() {
        let isValid = true;
        const fields = form.querySelectorAll('input[required]');
        
        fields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        submitBtn.disabled = !isValid;
        return isValid;
    }

    // Add validation listeners to all fields
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', () => validateField(input));
        input.addEventListener('blur', () => validateField(input));
    });

    // Fixed Password toggle functionality
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent form submission
            const passwordInput = btn.previousElementSibling;
            const type = passwordInput.type === 'password' ? 'text' : 'password';
            passwordInput.type = type;
            btn.textContent = type === 'password' ? 'Show' : 'Hide';
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Here you would typically send the data to your backend
            // For now, we'll simulate success and store in localStorage
            localStorage.setItem('registered_user', JSON.stringify({
                ...data,
                registeredAt: new Date().toISOString()
            }));

            alert('Registration successful! Please login to continue.');
            window.location.href = 'Login.html';
        } catch (error) {
            alert('Registration failed. Please try again.');
            console.error('Registration error:', error);
        }
    });
});