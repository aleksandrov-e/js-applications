
import { createMovie, updateMovie } from './api.js';

// ADD MOVIE FORM
const addMovieForm = document.getElementById('add-movie-form');

// ADD MOVIE
addMovieForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addMovieForm);

    const title = formData.get('title');
    const description = formData.get('description');
    const img = formData.get('img');

    if (!title.trim() || !description.trim() || !img.trim()) {
        alert('All fields are required!');
        return;
    }

    const user = JSON.parse(sessionStorage.getItem('user'));

    if (!user) {
        alert('You must be logged in!');
        return;
    }

    const movieData = {
        title,
        description,
        img
    };

    try {
        await createMovie(movieData, user.accessToken);

        addMovieForm.reset();

        // Известяваме app.js, че филмът е добавен
        window.dispatchEvent(new CustomEvent('movieAdded'));
    } catch (error) {
        alert(error.message);
    }
});

// EDIT MOVIE
export function setupEditMovie(movie, onEdited) {
    // Взимаме текущата форма от страницата (тя се подменя при всяко отваряне)
    const editMovieForm = document.querySelector('#edit-movie form');

    // Премахваме стария submit handler чрез замяна на формата
    const newForm = editMovieForm.cloneNode(true);
    editMovieForm.replaceWith(newForm);

    // Попълваме формата със старите данни
    newForm.querySelector('[name="title"]').value = movie.title;
    newForm.querySelector('[name="description"]').value = movie.description;
    newForm.querySelector('[name="img"]').value = movie.img;

    newForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(newForm);

        const title = formData.get('title');
        const description = formData.get('description');
        const img = formData.get('img');

        const user = JSON.parse(sessionStorage.getItem('user'));

        if (!user) {
            alert('You must be logged in!');
            return;
        }

        const movieData = {
            title,
            description,
            img
        };

        try {
            await updateMovie(movie._id, movieData, user.accessToken);

            newForm.reset();

            if (onEdited) {
                onEdited();
            }
        } catch (error) {
            alert(error.message);
        }
    });
}
