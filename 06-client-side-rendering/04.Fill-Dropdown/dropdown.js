import { html, render } from 'https://unpkg.com/lit-html?module';
import { getItems, addItem } from './api.js';

const form = document.querySelector('form');
const menu = document.querySelector('#menu');

let items = await getItems();

const itemsTemplate = (items) => html`
    ${items.map(item => html`
        <option value="${item._id}">${item.text}</option>
    `)}
`;

render(itemsTemplate(items), menu);

form.addEventListener('submit', onSubmit);

async function onSubmit(e) {
    e.preventDefault();

    const formData = new FormData(form);
    const text = formData.get('text');

    if (!text) {
        return;
    }

    const newItem = await addItem({ text });

    items.push(newItem);

    render(itemsTemplate(items), menu);

    form.reset();
}