const url = 'http://localhost:3030/jsonstore/advanced/table';

export async function getUsers() {
    const response = await fetch(url);
    if (response.ok) {
        const data = await response.json();
        return Object.values(data);
    }
}