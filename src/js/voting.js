document.addEventListener('DOMContentLoaded', () => {
    // Basic authentication check
    const userSession = JSON.parse(localStorage.getItem('user_session'));
    const selectedElection = JSON.parse(localStorage.getItem('selected_election'));
    
    if (!userSession) {
        window.location.href = 'Login.html';
        return;
    }

    if (!selectedElection) {
        window.location.href = 'Election.html';
        return;
    }

    // Check if user has already voted
    if (localStorage.getItem('user_voted')) {
        alert('You have already cast your vote.');
        window.location.href = 'Profile.html';
        return;
    }

    // Instructions and Security Dialog Elements
    const instructionsDialog = document.getElementById('instructionsDialog');
    const securityDialog = document.getElementById('securityDialog');
    const understandCheckbox = document.getElementById('understand');
    const proceedBtn = document.querySelector('.proceed-btn');
    const cancelBtn = document.querySelector('.cancel-btn');
    const securityKey = document.getElementById('securityKey');
    const verifyBtn = document.querySelector('.verify-btn');
    const cancelVerificationBtn = document.getElementById('cancelVerification');

    // Initialize voting interface
    const candidates = document.querySelectorAll('.candidate');
    const confirmCheckbox = document.getElementById('vote-confirm');
    const submitButton = document.querySelector('.submit-btn');
    const confirmationText = document.querySelector('.checkbox-container span');
    const votingPanel = document.querySelector('.voting-panel');
    
    let selectedCandidate = null;

    // Initially hide voting panel
    votingPanel.style.display = 'none';

    // Instructions Dialog Logic
    understandCheckbox.addEventListener('change', () => {
        proceedBtn.disabled = !understandCheckbox.checked;
    });

    proceedBtn.addEventListener('click', () => {
        instructionsDialog.style.display = 'none';
        securityDialog.style.display = 'flex';
        
        const userEmail = JSON.parse(localStorage.getItem('user_session')).email;
        const demoKey = hashCode(userEmail + new Date().toDateString()).toString().slice(-6);
        
        // In a real application, this would send an email
        alert('For demo purposes: A security key would be sent to your email.\nDemo Key: ' + demoKey);
    });

    cancelBtn.addEventListener('click', () => {
        window.location.href = 'Election.html';
    });

    // Security Dialog Logic
    securityKey.addEventListener('input', () => {
        verifyBtn.disabled = securityKey.value.length !== 6;
        // Remove any non-numeric characters
        securityKey.value = securityKey.value.replace(/\D/g, '').slice(0, 6);
    });

    verifyBtn.addEventListener('click', () => {
        const storedKey = localStorage.getItem('security_key');
        const userEmail = JSON.parse(localStorage.getItem('user_session')).email;
        
        // In a real application, this would verify against a server
        // For demo, we'll use a hash of user email + date as the key
        const demoKey = hashCode(userEmail + new Date().toDateString()).toString().slice(-6);
        
        if (securityKey.value === demoKey) {
            securityDialog.style.display = 'none';
            votingPanel.style.display = 'block';
            localStorage.removeItem('security_key');
        } else {
            securityKey.classList.add('invalid-key');
            setTimeout(() => securityKey.classList.remove('invalid-key'), 500);
            alert('Invalid security key. Please try again.');
        }
    });

    cancelVerificationBtn.addEventListener('click', () => {
        window.location.href = 'Election.html';
    });

    // Simple hash function for demo purposes
    function hashCode(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash);
    }

    // Handle candidate selection
    candidates.forEach(candidate => {
        candidate.addEventListener('click', function() {
            // Remove selected class from all candidates
            candidates.forEach(c => c.classList.remove('selected'));
            // Add selected class to clicked candidate
            this.classList.add('selected');
            selectedCandidate = this;

            // Update confirmation text
            const candidateName = this.querySelector('.candidate-details h3').textContent;
            const candidateParty = this.querySelector('.candidate-details p').textContent;
            confirmationText.textContent = `I confirm my vote for ${candidateName} from ${candidateParty}`;
            
            // Reset checkbox
            confirmCheckbox.checked = false;
            updateSubmitButton();
        });
    });

    // Handle checkbox state
    confirmCheckbox.addEventListener('change', updateSubmitButton);

    function updateSubmitButton() {
        submitButton.disabled = !selectedCandidate || !confirmCheckbox.checked;
    }

    // Handle vote submission
    submitButton.addEventListener('click', async function(e) {
        e.preventDefault();

        if (!selectedCandidate) {
            alert('Please select a candidate first');
            return;
        }

        if (!confirmCheckbox.checked) {
            alert('Please confirm your selection by checking the box');
            return;
        }

        // Final confirmation
        if (!confirm('Are you sure you want to cast your vote? This action cannot be undone.')) {
            return;
        }

        try {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';

            // Get candidate details
            const candidateName = selectedCandidate.querySelector('.candidate-details h3').textContent;
            const candidateParty = selectedCandidate.querySelector('.candidate-details p').textContent;

            // Store vote data
            const voteData = {
                election: selectedElection.name,
                candidate: candidateName,
                party: candidateParty,
                timestamp: new Date().toISOString(),
                voter: userSession.email
            };

            // Simulate network delay (remove in production)
            await new Promise(resolve => setTimeout(resolve, 1000));

            localStorage.setItem('user_voted', JSON.stringify(voteData));

            alert('Your vote has been successfully recorded!');
            window.location.href = 'Profile.html';

        } catch (error) {
            console.error('Voting error:', error);
            alert('There was an error recording your vote. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = 'SUBMIT VOTE';
        }
    });

    // Prevent going back
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', function() {
        window.history.pushState(null, null, window.location.href);
    });

    // Initialize submit button state
    updateSubmitButton();
});