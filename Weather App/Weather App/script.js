const apiKey = "e1e02038717686ce0b6feed6b44e93be";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherDiv = document.querySelector(".weather");
const errorDiv = document.querySelector(".error");
const weatherIcon = document.querySelector(".weather-icon i");
const citiesContainer = document.getElementById("cities-container");
const topCitiesContainer = document.querySelector(".top-cities");

const topCities = ["London", "Paris", "Tokyo", "Sydney"];

// Hide weather and error messages initially
weatherDiv.style.display = "none";
errorDiv.style.display = "none";

async function fetchWeather(city, isTopCity = false) {
    if (!city.trim()) return;

    try {
        displayLoading(isTopCity);

        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
        if (!response.ok) {
            if (!isTopCity) {
                showError();
            }
            return;
        }

        const data = await response.json();
        updateWeatherUI(data, isTopCity);

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

function displayLoading(isTopCity) {
    if (!isTopCity) {
        errorDiv.style.display = "none";
        weatherDiv.innerHTML = `<p>Loading...</p>`;
        weatherDiv.style.display = "block";
    }
}

function showError() {
    weatherDiv.style.display = "none";
    errorDiv.style.display = "block";
}

function updateWeatherUI(data, isTopCity) {
    const iconClass = getWeatherIcon(data.weather[0].main);

    if (isTopCity) {
        displayTopCityWeather(data, iconClass);
    } else {
        document.querySelector(".city").innerText = data.name;
        document.querySelector(".temp").innerText = `${Math.round(data.main.temp)} °C`;
        document.querySelector(".humidity").innerText = `${data.main.humidity} %`;
        document.querySelector(".wind-speed").innerText = `${data.wind.speed} km/h`;

        weatherIcon.className = iconClass;
        weatherDiv.style.display = "block";
        errorDiv.style.display = "none";
        topCitiesContainer.style.display = "none";
    }
}

function getWeatherIcon(condition) {
    const icons = {
        "Clouds": "fa-solid fa-cloud",
        "Clear": "fa-solid fa-sun",
        "Rain": "fa-solid fa-cloud-showers-heavy",
        "Drizzle": "fa-solid fa-cloud-rain",
        "Mist": "fa-solid fa-smog"
    };
    return icons[condition] || "fa-solid fa-question";
}

function displayTopCityWeather(data, iconClass) {
    if (document.getElementById(`city-${data.name}`)) return;

    const cityElement = document.createElement("div");
    cityElement.classList.add("city-box");
    cityElement.id = `city-${data.name}`;
    cityElement.innerHTML = `
        <h3>${data.name}</h3>
        <p>${Math.round(data.main.temp)} °C</p>
        <p>Humidity: ${data.main.humidity} %</p>
        <p>Wind: ${data.wind.speed} km/h</p>
        <i class="${iconClass}"></i>
    `;
    citiesContainer.appendChild(cityElement);
}

searchBtn.addEventListener("click", () => fetchWeather(searchBox.value));
searchBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") fetchWeather(searchBox.value);
});

window.onload = () => {
    citiesContainer.innerHTML = "";
    topCities.forEach(city => fetchWeather(city, true));
};
