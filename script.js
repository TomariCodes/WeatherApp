const cityInput = document.getElementById("cityInput");
const fetchButton = document.getElementById("searchButton");
const cityName = document.getElementById("cityName");
const countryName = document.getElementById("countryName");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const weatherIcon = document.getElementById("weatherIcon");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const fDayForecast = document.getElementById("forecastCards");

const API_KEY = "af81607633c493b709882edb6e3b5498";
const longLatBaseURL = "http://api.openweathermap.org/geo/1.0/direct";
const weatherBaseURL = "https://api.openweathermap.org/data/2.5/weather";
const forecastBaseURL = "https://api.openweathermap.org/data/2.5/forecast";

cityInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    fetchButton.click();
  }
});

// Fetch Forecast Data Too

fetchButton.addEventListener("click", () => {
  const city = cityInput.value;
  getCoordinates(city)
    .then(({ lat, lon }) => {
      console.log(`Coordinates for ${city}: lat=${lat}, lon=${lon}`);
      return Promise.all([getWeatherData(lat, lon), getForecastData(lat, lon)]);
    })
    .then(([weatherData, forecastData]) => {
      console.log("Weather data:", weatherData);
      console.log("Forecast data:", forecastData);
      updateUI(weatherData, forecastData);
    })
    .catch((error) => console.error("Error fetching data:", error));
});

async function getCoordinates(city) {
  const url = `${longLatBaseURL}?q=${city}&limit=1&appid=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.length === 0) {
    throw new Error("City not found");
  }
  return { lat: data[0].lat, lon: data[0].lon };
}
async function getWeatherData(lat, lon) {
  const url = `${weatherBaseURL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Weather API error: ${response.status} ${response.statusText}`,
    );
  }
  const data = await response.json();
  return data;
}

async function getForecastData(lat, lon) {
  const url = `${forecastBaseURL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Forecast API error: ${response.status} ${response.statusText}`,
    );
  }
  const data = await response.json();
  return data;
}

function updateUI(data, forecastData) {
  cityName.textContent = data.name;
  temperature.textContent = `${data.main.temp} °C`;
  weatherDescription.textContent = data.weather[0].description;
  weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} m/s`;
  pressure.textContent = `Pressure: ${data.main.pressure} hPa`;
  visibility.textContent = `Visibility: ${data.visibility} meters`;

  // Update 5-day forecast
  fDayForecast.innerHTML = "";
  if (forecastData && forecastData.list) {
    for (let i = 0; i < forecastData.list.length; i += 8) {
      const forecast = forecastData.list[i];
      const card = document.createElement("div");
      card.className = "forecast-card";
      const date = new Date(forecast.dt * 1000);
      card.innerHTML = `
      <h4 class="no-wrap">${date.toDateString()}</h4>
      <p class="no-wrap">Temp: ${forecast.main.temp} °C</p>
      <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
      <p class="no-wrap">${forecast.weather[0].description}</p>
`;
      fDayForecast.appendChild(card);
    }
  } else {
    fDayForecast.innerHTML = "<p>Forecast data unavailable</p>";
  }
}

//https://api.openweathermap.org/data/2.5/weather?newyork&appid=af81607633c493b709882edb6e3b5498
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}
