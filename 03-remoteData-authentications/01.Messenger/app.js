
function attachEvents() {
    const submitBtn = document.querySelector('input[value="Send"]');
    const refreshBtn = document.querySelector('input[value="Refresh"]');
    const textArea = document.querySelector('textarea');

    const url = 'http://localhost:3030/jsonstore/messenger';

    submitBtn.addEventListener('click', async () => {
    const nameInput = document.querySelector('input[name="author"]');
    const messageInput = document.querySelector('input[name="content"]');

    const inputName = nameInput.value;
    const inputMessage = messageInput.value;

    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            author: inputName,
            content: inputMessage
        })
    });

    nameInput.value = '';
    messageInput.value = '';
});

    refreshBtn.addEventListener('click', async () => {
        const response = await fetch(url);
        const data = await response.json();

        const messages = Object.values(data)
            .map(message => `${message.author}: ${message.content}`);

        textArea.value = messages.join('\n');
    });
}

attachEvents();
