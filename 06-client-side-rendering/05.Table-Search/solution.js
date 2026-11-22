import { html, render } from 'https://unpkg.com/lit-html?module';
import { getUsers } from './api.js';
async function solve() {
   document.querySelector('#searchBtn').addEventListener('click', onClick);
   const users = await getUsers();
   const tbody = document.querySelector('tbody[id="users"]');
   const input = document.querySelector('#searchField');
   const usersTemplate = (users) => html`
    ${users.map(user => html`
       <tr>
                <td>${user.firstName} ${user.lastName}</td>
                <td>${user.email}</td>
                <td>${user.course}</td>
         </tr>
      `)}
   `
   render(usersTemplate(users),tbody);
   function onClick() {
      const usersTr = document.querySelectorAll('tbody[id="users"] tr');
      usersTr.forEach(tr => {
         const usersTh = tr.children;
         tr.classList.remove('select');

         const hasMatch = [...usersTh].some(td => {
            return td.textContent.includes(input.value);
         })

         if (hasMatch) {
            tr.classList.add('select')
         }
      })
   }
}
solve();