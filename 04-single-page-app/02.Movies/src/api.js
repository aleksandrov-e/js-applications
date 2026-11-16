
const BASE_URL = 'http://localhost:3030';

// MOVIES

async function getAllMovies() {
    const response = await fetch(`${BASE_URL}/data/movies`);

    if (!response.ok) {
        throw new Error('Failed to load movies');
    }

    const data = await response.json();
    return Object.values(data);
}

async function createMovie(data, token) {
    const response = await fetch(`${BASE_URL}/data/movies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to create movie');
    }

    return response.json();
}

async function updateMovie(id, data, token) {
    const response = await fetch(`${BASE_URL}/data/movies/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to update movie');
    }

    return response.json();
}

async function deleteMovie(id, token) {
    const response = await fetch(`${BASE_URL}/data/movies/${id}`, {
        method: 'DELETE',
        headers: {
            'X-Authorization': token
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete movie');
    }
}

// LIKES

async function getMovieLikes(movieId) {
    const response = await fetch(
        `${BASE_URL}/data/likes?where=movieId%3D%22${movieId}%22&distinct=_ownerId&count`
    );

    if (!response.ok) {
        throw new Error('Failed to load likes');
    }

    return response.json();
}

async function getUserLike(movieId, userId) {
    const response = await fetch(
        `${BASE_URL}/data/likes?where=movieId%3D%22${movieId}%22%20and%20_ownerId%3D%22${userId}%22`
    );

    if (!response.ok) {
        throw new Error('Failed to check user like');
    }

    return response.json();
}

async function createLike(movieId, token) {
    const response = await fetch(`${BASE_URL}/data/likes`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Authorization': token
        },
        body: JSON.stringify({ movieId })
    });

    if (!response.ok) {
        throw new Error('Failed to like movie');
    }

    return response.json();
}

// AUTHENTICATION

async function login(data) {
    const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return response.json();
}

async function register(data) {
    const response = await fetch(`${BASE_URL}/users/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Registration failed');
    }

    return response.json();
}

async function logout(token) {
    const response = await fetch(`${BASE_URL}/users/logout`, {
        headers: {
            'X-Authorization': token
        }
    });

    if (!response.ok) {
        throw new Error('Logout failed');
    }
}

export {
    getAllMovies,
    createMovie,
    updateMovie,
    deleteMovie,
    getMovieLikes,
    getUserLike,
    createLike,
    login,
    register,
    logout
};
