
function attachEvents() {
    const loginForm = document.querySelector('#login-view form');
    const registerForm = document.querySelector('#register-view form');
    const logoutBtn = document.getElementById('logout');

    const homeView = document.getElementById('home-view');
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');

    const guest = document.getElementById('guest');
    const userNav = document.getElementById('user');
    const userEmail = document.querySelector('.email span');

    const loadBtn = document.querySelector('.load');
    const catchesContainer = document.getElementById('catches');
    const addForm = document.getElementById('addForm');
    const addBtn = addForm.querySelector('.add');

    const baseUrl = 'http://localhost:3030';

    
    function getUser() {
        return JSON.parse(sessionStorage.getItem('user'));
    }

  
    function showHome() {
        loginView.style.display = 'none';
        registerView.style.display = 'none';
        homeView.style.display = 'block';

        guest.style.display = 'none';
        userNav.style.display = 'inline';
        userEmail.textContent = getUser().email;

        addBtn.disabled = false;
    }

    
    function showGuest() {
        homeView.style.display = 'none';
        loginView.style.display = 'block';

        guest.style.display = 'inline';
        userNav.style.display = 'none';

        addBtn.disabled = true;
    }


    function login() {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(loginForm);
            const email = formData.get('email');
            const password = formData.get('password');

            const response = await fetch(`${baseUrl}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const notification = loginForm.querySelector('.notification');

            if (!response.ok) {
                notification.textContent = 'Wrong email or password!';
                return;
            }

            const data = await response.json();
            sessionStorage.setItem('user', JSON.stringify(data));

            notification.textContent = '';
            loginForm.reset();

            showHome();
            loadCatches();
        });
    }

   
    function register() {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(registerForm);
            const email = formData.get('email');
            const password = formData.get('password');
            const rePassword = formData.get('rePass');

            const notification = registerForm.querySelector('.notification');

            if (!email || !password || !rePassword || password !== rePassword) {
                notification.textContent = 'Please fill all fields correctly!';
                return;
            }

            const response = await fetch(`${baseUrl}/users/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                notification.textContent = 'Registration failed!';
                return;
            }

            const data = await response.json();
            sessionStorage.setItem('user', JSON.stringify(data));

            notification.textContent = '';
            registerForm.reset();

            showHome();
            loadCatches();
        });
    }

    
    function logout() {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            const user = getUser();

            if (user) {
                await fetch(`${baseUrl}/users/logout`, {
                    headers: {
                        'X-Authorization': user.accessToken
                    }
                });
            }

            sessionStorage.removeItem('user');
            showGuest();
        });
    }


    async function loadCatches() {
        const response = await fetch(`${baseUrl}/data/catches`);
        const data = await response.json();

        catchesContainer.innerHTML = '';

        const user = getUser();

        Object.values(data).forEach((catchData) => {
            const isOwner = user && catchData._ownerId === user._id;

            const div = document.createElement('div');
            div.className = 'catch';

            div.innerHTML = `
                <label>Angler</label>
                <input type="text" class="angler" value="${catchData.angler}" disabled>

                <label>Weight</label>
                <input type="text" class="weight" value="${catchData.weight}" disabled>

                <label>Species</label>
                <input type="text" class="species" value="${catchData.species}" disabled>

                <label>Location</label>
                <input type="text" class="location" value="${catchData.location}" disabled>

                <label>Bait</label>
                <input type="text" class="bait" value="${catchData.bait}" disabled>

                <label>Capture Time</label>
                <input type="text" class="captureTime" value="${catchData.captureTime}" disabled>

                <button class="update" data-id="${catchData._id}" ${isOwner ? '' : 'disabled'}>Update</button>
                <button class="delete" data-id="${catchData._id}" ${isOwner ? '' : 'disabled'}>Delete</button>
            `;

            catchesContainer.appendChild(div);
        });
    }


    function addCatch() {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(addForm);

            const angler = formData.get('angler');
            const weight = Number(formData.get('weight'));
            const species = formData.get('species');
            const location = formData.get('location');
            const bait = formData.get('bait');
            const captureTime = Number(formData.get('captureTime'));

            if (!angler || !species || !location || !bait ||
                !Number.isFinite(weight) || !Number.isFinite(captureTime)) {
                return;
            }

            const user = getUser();

            const response = await fetch(`${baseUrl}/data/catches`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Authorization': user.accessToken
                },
                body: JSON.stringify({
                    angler,
                    weight,
                    species,
                    location,
                    bait,
                    captureTime
                })
            });

            if (response.ok) {
                addForm.reset();
                loadCatches();
            }
        });
    }

   
    catchesContainer.addEventListener('click', async (e) => {
        const user = getUser();

        if (!user) {
            return;
        }

        const id = e.target.dataset.id;

        if (e.target.classList.contains('delete')) {
            const response = await fetch(`${baseUrl}/data/catches/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-Authorization': user.accessToken
                }
            });

            if (response.ok) {
                loadCatches();
            }
        }

        if (e.target.classList.contains('update')) {
            const catchElement = e.target.closest('.catch');

            const catchData = {
                angler: catchElement.querySelector('.angler').value,
                weight: Number(catchElement.querySelector('.weight').value),
                species: catchElement.querySelector('.species').value,
                location: catchElement.querySelector('.location').value,
                bait: catchElement.querySelector('.bait').value,
                captureTime: Number(catchElement.querySelector('.captureTime').value)
            };

            if (e.target.textContent === 'Update') {
                catchElement.querySelectorAll('input').forEach(input => {
                    input.disabled = false;
                });

                e.target.textContent = 'Save';
            } else {
                const response = await fetch(`${baseUrl}/data/catches/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Authorization': user.accessToken
                    },
                    body: JSON.stringify(catchData)
                });

                if (response.ok) {
                    loadCatches();
                }
            }
        }
    });

    
    loadBtn.addEventListener('click', loadCatches);

    login();
    register();
    logout();
    addCatch();
    if (getUser()) {
        showHome();
        loadCatches();
    } else {
        showGuest();
    }
}

attachEvents();
