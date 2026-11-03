
function attachEvents() {
    const url = 'http://localhost:3030/jsonstore/collections/books';

    const loadBtn = document.getElementById('loadBooks');
    const form = document.getElementById('submitForm');
    const submitBtn = form.querySelector('button');
    const titleInput = form.querySelector('input[name="title"]');
    const authorInput = form.querySelector('input[name="author"]');
    const tbody = document.querySelector('tbody');

    let currentBookId = null;

    async function loadBooks() {
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Could not load books');
            }

            const data = await response.json();

            tbody.innerHTML = '';

            Object.values(data).forEach(book => {
                const tr = document.createElement('tr');

                const titleTd = document.createElement('td');
                titleTd.textContent = book.title;

                const authorTd = document.createElement('td');
                authorTd.textContent = book.author;

                const actionTd = document.createElement('td');

                const editBtn = document.createElement('button');
                editBtn.textContent = 'Edit';
                editBtn.dataset.id = book._id;
                editBtn.classList.add('edit');

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.dataset.id = book._id;
                deleteBtn.classList.add('delete');

                actionTd.appendChild(editBtn);
                actionTd.appendChild(deleteBtn);

                tr.appendChild(titleTd);
                tr.appendChild(authorTd);
                tr.appendChild(actionTd);

                tbody.appendChild(tr);
            });
        } catch (error) {
            console.error(error);
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();

        if (title === '' || author === '') {
            return;
        }

        const book = {
            title,
            author
        };

        try {
            let response;

            if (currentBookId !== null) {
                
                response = await fetch(`${url}/${currentBookId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(book)
                });
            } else {
                
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(book)
                });
            }

            if (!response.ok) {
                throw new Error('Request failed');
            }

            titleInput.value = '';
            authorInput.value = '';

            currentBookId = null;
            submitBtn.textContent = 'Submit';

            await loadBooks();

        } catch (error) {
            console.error(error);
        }
    });

    tbody.addEventListener('click', async (event) => {
        const target = event.target;

        if (target.classList.contains('edit')) {
            const bookId = target.dataset.id;

            try {
                const response = await fetch(`${url}/${bookId}`);

                if (!response.ok) {
                    throw new Error('Book not found');
                }

                const book = await response.json();

                titleInput.value = book.title;
                authorInput.value = book.author;

                currentBookId = bookId;
                submitBtn.textContent = 'Save';
            } catch (error) {
                console.error(error);
            }
        }

      
        if (target.classList.contains('delete')) {
            const bookId = target.dataset.id;

            try {
                const response = await fetch(`${url}/${bookId}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Could not delete book');
                }
                if (currentBookId === bookId) {
                    currentBookId = null;
                    titleInput.value = '';
                    authorInput.value = '';
                    submitBtn.textContent = 'Submit';
                }

                await loadBooks();

            } catch (error) {
                console.error(error);
            }
        }
    });

    
    loadBtn.addEventListener('click', loadBooks);
}

attachEvents();
