
function solution() {
    async function createStructure() {
        const url = 'http://localhost:3030/jsonstore/advanced/articles/list';

        const response = await fetch(url);
        const data = await response.json();

        const section = document.querySelector('#main');

        Object.values(data).forEach(article => {
            const mainDiv = document.createElement('div');
            mainDiv.classList.add('accordion');

            mainDiv.innerHTML = `
                <div class="head">
                    <span>${article.title}</span>
                    <button class="button" id="${article._id}">More</button>
                </div>
                <div class="extra" style="display: none">
                    <p></p>
                </div>
            `;

            section.appendChild(mainDiv);

            const btn = mainDiv.querySelector('.button');
            const extraDiv = mainDiv.querySelector('.extra');
            const paragraph = extraDiv.querySelector('p');

            btn.addEventListener('click', async () => {
                if (btn.textContent === 'More') {
                    try {
                        const detailsUrl = `http://localhost:3030/jsonstore/advanced/articles/details/${article._id}`;

                        const detailsResponse = await fetch(detailsUrl);
                        const details = await detailsResponse.json();

                        paragraph.textContent = details.content;
                        extraDiv.style.display = 'block';
                        btn.textContent = 'Less';
                    } catch (error) {
                        console.error(error);
                    }
                } else {
                    extraDiv.style.display = 'none';
                    btn.textContent = 'More';
                }
            });
        });
    }

    createStructure();
}

solution();
