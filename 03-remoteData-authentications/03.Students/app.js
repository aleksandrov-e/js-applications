function Events(){
    const form = document.getElementById('form');
    const submitBtn = document.getElementById('submit');
    const tableBody = document.querySelector('#results tbody');
    const notification = document.querySelector('.notification');

    const url = 'http://localhost:3030/jsonstore/collections/students';

    async function loadStudents() {
        const response = await fetch(url);
        const data = await response.json();

        tableBody.innerHTML = '';

        Object.values(data).forEach(student => {
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <td>${student.firstName}</td>
                <td>${student.lastName}</td>
                <td>${student.facultyNumber}</td>
                <td>${student.grade}</td>
            `;

            tableBody.appendChild(tr);
        });
    }

     submitBtn.addEventListener('click', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        const firstName = formData.get('firstName').trim();
        const lastName = formData.get('lastName').trim();
        const facultyNumber = formData.get('facultyNumber').trim();
        const grade = Number(formData.get('grade'));

        if (!firstName || !lastName || !facultyNumber ||
            formData.get('grade').trim() === '' || !Number.isFinite(grade)) {
            notification.textContent = 'All fields are required!';
            return;
        }

        const student = {
            firstName,
            lastName,
            facultyNumber,
            grade
        };

        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(student)
        });

        form.reset();
        notification.textContent = '';

        await loadStudents();
    });

    loadStudents();
}
Events();
    
