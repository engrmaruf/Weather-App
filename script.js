const apiKey = "b64f16e5127912fea18fb92125c008a4";
const form = document.querySelector("form");
const input = document.querySelector("#city");
const suggestions = document.querySelector(".suggestions");
const weather = document.querySelector(".weather");
const city = document.querySelector(".city");
const temp = document.querySelector(".temp");
const description = document.querySelector(".description");
const icon = document.querySelector(".icon");

const getWeatherData = async (cityName) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === "404") {
      throw new Error("City not found");
    }

    city.textContent = `${data.name}, ${data.sys.country}`;
    temp.innerHTML = `${Math.round(data.main.temp)}&deg;C`;
    description.textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;
    icon.innerHTML = `<img src="${iconUrl}" alt="Weather icon">`;

    weather.style.display = "block";
    suggestions.style.display = "none";
  } catch (error) {
    console.error(error);
    weather.style.display = "none";
    suggestions.style.display = "none";
    alert("Unable to retrieve weather data.");
  }
};

const displaySuggestions = async (searchTerm) => {
  try {
    const url = `https://api.openweathermap.org/data/2.5/find?q=${searchTerm}&appid=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    suggestions.innerHTML = "";

    data.list.forEach((result) => {
      const suggestion = document.createElement("div");
      suggestion.textContent = `${result.name}, ${result.sys.country}`;
      suggestion.addEventListener("click", () => {
        input.value = `${result.name}, ${result.sys.country}`;
        suggestions.innerHTML = "";
        getWeatherData(result.name);
      });
      suggestions.appendChild(suggestion);
    });

    if (data.list.length > 0) {
      suggestions.style.display = "block";
    } else {
      suggestions.style.display = "none";
    }
  } catch (error) {
    console.error(error);
    suggestions.style.display = "none";
  }
};

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const searchTerm = input.value.trim();
  if (searchTerm.length > 0) {
    getWeatherData(searchTerm);
  }
});

input.addEventListener("input", (event) => {
  const searchTerm = event.target.value.trim();
  if (searchTerm.length > 0) {
    displaySuggestions(searchTerm);
  } else {
    suggestions.innerHTML = "";
    suggestions.style.display = "none";
  }
});

// Get weather for current location by default
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            const city = `${data.name}, ${data.sys.country}`;
            input.value = city;
            getWeatherData(city);
          })
          .catch((error) => {
            console.error(error);
          });
      },
      (error) => {
        console.error(error);
      }
    );
  }
});
