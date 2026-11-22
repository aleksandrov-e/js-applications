const url = 'http://localhost:3030/jsonstore/advanced/dropdown';

export async function getItems() {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to load items');
    }

    const data = await response.json();
    return Object.values(data);
}

export async function addItem(item) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    });

    if (!response.ok) {
        throw new Error('Failed to add item');
    }

    return await response.json();
}