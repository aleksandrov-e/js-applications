import { cats } from './catSeeder'
import { html, render } from 'https://unpkg.com/lit-html?module';

const section = document.querySelector('section');

const catsTemplate = (cats) => html`
<ul>
${cats.map(cat => html`
            <li>
                <img src="./images/cat100.jpg" width="250" height="250" alt="Card image cap">
                <div class="info">
                    <button class="showBtn">Show status code</button>
                    <div class="status" style="display: none" id="100">
                        <h4>Status Code: ${cat.statusCode}</h4>
                        <p>Continue</p>
                    </div>
                </div>
            </li>
        `)}
</ul>`