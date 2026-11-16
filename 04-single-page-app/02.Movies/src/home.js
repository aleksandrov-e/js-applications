
import { getAllMovies } from './api.js';

const movieList = document.querySelector('#movies-list');

export async function showMovies(onDetails) {
    const movies = await getAllMovies();

    movieList.innerHTML = '';

    movies.forEach(movie => {
        const liElement = document.createElement('li');
        liElement.className = 'card mb-4';

        liElement.innerHTML = `
            <img class="card-img-top" src="${movie.img}" alt="Movie image"/>
            <div class="card-body">
                <h4 class="card-title">${movie.title}</h4>
            </div>
            <div class="card-footer">
                <button type="button" class="btn btn-info">Details</button>
            </div>
        `;

        const detailsBtn = liElement.querySelector('.btn-info');

        detailsBtn.addEventListener('click', () => {
            onDetails(movie._id);
        });

        movieList.appendChild(liElement);
    });
}
