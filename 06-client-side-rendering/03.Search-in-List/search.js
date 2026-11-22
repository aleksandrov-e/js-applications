import { towns } from "./towns.js";
import { html, render } from 'https://unpkg.com/lit-html?module';

const townsDiv = document.querySelector('div[id="towns"]');
const searchBtn = document.querySelector('button');

const townsTemplate = (towns) => html`
<ul>
    ${towns.map(town => html`
        <li>${town}</li>
    `)}
</ul>`;

searchBtn.addEventListener('click', search);
render(townsTemplate(towns), townsDiv);

function search() {
    const input = document.querySelector('input');
    const result = document.querySelector('div[id="result"]');
    let matches = 0;
    const towns = townsDiv.querySelectorAll('li');

    towns.forEach(town => {
        town.classList.remove('active');

        if (town.textContent.includes(input.value)) {
            town.classList.add('active');
            matches++;
        }
    });

    result.textContent = `${matches} matches found`;
    input.value = '';
}