import { cats } from './catSeeder.js'
import { html, render } from 'https://unpkg.com/lit-html?module';

const section = document.querySelector('section');
const catsList = cats;
const catsTemplate = (catsList) => html`
<ul>
${catsList.map(cat => html`
            <li>
                <img src="./images/${cat.imageLocation}.jpg" width="250" height="250" alt="Card image cap">
                <div class="info">
                    <button @click=${show} class="showBtn">Show status code</button>
                    <div class="status" style="display: none" id="${cat.id}">
                        <h4>Status Code: ${cat.statusCode}</h4>
                        <p>${cat.statusMessage}</p>
                    </div>
                </div>
            </li>
        `)}
</ul>`
render(catsTemplate(catsList), section);

function show(event){
  event.preventDefault();
  const current = event.target.parentNode;
  const infoDiv = current.querySelector('div[class="status"]');

  if (infoDiv.style.display == "none") {
     infoDiv.style.display = 'block'
  }else {
     infoDiv.style.display = 'none';
  }
}