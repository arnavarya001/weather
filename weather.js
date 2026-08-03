const API_KEY = "cc78f577884fde13d63d61e54989e331";

const form = document.getElementById("searchForm");
const cityInput = document.getElementById("cityInput");
const result = document.getElementById("result");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    getWeather();
});

async function getWeather() {
    const city = cityInput.value.trim();

    if (!city) {
        showAlert("⚠️ Please enter a city name!");
        return;
    }

    await fetchWeather(city);
}

function showAlert(message) {
    const alertBox = document.createElement("div");
    alertBox.className = "alert-box";
    alertBox.innerText = message;

    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
    }, 2000);
}

// Maps a temperature (°C) onto a 0–100 fill for the radial gauge.
// Scale runs from -20°C to 45°C, clamped at the edges.
function tempToFill(tempC) {
    const min = -20;
    const max = 45;
    const pct = ((tempC - min) / (max - min)) * 100;
    return Math.min(100, Math.max(0, pct));
}

async function fetchWeather(city) {
    result.innerHTML = `<div class="weather-card weather-card--empty">Loading…</div>`;

    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        const res = await fetch(url);
        const data = await res.json();

        if (String(data.cod) === "404") {
            result.innerHTML = `<div class="weather-card weather-card--error">City not found.</div>`;
            return;
        }

        const temp = Math.round(data.main.temp);
        const fill = tempToFill(data.main.temp);

        result.innerHTML = `
            <div class="weather-card">
                <p class="weather-card__city">${data.name}</p>

                <div class="gauge" style="--fill: ${fill}">
                    <div class="gauge__inner">
                        <span class="gauge__value">${temp}°</span>
                        <span class="gauge__unit">celsius</span>
                    </div>
                </div>

                <p class="weather-card__condition">${data.weather[0].description}</p>

                <div class="details-grid">
                    <div class="detail">
                        <span class="detail__label">Wind</span>
                        <span class="detail__value">${data.wind.speed} m/s</span>
                    </div>
                    <div class="detail">
                        <span class="detail__label">Humidity</span>
                        <span class="detail__value">${data.main.humidity}%</span>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        result.innerHTML = `<div class="weather-card weather-card--error">Error fetching data.</div>`;
    }
}
