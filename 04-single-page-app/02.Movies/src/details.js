
import {
    getAllMovies,
    getMovieLikes,
    getUserLike,
    createLike,
    deleteMovie
} from './api.js';

// HTML елементите в секцията с подробности
const detailsSection = document.getElementById('movie-example');

const titleElement = detailsSection.querySelector('h1');
const imageElement = detailsSection.querySelector('img');
const descriptionElement = detailsSection.querySelector('.text-center p');

const deleteBtn = detailsSection.querySelector('.btn-danger');
const editBtn = detailsSection.querySelector('.btn-warning');
const likeBtn = detailsSection.querySelector('.btn-primary');
const likesSpan = detailsSection.querySelector('.enrolled-span');

export async function showDetails(id, onEdit, onDelete) {
    try {
        // Зареждаме всички филми
        const movies = await getAllMovies();

        // Намираме избрания филм
        const movie = movies.find(movie => movie._id === id);

        if (!movie) {
            throw new Error('Movie not found');
        }

        // Показваме информацията за филма
        titleElement.textContent = `Movie title: ${movie.title}`;
        descriptionElement.textContent = movie.description;
        imageElement.src = movie.img;

        // Вземаме текущия потребител
        const user = JSON.parse(sessionStorage.getItem('user'));

        // Проверяваме дали потребителят е собственик
        const isOwner = user && user._id === movie._ownerId;

        // Показваме бутоните според потребителя
        deleteBtn.style.display = isOwner ? 'inline-block' : 'none';
        editBtn.style.display = isOwner ? 'inline-block' : 'none';
        likeBtn.style.display = 'none';
        likesSpan.style.display = 'inline-block';

        // Зареждаме броя харесвания
        const likes = await getMovieLikes(id);
        likesSpan.textContent = `Liked ${likes}`;

        // Ако потребителят е влязъл и не е собственик
        if (user && !isOwner) {
            const userLikes = await getUserLike(id, user._id);

            // Ако още не е харесал филма, показваме Like
            if (userLikes.length === 0) {
                likeBtn.style.display = 'inline-block';
            }
        }

        // LIKE
        likeBtn.onclick = async () => {
            try {
                await createLike(id, user.accessToken);
                await showDetails(id, onEdit, onDelete);
            } catch (error) {
                alert(error.message);
            }
        };

        // EDIT
        editBtn.onclick = () => {
            if (onEdit) {
                onEdit(movie);
            }
        };

        // DELETE
        deleteBtn.onclick = async () => {
            try {
                await deleteMovie(id, user.accessToken);

                if (onDelete) {
                    onDelete();
                }
            } catch (error) {
                alert(error.message);
            }
        };

    } catch (error) {
        alert(error.message);
    }
}
