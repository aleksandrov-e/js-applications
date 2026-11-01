
function lockedProfile() {
    const main = document.getElementById('main');

    async function getProfiles() {
        const url = 'http://localhost:3030/jsonstore/advanced/profiles';

        try {
            const response = await fetch(url);
            const data = await response.json();

            Object.values(data).forEach((profile, index) => {
                const userNumber = index + 1;

                const div = document.createElement('div');
                div.classList.add('profile');

                div.innerHTML = `
                    <img src="./iconProfile2.png" class="userIcon">

                    <label>Lock</label>
                    <input type="radio"
                        name="user${userNumber}Locked"
                        value="lock" checked>

                    <label>Unlock</label>
                    <input type="radio"
                        name="user${userNumber}Locked"
                        value="unlock">

                    <br>
                    <hr>

                    <label>Username</label>
                    <input type="text"
                        name="user${userNumber}Username"
                        value="${profile.username}"
                        disabled readonly>

                    <div class="user${userNumber}Username" style="display: none">
                        <hr>

                        <label>Email:</label>
                        <input type="email"
                            name="user${userNumber}Email"
                            value="${profile.email}"
                            disabled readonly>

                        <label>Age:</label>
                        <input type="number"
                            name="user${userNumber}Age"
                            value="${profile.age}"
                            disabled readonly>
                    </div>

                    <button>Show more</button>
                `;

                main.appendChild(div);

                const radios = div.querySelectorAll('input[type="radio"]');
                const hiddenInfo = div.querySelector(`.user${userNumber}Username`);
                const button = div.querySelector('button');

                button.addEventListener('click', () => {
                    if (radios[1].checked) {
                        if (button.textContent === 'Show more') {
                            hiddenInfo.style.display = 'block';
                            button.textContent = 'Hide it';
                        } else {
                            hiddenInfo.style.display = 'none';
                            button.textContent = 'Show more';
                        }
                    }
                });
            });

        } catch (error) {
            console.error(error);
        }
    }

    getProfiles();
}

lockedProfile();
