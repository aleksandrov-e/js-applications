import { getTopicById, getComments, createComment } from './api.js';

const themeTitle = document.querySelector('.theme-name h2');
const commentsContainer = document.querySelector('#details-view .comment');
const commentForm = document.getElementById('comment-form');

let currentTopicId = null;

export async function loadDetails(topicId) {
    currentTopicId = topicId;
    commentsContainer.innerHTML = '';

    
    const topic = await getTopicById(topicId);
    themeTitle.textContent = topic.title;
    commentsContainer.appendChild(createPostElement(topic));

    
    const comments = await getComments();
    comments
        .filter(comment => comment.postId === topicId)
        .forEach(comment => {
            commentsContainer.appendChild(createCommentElement(comment));
        });
}

function createPostElement(topic) {
    const header = document.createElement('div');
    header.className = 'header';

    header.innerHTML = `
        <img src="./static/profile.png" alt="avatar">
        <p><span></span> posted on <time></time></p>
        <p class="post-content"></p>
    `;

    header.querySelector('span').textContent = topic.username;
    header.querySelector('time').textContent = formatDate(topic.createdAt);
    header.querySelector('.post-content').textContent = topic.content;

    return header;
}

function createCommentElement(comment) {
    const div = document.createElement('div');
    div.id = 'user-comment';

    div.innerHTML = `
        <div class="topic-name-wrapper">
            <div class="topic-name">
                <p><strong></strong> commented on <time></time></p>
                <div class="post-content">
                    <p></p>
                </div>
            </div>
        </div>
    `;

    div.querySelector('strong').textContent = comment.username;
    div.querySelector('time').textContent = formatDate(comment.createdAt);
    div.querySelector('.post-content p').textContent = comment.text;

    return div;
}


function formatDate(isoString) {
    if (!isoString) {
        return '';
    }
    return isoString.replace('T', ' ').slice(0, 19);
}

commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(commentForm);
    const username = formData.get('username').trim();
    const text = formData.get('postText').trim();

    if (!username || !text) {
        alert('Please fill all fields!');
        return;
    }

    await createComment({
        text,
        username,
        postId: currentTopicId,
        createdAt: new Date().toISOString()
    });

    commentForm.reset();
    await loadDetails(currentTopicId);
});