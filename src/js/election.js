document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    const userSession = JSON.parse(localStorage.getItem('user_session'));
    if (!userSession) {
        window.location.href = 'Login.html';
        return;
    }

    const electionList = document.querySelectorAll('.state-elections');
    const voteButton = document.querySelector('.vote-button');
    
    // Check if user has already voted
    const hasVoted = localStorage.getItem('user_voted');
    if (hasVoted) {
        voteButton.disabled = true;
        voteButton.textContent = 'Already Voted';
        voteButton.style.backgroundColor = '#cccccc';
    }

    // Add click handlers for election items
    electionList.forEach(election => {
        election.addEventListener('click', () => {
            const electionName = election.querySelector('span:first-child').textContent;
            const electionDate = election.querySelector('span:last-child').textContent;
            
            // Store selected election
            localStorage.setItem('selected_election', JSON.stringify({
                name: electionName,
                date: electionDate
            }));
            
            // Navigate to voting page
            window.location.href = 'vote.html';
        });
    });

    // Navigation handlers
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = e.target.textContent.toLowerCase();
            switch(target) {
                case 'personal info':
                    window.location.href = 'Profile.html';
                    break;
                case 'elections':
                    // Already on elections page
                    break;
                case 'contact':
                    window.location.href = 'dashboard.html#footer-contact';
                    break;
            }
        });
    });

    // Handle vote button click
    voteButton.addEventListener('click', () => {
        if (!localStorage.getItem('selected_election')) {
            alert('Please select an election first');
            return;
        }
        window.location.href = 'vote.html';
    });

    // Add hover effect for better UX
    electionList.forEach(election => {
        election.style.cursor = 'pointer';
    });
});