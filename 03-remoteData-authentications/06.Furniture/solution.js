function solve() {
  const host = 'http://localhost:3030';
  const guest = document.querySelector('#guest');
  const userMenu = document.querySelector('#user');
  const tbody = document.querySelector('tbody');
  const furnitureById = {};

  function getUser() {
    return JSON.parse(sessionStorage.getItem('user'));
  }

  function showMenues() {
    const user = getUser();

    if (guest) guest.style.display = user ? 'none' : 'block';
    if (userMenu) userMenu.style.display = user ? 'block' : 'none';

    document.querySelectorAll('tbody input[type="checkbox"]').forEach(checkbox => {
      checkbox.disabled = !user;
    });
  }

  function addRow(furniture) {
    furnitureById[furniture._id] = furniture;

    const trElement = document.createElement('tr');
    trElement.innerHTML = `
      <td><img src="${furniture.img}"></td>
      <td><p>${furniture.name}</p></td>
      <td><p>${furniture.price}</p></td>
      <td><p>${furniture.factor}</p></td>
      <td><input type="checkbox" data-id="${furniture._id}" disabled/></td>`;

    tbody.appendChild(trElement);
  }

  async function loadFurniture() {
    if (!tbody) return;

    const response = await fetch(host + '/data/furniture');
    const data = await response.json();

    tbody.innerHTML = '';
    Object.values(data).forEach(addRow);
    showMenues();
  }

  function register() {
    const registerForm = document.querySelector('form[action="/register"]');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const form = new FormData(registerForm);
      const email = form.get('email').trim();
      const password = form.get('password').trim();
      const repass = form.get('rePass').trim();

      if (!email || !password || password !== repass) {
        return alert('Invalid data or passwords do not match!');
      }

      const response = await fetch(host + '/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        return alert(error.message);
      }

      const data = await response.json();
      sessionStorage.setItem('user', JSON.stringify(data));
      registerForm.reset();
      window.location = 'home.html';
    });
  }

  function login() {
    const loginForm = document.querySelector('form[action="/login"]');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const form = new FormData(loginForm);
      const email = form.get('email').trim();
      const password = form.get('password').trim();

      if (!email || !password) {
        return alert('All fields are required!');
      }

      const response = await fetch(host + '/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const error = await response.json();
        return alert(error.message);
      }

      const data = await response.json();
      sessionStorage.setItem('user', JSON.stringify(data));
      loginForm.reset();
      window.location = 'home.html';
    });
  }

  function logout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const user = getUser();
      if (!user) return;

      const response = await fetch(host + '/users/logout', {
        headers: { 'X-Authorization': user.accessToken }
      });

      if (response.ok || response.status === 204) {
        sessionStorage.removeItem('user');
        window.location = 'home.html';
      }
    });
  }

  function createProduct() {
    const form = document.querySelector('form[action=""]');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const user = getUser();
      if (!user) return;

      const dataForm = new FormData(form);
      const name = dataForm.get('name').trim();
      const price = Number(dataForm.get('price'));
      const factor = Number(dataForm.get('factor'));
      const img = dataForm.get('img').trim();

      if (!name || !img || !price || !factor) {
        return alert('Please fill all fields with valid values!');
      }

      const response = await fetch(host + '/data/furniture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.accessToken
        },
        body: JSON.stringify({ name, price, factor, img })
      });

      if (!response.ok) {
        const error = await response.json();
        return alert(error.message);
      }

      const created = await response.json();
      addRow(created);
      showMenues();
      form.reset();
    });
  }

  function buyProduct() {
    const buyBtn = document.querySelector('table.table + button');
    if (!buyBtn) return;

    buyBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const user = getUser();
      if (!user) return;

      const checked = tbody.querySelectorAll('input[type="checkbox"]:checked');
      if (checked.length === 0) {
        return alert('Please select at least one item!');
      }

      const items = [...checked].map(checkbox => {
        const f = furnitureById[checkbox.dataset.id];
        return { _id: f._id, name: f.name, price: f.price, factor: f.factor, img: f.img };
      });

      const response = await fetch(host + '/data/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Authorization': user.accessToken
        },
        body: JSON.stringify({ items })
      });

      if (!response.ok) {
        const error = await response.json();
        return alert(error.message);
      }

      checked.forEach(checkbox => checkbox.checked = false);
    });
  }

  function allOrders() {
    const ordersBtn = document.querySelector('.orders button');
    if (!ordersBtn) return;

    ordersBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const user = getUser();
      if (!user) return;

      const response = await fetch(
        `${host}/data/orders?where=_ownerId%3D%22${user._id}%22`,
        { headers: { 'X-Authorization': user.accessToken } }
      );

      if (!response.ok) {
        const error = await response.json();
        return alert(error.message);
      }

      const orders = await response.json();
      const names = [];
      let total = 0;

      orders.forEach(order => {
        order.items.forEach(item => {
          names.push(item.name);
          total += Number(item.price);
        });
      });

      const spans = document.querySelectorAll('.orders span');
      spans[0].textContent = names.join(', ');
      spans[1].textContent = `${total} $`;
    });
  }

  showMenues();
  loadFurniture();
  register();
  login();
  logout();
  createProduct();
  buyProduct();
  allOrders();
}