import config from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignupBtn = document.getElementById('show-signup');
    const signupModal = document.getElementById('signup-modal');
    const closeButtons = document.querySelectorAll('.close-modal');

    // Show signup modal
    showSignupBtn?.addEventListener('click', () => {
        if (signupModal) {
            signupModal.classList.add('active');
        }
        clearErrors();
    });

    // Close modals
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (signupModal) {
                signupModal.classList.remove('active');
            }
            clearErrors();
        });
    });

    // Handle login
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const username = e.target.username.value.trim();
        const password = e.target.password.value.trim();

        // Validate inputs
        if (!username) {
            showError('username', 'Username is required');
            return;
        }
        if (!password) {
            showError('password', 'Password is required');
            return;
        }

        const formData = { username, password };

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    showError('username', 'Invalid username or password');
                } else {
                    showError('username', data.message || 'Login failed');
                }
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('rfid', data.rfid || '');
            window.location.href = '/dashboard.html';
        } catch (error) {
            console.error('Login error:', error);
            showError('username', 'Unable to connect to server. Please try again later.');
        }
    });

    // Add role change handler
    const roleSelect = document.getElementById('role');
    const rfidGroup = document.querySelector('.rfid-group');

    roleSelect?.addEventListener('change', (e) => {
        if (e.target.value === 'passenger') {
            if (rfidGroup) {
                rfidGroup.style.display = 'block';
            }
            const rfidInput = document.getElementById('rfid');
            if (rfidInput) {
                rfidInput.setAttribute('required', 'true');
            }
        } else {
            if (rfidGroup) {
                rfidGroup.style.display = 'none';
            }
            const rfidInput = document.getElementById('rfid');
            if (rfidInput) {
                rfidInput.removeAttribute('required');
            }
        }
    });

    // Update signup form handler to include RFID
    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearErrors();

        const username = e.target.username.value.trim();
        const email = e.target.email.value.trim();
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;
        const role = e.target.role.value;
        const rfid = e.target.rfid?.value?.trim();

        // Validate inputs
        if (!username) {
            showError('signup-username', 'Username is required');
            return;
        }
        if (!email) {
            showError('signup-email', 'Email is required');
            return;
        }
        if (!isValidEmail(email)) {
            showError('signup-email', 'Please enter a valid email address');
            return;
        }
        if (!password) {
            showError('signup-password', 'Password is required');
            return;
        }
        if (password.length < 8) {
            showError('signup-password', 'Password must be at least 8 characters long');
            return;
        }
        if (password !== confirmPassword) {
            showError('confirm-password', 'Passwords do not match');
            return;
        }
        if (role === 'passenger' && !rfid) {
            showError('rfid', 'RFID is required for passenger accounts');
            return;
        }

        const formData = {
            username,
            email,
            password,
            role: role.charAt(0).toUpperCase() + role.slice(1),
            rfid: role === 'passenger' ? rfid : null
        };

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 409) {
                    if (data.message.includes('username')) {
                        showError('signup-username', 'Username already exists');
                    } else if (data.message.includes('email')) {
                        showError('signup-email', 'Email already exists');
                    } else if (data.message.includes('rfid')) {
                        showError('rfid', 'RFID already registered');
                    } else {
                        showError('signup-username', data.message || 'Signup failed');
                    }
                } else {
                    showError('signup-username', data.message || 'Signup failed');
                }
                return;
            }

            alert('Account created successfully! Please login.');
            if (signupModal) {
                signupModal.classList.remove('active');
            }
            e.target.reset();
            clearErrors();
        } catch (error) {
            console.error('Signup error:', error);
            showError('signup-username', 'Unable to connect to server. Please try again later.');
        }
    });
});

// Helper functions
function showError(inputId, message) {
    const input = document.getElementById(inputId);
    if (!input) {
        console.error(`Element with id '${inputId}' not found`);
        return;
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove any existing error message
    if (input.parentElement) {
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        input.parentElement.appendChild(errorDiv);
    }
    input.classList.add('error');
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    document.querySelectorAll('.error').forEach(input => input.classList.remove('error'));
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
} 