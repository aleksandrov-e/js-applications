const baseUrl = 'http://localhost:3030/jsonstore/collections/books';

export async function getBooks() {
    const response = await fetch(baseUrl);

    if (!response.ok) {
        return [];
    }

    const data = await response.json();
    return Object.entries(data).map(([id, book]) => ({ ...book, _id: id }));
}

export async function getBookById(id) {
    const response = await fetch(`${baseUrl}/${id}`);

    if (!response.ok) {
        throw new Error('Failed to load book');
    }

    return await response.json();
}

export async function addBook(data) {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to add book');
    }

    return await response.json();
}

export async function updateBook(id, data) {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error('Failed to update book');
    }

    return await response.json();
}

export async function deleteBook(id) {
    const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE'
    });

    if (!response.ok) {
        throw new Error('Failed to delete book');
    }

    return await response.json();
}