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

const backendBaseURL = "https://skyline-weather-proxy.tomari7878.workers.dev";

const statusText = document.getElementById("statusText");

function setStatus(message, type = "") {
  statusText.textContent = message;
  statusText.className = `status ${type}`;
}

cityInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    fetchButton.click();
  }
});

// Fetch Forecast Data Too

fetchButton.addEventListener("click", async () => {
  const city = cityInput.value.trim();
  if (!city) {
  return setStatus("Please enter a city name.", "error");
  }

  try {
    setStatus("Fetching weather data...", "loading");
    fetchButton.disabled = true;

    const { lat, lon } = await getCoordinates(city);
    const [weatherData, forecastData] = await Promise.all([
      getWeatherData(lat, lon),
      getForecastData(lat, lon),
    ]);

    updateUI(weatherData, forecastData);
    setStatus("Weather data fetched successfully!");
    document.querySelectorAll(".forecast-card").forEach((el) => { el.classList.add("visible")});

  } catch (error) {
    console.error("Error fetching data:", error);
    setStatus("Couldn't fetch that city. Try another.", "error");
  } finally {
    fetchButton.disabled = false;
    cityInput.value = "";
  }
});

async function getCoordinates(city) {
  const url = `${backendBaseURL}/geo?q=${encodeURIComponent(city)}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Geocoding API error: ${response.status} ${response.statusText}`,
    );
  }
  
  const data = await response.json();
  if (data.length === 0) {
    throw new Error("City not found");
  }
  return { lat: data[0].lat, lon: data[0].lon };
}
async function getWeatherData(lat, lon) {
  const url = `${backendBaseURL}/weather?lat=${lat}&lon=${lon}`;
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
  const url = `${backendBaseURL}/forecast?lat=${lat}&lon=${lon}`;
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
  temperature.textContent = `${data.main.temp} °F`;
  weatherDescription.textContent = data.weather[0].description;
  weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
  humidity.textContent = `Humidity: ${data.main.humidity}%`;
  windSpeed.textContent = `Wind Speed: ${data.wind.speed} mph`;
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
      <p class="no-wrap">Temp: ${forecast.main.temp} °F</p>
      <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="${forecast.weather[0].description}">
      <p class="no-wrap">${forecast.weather[0].description}</p>
`;
      fDayForecast.appendChild(card);
    }
  } else {
    fDayForecast.innerHTML = "<p>Forecast data unavailable</p>";
  }
}

function getTheme() {
  let theme = localStorage.getItem("theme");
  if (!theme) {
    theme = window.matchMedia?.("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }
  return theme;
}

let theme = getTheme();

const renderTheme = () => {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
  }
};

document.getElementById("themeToggle").addEventListener("click", () => {
  theme = theme === "light" ? "dark" : "light";
  if (theme === "light") {
    document.getElementById("themeToggle").textContent = "☀️";
  } else {
    document.getElementById("themeToggle").textContent = "🌙";
    fetchButton.style.color = "#dbf3ff";
  }
  localStorage.setItem("theme", theme);
  renderTheme();
});


window.onload = () => {
  if (theme) {
    renderTheme();
    if (theme === "light") {
      document.getElementById("themeToggle").textContent = "☀️";
    } else {
      document.getElementById("themeToggle").textContent = "🌙";
    }
  }
  cityInput.value = "New York City";
  fetchButton.click();
  cityInput.focus();


};

