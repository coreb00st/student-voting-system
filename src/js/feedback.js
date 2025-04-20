document.addEventListener('DOMContentLoaded', () => {
    const feedbackForm = document.querySelector('.right-footer form');
    const emailInput = document.querySelector('.email-holder input');
    const messageInput = document.querySelector('.message-holder textarea');
    const submitButton = document.querySelector('.submit-button');

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function setSubmitButtonState() {
        const isValid = validateEmail(emailInput.value) && messageInput.value.trim().length > 0;
        submitButton.disabled = !isValid;
        submitButton.style.opacity = isValid ? '1' : '0.6';
    }

    emailInput.addEventListener('input', () => {
        emailInput.style.borderColor = validateEmail(emailInput.value) ? '#007bff' : '#ff4444';
        setSubmitButtonState();
    });

    messageInput.addEventListener('input', () => {
        messageInput.style.borderColor = messageInput.value.trim().length > 0 ? '#007bff' : '#ff4444';
        setSubmitButtonState();
    });

    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateEmail(emailInput.value)) {
            alert('Please enter a valid email address');
            return;
        }

        if (messageInput.value.trim().length === 0) {
            alert('Please enter your message');
            return;
        }

        // Here you would typically send the feedback to a server
        // For now, we'll just show a success message
        alert('Thank you for your feedback!');
        
        // Clear the form
        emailInput.value = '';
        messageInput.value = '';
        setSubmitButtonState();
    });

    // Initialize button state
    setSubmitButtonState();
});