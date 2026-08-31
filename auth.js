// Authentication System for Kominfo Riau Dashboard

// Default credentials (can be overridden in config.js)
const DEFAULT_CREDENTIALS = {
    username: 'admin',
    password: 'kominfo123'
};

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Check if user is logged in
function isLoggedIn() {
    const session = localStorage.getItem('kominfoSession');
    if (!session) return false;

    const sessionData = JSON.parse(session);
    const now = Date.now();

    // Check if session is expired
    if (now > sessionData.expiry) {
        logout();
        return false;
    }

    return true;
}

// Handle login
function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    const errorMessage = document.getElementById('errorMessage');
    const loading = document.getElementById('loading');
    const loginBtn = document.querySelector('.login-btn');

    // Show loading
    loading.classList.add('show');
    loginBtn.disabled = true;
    errorMessage.classList.remove('show');

    // Simulate network delay for better UX
    setTimeout(() => {
        // Get credentials from config or use defaults
        const validCredentials = window.AUTH_CREDENTIALS || DEFAULT_CREDENTIALS;

        // Validate credentials
        if (username === validCredentials.username && password === validCredentials.password) {
            // Create session
            const sessionData = {
                username: username,
                loginTime: Date.now(),
                expiry: rememberMe ? Date.now() + (7 * 24 * 60 * 60 * 1000) : Date.now() + SESSION_TIMEOUT
            };

            localStorage.setItem('kominfoSession', JSON.stringify(sessionData));

            // Redirect to dashboard
            window.location.href = 'index.html';
        } else {
            // Show error
            errorMessage.classList.add('show');
            loading.classList.remove('show');
            loginBtn.disabled = false;
        }
    }, 500);
}

// Logout
function logout() {
    localStorage.removeItem('kominfoSession');
    window.location.href = 'login.html';
}

// Check session on page load
function checkSession() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// Extend session
function extendSession() {
    const session = localStorage.getItem('kominfoSession');
    if (session) {
        const sessionData = JSON.parse(session);
        sessionData.expiry = Date.now() + SESSION_TIMEOUT;
        localStorage.setItem('kominfoSession', JSON.stringify(sessionData));
    }
}

// Auto-logout on session timeout
function setupSessionTimeout() {
    setInterval(() => {
        if (!isLoggedIn()) {
            logout();
        }
    }, 60000); // Check every minute
}

// Get current user info
function getCurrentUser() {
    const session = localStorage.getItem('kominfoSession');
    if (session) {
        const sessionData = JSON.parse(session);
        return {
            username: sessionData.username,
            loginTime: new Date(sessionData.loginTime).toLocaleString('id-ID'),
            expiry: new Date(sessionData.expiry).toLocaleString('id-ID')
        };
    }
    return null;
}

// Initialize on login page
if (window.location.pathname.includes('login.html')) {
    // Redirect if already logged in
    if (isLoggedIn()) {
        window.location.href = 'index.html';
    }
}
