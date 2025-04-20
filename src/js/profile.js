document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const userSession = JSON.parse(localStorage.getItem('user_session'));
    const userData = JSON.parse(localStorage.getItem('registered_user'));

    if (!userSession || !userData) {
        window.location.href = 'Login.html';
        return;
    }

    // DOM elements
    const profilePicture = document.querySelector('.profile-picture img');
    const changePictureBtn = document.querySelector('.change-picture-btn');
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    const infoItems = document.querySelectorAll('.info-item .value');
    const voteButton = document.querySelector('.vote-button');
    const logoutButton = document.querySelector('.logout-button');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Populate user data
    function populateUserInfo() {
        const infoMap = {
            'Name': userData.name,
            'Father\'s/Mother\'s Name': userData.parentName,
            'Age': calculateAge(new Date(userData.dateOfBirth)),
            'Mobile Number': userData.mobile,
            'Email': userData.email,
            'Aadhar Number': userData.aadhar,
            'Address': userData.address || 'Not provided',
            'Eligible': 'True',
            'Verified': 'True'
        };

        infoItems.forEach(item => {
            const label = item.previousElementSibling.textContent.replace(':', '');
            if (infoMap[label]) {
                item.textContent = infoMap[label];
            }
        });
    }

    // Calculate age from date of birth
    function calculateAge(birthDate) {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    // Handle profile picture change
    changePictureBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    profilePicture.src = event.target.result;
                    // Save to localStorage
                    localStorage.setItem('profile_picture', event.target.result);
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    });

    // Handle profile editing
    editProfileBtn.addEventListener('click', () => {
        const editableFields = ['mobile', 'address'];
        infoItems.forEach(item => {
            const label = item.previousElementSibling.textContent.replace(':', '').toLowerCase();
            if (editableFields.includes(label)) {
                const currentValue = item.textContent;
                const input = document.createElement('input');
                input.type = 'text';
                input.value = currentValue;
                input.className = 'edit-input';
                
                input.onblur = () => {
                    const newValue = input.value;
                    item.textContent = newValue;
                    // Update in localStorage
                    userData[label] = newValue;
                    localStorage.setItem('registered_user', JSON.stringify(userData));
                };
                
                item.textContent = '';
                item.appendChild(input);
                input.focus();
            }
        });
    });

    // Handle navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const target = e.target.textContent.toLowerCase();
            switch(target) {
                case 'elections':
                    window.location.href = 'Election.html';
                    break;
                case 'personal info':
                    // Already on profile page
                    break;
                case 'contact':
                    window.location.href = 'dashboard.html#footer-contact';
                    break;
            }
        });
    });

    // Handle vote button
    voteButton.addEventListener('click', () => {
        window.location.href = 'vote.html';
    });

    // Handle logout
    logoutButton.addEventListener('click', () => {
        if (confirm('Are you sure you want to logout?')) {
            // Clear all user-related data
            localStorage.removeItem('user_session');
            localStorage.removeItem('profile_picture');
            localStorage.removeItem('user_voted');
            localStorage.removeItem('selected_election');
            window.location.href = 'Login.html';
        }
    });

    // Load saved profile picture if exists
    const savedProfilePic = localStorage.getItem('profile_picture');
    if (savedProfilePic) {
        profilePicture.src = savedProfilePic;
    }

    // Check if user has already voted
    const hasVoted = localStorage.getItem('user_voted');
    if (hasVoted) {
        voteButton.disabled = true;
        voteButton.textContent = 'Already Voted';
        voteButton.style.backgroundColor = '#cccccc';
        voteButton.style.cursor = 'not-allowed';
    }

    // Initialize the page
    populateUserInfo();
});