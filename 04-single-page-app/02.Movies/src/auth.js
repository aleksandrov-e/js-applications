
import { login, register, logout } from './api.js';

// HTML форми
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Logout линк
const logoutLink = document.querySelector('.navbar .user a:not(#welcome-msg)');

// LOGIN
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(loginForm);

    const email = formData.get('email');
    const password = formData.get('password');

    const userData = {
        email,
        password
    };

    try {
        const user = await login(userData);

        // Запазваме целия потребител
        sessionStorage.setItem('user', JSON.stringify(user));

        loginForm.reset();

        // Уведомяваме app.js
        window.dispatchEvent(new CustomEvent('authChanged'));
    } catch (error) {
        alert(error.message);
    }
});

// REGISTER
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(registerForm);

    const email = formData.get('email');
    const password = formData.get('password');
    const repeatPassword = formData.get('repeatPassword');

    if (!email || password.length < 6) {
        alert('Enter a valid email and a password with at least 6 characters!');
        return;
    }

    if (password !== repeatPassword) {
        alert('Passwords do not match!');
        return;
    }

    const userData = {
        email,
        password
    };

    try {
        const user = await register(userData);

        sessionStorage.setItem('user', JSON.stringify(user));

        registerForm.reset();

        window.dispatchEvent(new CustomEvent('authChanged'));
    } catch (error) {
        alert(error.message);
    }
});

// LOGOUT
logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();

    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
        return;
    }

    try {
        await logout(user.accessToken);

        sessionStorage.removeItem('user');

        window.dispatchEvent(new CustomEvent('authChanged'));
    } catch (error) {
        alert(error.message);
    }
});
