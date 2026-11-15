import { getAllTopics, createTopic } from './api.js';

const topicForm = document.getElementById('topic-form');
const cancelBtn = topicForm.querySelector('.cancel');
const topicsDiv = document.querySelector('.topic-container');

// Запомняме callback-а, за да го ползваме и след създаване на тема
let onTopicClick = null;

export async function loadTopics(clickHandler) {
    if (clickHandler) {
        onTopicClick = clickHandler;
    }

    const topics = await getAllTopics();

    topicsDiv.innerHTML = '';
    topics.forEach(topic => {
        topicsDiv.appendChild(createTopicElement(topic));
    });
}

function createTopicElement(topic) {
    const wrapper = document.createElement('div');
    wrapper.className = 'topic-name-wrapper';

    // Структурата е точно като в example.html, без потребителски данни вътре
    wrapper.innerHTML = `
        <div class="topic-name">
            <a href="#" class="normal">
                <h2></h2>
            </a>
            <div class="columns">
                <div>
                    <p>Date: <time></time></p>
                    <div class="nick-name">
                        <p>Username: <span></span></p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Данните ги слагаме с textContent, за да са безопасни
    wrapper.querySelector('h2').textContent = topic.title;
    wrapper.querySelector('time').textContent = topic.createdAt || '';
    wrapper.querySelector('.nick-name span').textContent = topic.username;

    wrapper.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();
        onTopicClick(topic._id);
    });

    return wrapper;
}

topicForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(topicForm);
    const title = formData.get('topicName').trim();
    const username = formData.get('username').trim();
    const content = formData.get('postText').trim();

    if (!title || !username || !content) {
        alert('Please fill all fields!');
        return;
    }

    await createTopic({
        title,
        username,
        content,
        createdAt: new Date().toISOString()
    });

    topicForm.reset();
    await loadTopics();
});

cancelBtn.addEventListener('click', (e) => {
    e.preventDefault(); // иначе бутонът събмитва формата
    topicForm.reset();
});