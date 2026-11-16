
import './auth.js';
import { showMovies } from './home.js';
import { showDetails } from './details.js';
import { setupEditMovie } from './movie.js';

// Основни секции
const homeSection = document.getElementById('home-page');
const addMovieSection = document.getElementById('add-movie');
const detailsSection = document.getElementById('movie-example');
const editMovieSection = document.getElementById('edit-movie');

const loginSection = document.getElementById('login-form').closest('.view-section');
const registerSection = document.getElementById('register-form').closest('.view-section');

// Навигация
const homeLink = document.querySelector('.navbar-brand');
const addMovieLink = document.querySelector('#add-movie-button a');

const guestLinks = document.querySelectorAll('.navbar .guest');
const userLinks = document.querySelectorAll('.user');

const welcomeMessage = document.getElementById('welcome-msg');

// Всички секции
const sections = [
    homeSection,
    addMovieSection,
    detailsSection,
    editMovieSection,
    loginSection,
    registerSection
];

// Показва избрана секция и скрива останалите
function showSection(section) {
    sections.forEach(currentSection => {
        currentSection.style.display = 'none';
    });

    section.style.display = 'block';
}

// Проверка за текущ потребител
function getUser() {
    return JSON.parse(sessionStorage.getItem('user'));
}

// Обновяване на навигацията
function updateNavigation() {
    const user = getUser();

    guestLinks.forEach(link => {
        link.style.display = user ? 'none' : 'block';
    });

    userLinks.forEach(link => {
        link.style.display = user ? 'block' : 'none';
    });

    if (user) {
        welcomeMessage.textContent = `Welcome, ${user.email}`;
    }
}

// HOME
async function goToHome() {
    showSection(homeSection);
    updateNavigation();

    try {
        await showMovies(openDetails);
    } catch (error) {
        alert(error.message);
    }
}

// DETAILS
async function openDetails(id) {
    showSection(detailsSection);

    try {
        await showDetails(id, openEdit, goToHome);
    } catch (error) {
        alert(error.message);
    }
}

// ADD MOVIE
function openAddMovie() {
    showSection(addMovieSection);
}

// EDIT MOVIE
function openEdit(movie) {
    showSection(editMovieSection);

    setupEditMovie(movie, () => openDetails(movie._id));
}

// LOGIN
function openLogin() {
    showSection(loginSection);
}

// REGISTER
function openRegister() {
    showSection(registerSection);
}

// Навигация към началната страница
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    goToHome();
});

// Добавяне на филм
addMovieLink.addEventListener('click', (e) => {
    e.preventDefault();
    openAddMovie();
});

// Login и Register линкове
const loginLink = document.querySelector('.navbar .guest a[href="#"]');
const registerLink = loginLink?.parentElement?.nextElementSibling?.querySelector('a');

if (loginLink) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        openLogin();
    });
}

if (registerLink) {
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        openRegister();
    });
}

// След Login, Register или Logout
window.addEventListener('authChanged', () => {
    updateNavigation();

    if (getUser()) {
        goToHome();
    } else {
        openLogin();
    }
});

// След добавяне на филм
window.addEventListener('movieAdded', () => {
    goToHome();
});

// Първоначално зареждане
updateNavigation();
goToHome();
