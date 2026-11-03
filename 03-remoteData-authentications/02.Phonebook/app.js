
function attachEvents() {
    const loadBtn = document.getElementById('btnLoad');
    const createBtn = document.getElementById('btnCreate');
    const ulList = document.querySelector('ul');

    const url = 'http://localhost:3030/jsonstore/phonebook';

    const personInput = document.getElementById('person');
    const phoneInput = document.getElementById('phone');

    createBtn.addEventListener('click', async () => {
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                person: personInput.value,
                phone: phoneInput.value
            })
        });

        personInput.value = '';
        phoneInput.value = '';
    });

    loadBtn.addEventListener('click', async () => {
        const response = await fetch(url);
        const data = await response.json();

        ulList.innerHTML = '';

        Object.values(data).forEach(person => {
            const liElement = document.createElement('li');
            liElement.textContent = `${person.person} : ${person.phone}`;

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';

            liElement.appendChild(deleteBtn);
            ulList.appendChild(liElement);

            deleteBtn.addEventListener('click', async () => {
                await fetch(`${url}/${person._id}`, {
                    method: 'DELETE'
                });

                liElement.remove();
            });
        });
    });
}

attachEvents();
