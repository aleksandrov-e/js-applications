
function solve() {
    let departBtn = document.getElementById('depart');
    let arriveBtn = document.getElementById('arrive');

    arriveBtn.disabled = true;

    let infoElement = document.querySelector('.info');

    let stopID = 'depot';
    let stopName = 'Depot';

    async function depart() {
       try{
        let url = `http://localhost:3030/jsonstore/bus/schedule/${stopID}`
        let response = await fetch(url);
        let data = await response.json();
        stopID = data.next;
        stopName = data.name;
        arriveBtn.disabled = false;
        departBtn.disabled = true;
        infoElement.textContent = `Next stop: ${stopName}`;
       } 
       catch{
          infoElement.textContent = 'Error';
          arriveBtn.disabled = true;
       }
    }

    function arrive() {
        infoElement.textContent = `Arriving at : ${stopName}`;
        arriveBtn.disabled = true;
        departBtn.disabled = false;
    }

    return {
        depart,
        arrive
    };
}

let result = solve();
