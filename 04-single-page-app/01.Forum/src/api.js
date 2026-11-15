const BASE_URL = 'http://localhost:3030/jsonstore/collections/myboard';

export async function getAllTopics() {
    const response = await fetch(`${BASE_URL}/posts`);
    if (!response.ok) {
        throw new Error(`Failed to load topics: ${response.status}`);
    }
    const data = await response.json();
    return Object.values(data);
}

export async function getTopicById(id) {
    const response = await fetch(`${BASE_URL}/posts/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to load topic: ${response.status}`);
    }
    return response.json();
}

export async function createTopic(data) {
    const response = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`Failed to create topic: ${response.status}`);
    }
    return response.json();
}

export async function getComments() {
    const response = await fetch(`${BASE_URL}/comments`);
    if (!response.ok) {
        throw new Error(`Failed to load comments: ${response.status}`);
    }
    const data = await response.json();
    return Object.values(data);
}

export async function createComment(data) {
    const response = await fetch(`${BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error(`Failed to create comment: ${response.status}`);
    }
    return response.json();
}