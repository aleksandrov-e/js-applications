import { loadTopics } from './home.js';
import { loadDetails } from './details.js';

const homeView = document.getElementById('home-view');
const detailsView = document.getElementById('details-view');
const homeLink = document.getElementById('home-link');

async function showDetails(id) {
    homeView.style.display = 'none';
    detailsView.style.display = 'block';

    await loadDetails(id);
}

function showHome() {
    detailsView.style.display = 'none';
    homeView.style.display = 'block';
}

homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showHome();
});

loadTopics(showDetails);