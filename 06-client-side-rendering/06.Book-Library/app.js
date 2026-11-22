import { html, render } from 'https://unpkg.com/lit-html?module';
import { getBooks, getBookById, addBook, updateBook, deleteBook } from './api.js';

const tbody = document.querySelector('#books');
const loadBtn = document.querySelector('#loadBooks');
const addForm = document.querySelector('#add-form');
const editForm = document.querySelector('#edit-form');

let editingId = null;

addForm.style.display = 'block';
editForm.style.display = 'none';

const booksTemplate = (books) => html`
    ${books.map(book => html`
        <tr>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>
                <button @click=${() => onEdit(book._id)}>Edit</button>
                <button @click=${() => onDelete(book._id)}>Delete</button>
            </td>
        </tr>
    `)}
`;

async function loadBooks() {
    const books = await getBooks();
    render(booksTemplate(books), tbody);
}

loadBtn.addEventListener('click', (e) => {
    e.preventDefault();
    loadBooks();
});

addForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addForm);
    const title = formData.get('title').trim();
    const author = formData.get('author').trim();

    if (title === '' || author === '') {
        return;
    }

    await addBook({ title, author });
    addForm.reset();
    loadBooks();
});

async function onEdit(id) {
    const book = await getBookById(id);

    editingId = id;
    editForm.querySelector('[name="title"]').value = book.title;
    editForm.querySelector('[name="author"]').value = book.author;

    addForm.style.display = 'none';
    editForm.style.display = 'block';
}

editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(editForm);
    const title = formData.get('title').trim();
    const author = formData.get('author').trim();

    if (title === '' || author === '' || !editingId) {
        return;
    }

    await updateBook(editingId, { title, author });

    editingId = null;
    editForm.reset();
    editForm.style.display = 'none';
    addForm.style.display = 'block';
    loadBooks();
});

async function onDelete(id) {
    await deleteBook(id);
    loadBooks();
}