
function attachEvents() {
    const locationInput = document.getElementById('location');
    const submitBtn = document.getElementById('submit');
    const forecastDiv = document.getElementById('forecast');
    const currentDiv = document.getElementById('current');
    const upcomingDiv = document.getElementById('upcoming');

    submitBtn.addEventListener('click', getWeather);

    async function getWeather() {
        try {
            let url = 'http://localhost:3030/jsonstore/forecaster/locations';

            let response = await fetch(url);

            if (!response.ok) {
                throw new Error('Request failed');
            }

            let locations = await response.json();

            let location = locations.find(
                x => x.name === locationInput.value.trim()
            );

        
            currentDiv.innerHTML = '<div class="label">Current conditions</div>';
            upcomingDiv.innerHTML = '<div class="label">Three-day forecast</div>';

            if (!location) {
                throw new Error('Location not found');
            }

            let code = location.code;

            let currentConditionsUrl =
                `http://localhost:3030/jsonstore/forecaster/today/${code}`;

            let forecastUrl =
                `http://localhost:3030/jsonstore/forecaster/upcoming/${code}`;

        
            let conditionResponse = await fetch(currentConditionsUrl);

            if (!conditionResponse.ok) {
                throw new Error('Request failed');
            }

            let conditions = await conditionResponse.json();

        
            let divForecast = document.createElement('div');
            divForecast.classList.add('forecasts');

            let symbolSpan = document.createElement('span');
            symbolSpan.classList.add('condition', 'symbol');

            let symbol = '';

            switch (conditions.forecast.condition) {
                case 'Sunny':
                    symbol = '☀';
                    break;
                case 'Partly sunny':
                    symbol = '⛅';
                    break;
                case 'Overcast':
                    symbol = '☁';
                    break;
                case 'Rain':
                    symbol = '☂';
                    break;
            }

            symbolSpan.textContent = symbol;

            let conditionSpan = document.createElement('span');
            conditionSpan.classList.add('condition');

            let lowSpan = document.createElement('span');
            lowSpan.classList.add('forecast-data');
            lowSpan.textContent = `Low: ${conditions.forecast.low}°`;

            let highSpan = document.createElement('span');
            highSpan.classList.add('forecast-data');
            highSpan.textContent = `High: ${conditions.forecast.high}°`;

            let conditionTextSpan = document.createElement('span');
            conditionTextSpan.classList.add('forecast-data');
            conditionTextSpan.textContent = conditions.forecast.condition;

            conditionSpan.appendChild(lowSpan);
            conditionSpan.appendChild(highSpan);
            conditionSpan.appendChild(conditionTextSpan);

            divForecast.appendChild(symbolSpan);
            divForecast.appendChild(conditionSpan);

            let forecastName = document.createElement('div');
            forecastName.classList.add('forecast');
            forecastName.textContent = conditions.name;

            currentDiv.appendChild(forecastName);
            currentDiv.appendChild(divForecast);

        
            let forecastResponse = await fetch(forecastUrl);

            if (!forecastResponse.ok) {
                throw new Error('Request failed');
            }

            let upcomingInfo = await forecastResponse.json();

            let forecastInfoDiv = document.createElement('div');
            forecastInfoDiv.classList.add('forecast-info');

            upcomingInfo.forecast.forEach(weather => {
                let upcomingSpan = document.createElement('span');
                upcomingSpan.classList.add('upcoming');

                let symbolSpan = document.createElement('span');
                symbolSpan.classList.add('symbol');

                let symbol = '';

                switch (weather.condition) {
                    case 'Sunny':
                        symbol = '☀';
                        break;
                    case 'Partly sunny':
                        symbol = '⛅';
                        break;
                    case 'Overcast':
                        symbol = '☁';
                        break;
                    case 'Rain':
                        symbol = '☂';
                        break;
                }

                symbolSpan.textContent = symbol;

                let lowSpan = document.createElement('span');
                lowSpan.classList.add('forecast-data');
                lowSpan.textContent = `Low: ${weather.low}°`;

                let highSpan = document.createElement('span');
                highSpan.classList.add('forecast-data');
                highSpan.textContent = `High: ${weather.high}°`;

                let conditionSpan = document.createElement('span');
                conditionSpan.classList.add('forecast-data');
                conditionSpan.textContent = weather.condition;

                upcomingSpan.appendChild(symbolSpan);
                upcomingSpan.appendChild(lowSpan);
                upcomingSpan.appendChild(highSpan);
                upcomingSpan.appendChild(conditionSpan);

                forecastInfoDiv.appendChild(upcomingSpan);
            });

            upcomingDiv.appendChild(forecastInfoDiv);

            forecastDiv.style.display = 'block';

        } catch (error) {
            currentDiv.innerHTML = '<div class="label">Current conditions</div>';
            upcomingDiv.innerHTML = '<div class="label">Three-day forecast</div>';

            currentDiv.textContent = 'Error';
            forecastDiv.style.display = 'block';
        }
    }
}
attachEvents();
