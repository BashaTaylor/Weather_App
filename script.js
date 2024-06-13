const apiKey = 'dc623b669245617e22328d659131ed82'; // Replace with your actual API key
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const forecastApiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');
const descriptionElement = document.getElementById('description');
const humidityElement = document.getElementById('humidity');
const timeElement = document.getElementById('time');
const forecastElement = document.getElementById('forecast');
forecastElement.classList.add('forecast-container');
const weatherIconElement = document.getElementById('weatherIcon'); // Added this line
const windElement = document.getElementById('wind');
const precipitationElement = document.getElementById('precipitation'); // Added this line


searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
        fetchForecast(location);
    }
});

function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=imperial`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°F`;
            descriptionElement.textContent = data.weather[0].description;
            humidityElement.textContent = `Humidity: ${data.main.humidity}%`;

            // Estimating precipitation percentage based on humidity
            let precipitationPercentage = 0;
            if (data.main.humidity > 70) {
                precipitationPercentage = 50; // Example: If humidity is above 70%, assume 50% chance of precipitation
            } else if (data.main.humidity > 50) {
                precipitationPercentage = 30; // Example: If humidity is between 50% and 70%, assume 30% chance of precipitation
            } // You can add more conditions to fine-tune the estimation

            precipitationElement.textContent = `Precipitation: ${precipitationPercentage}%`;

            const weatherIcon = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
            weatherIconElement.src = iconUrl;

            const currentTime = new Date(data.dt * 1000);
            const options = { weekday: 'long', hour: 'numeric', minute: 'numeric' };
            const formattedTime = new Intl.DateTimeFormat('en-US', options).format(currentTime);
            timeElement.textContent = `${formattedTime}`;
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}



function fetchForecast(location) {
    const url = `${forecastApiUrl}?q=${location}&appid=${apiKey}&units=imperial`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const forecastData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
            forecastElement.innerHTML = '';
            forecastData.forEach(item => {
                const date = new Date(item.dt * 1000);
                const day = date.toLocaleDateString('en-US', { weekday: 'short' });
                const high = Math.round(item.main.temp_max);
                const low = Math.round(item.main.temp_min);
                const weatherIcon = item.weather[0].icon; // Get the weather icon code
                const forecastItem = document.createElement('div');
                forecastItem.classList.add('forecast-item');
                forecastItem.innerHTML = `
                    <p>${day}</p>
                    <img src="https://openweathermap.org/img/wn/${weatherIcon}.png" alt="Weather Icon"> <!-- Added weather icon -->
                    <p>High: ${high}°F</p>
                    <p>Low: ${low}°F</p>
                `;
                forecastElement.appendChild(forecastItem);
            });
        })
        .catch(error => {
            console.error('Error fetching forecast data:', error);
        });
}
