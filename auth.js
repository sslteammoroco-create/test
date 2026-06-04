const auth = window.auth || firebase.auth();

// Handle Login Form
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorEl = document.getElementById('error-message');

        try {
            await auth.signInWithEmailAndPassword(email, password);
            window.location.href = 'admin.html';
        } catch (error) {
            console.error("Login error:", error);
            errorEl.textContent = "Accès refusé. Informations d'identification invalides.";
            errorEl.classList.remove('hidden');
        }
    });
}

// Redirect if already logged in (on login page)
if (window.location.pathname.includes('login.html')) {
    auth.onAuthStateChanged(user => {
        if (user) {
            window.location.href = 'admin.html';
        }
    });
}

// Global Auth Check for Admin Page
window.checkAdminAuth = function() {
    auth.onAuthStateChanged(user => {
        if (!user) {
            window.location.href = 'login.html';
        }
    });
}

// Global Logout
window.logout = async function() {
    try {
        await auth.signOut();
        window.location.href = 'login.html';
    } catch (error) {
        console.error("Logout error:", error);
    }
};
