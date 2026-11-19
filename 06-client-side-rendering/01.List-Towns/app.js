
import { html, render } from 'https://unpkg.com/lit-html?module';

const townsInput = document.getElementById('towns');
const loadButton = document.getElementById('btnLoadTowns');
const root = document.getElementById('root');

const townsTemplate = (towns) => html`
    <ul>
        ${towns.map(town => html`
            <li>${town}</li>
        `)}
    </ul>
`;

loadButton.addEventListener('click', (event) => {
    event.preventDefault();

    const towns = townsInput.value.split(', ');

    render(townsTemplate(towns), root);
});
