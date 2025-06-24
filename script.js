const apiUrl = "https://weather-api-backend-wsi5.onrender.com/api/weather";


searchBtn.addEventListener("click", () => {
  const city = searchBox.value.trim();

  fetch(`${apiBase}?city=${encodeURIComponent(city)}&units=metric`)
    .then((res) => res.json())
    .then((data) => {
      // Display weather details
      console.log("Weather Data:", data);
      document.querySelector(".city").innerText = data.name || "City";
      document.querySelector(".temp").innerText = data.main
        ? `${data.main.temp}°C`
        : "N/A";
      document.querySelector(".humidity").innerText = data.main
        ? `${data.main.humidity}%`
        : "N/A";
      document.querySelector(".wind").innerText = data.wind
        ? `${data.wind.speed} km/h`
        : "N/A";

      document.querySelector(".weather").style.display = "block";
      document.querySelector(".error").style.display = "none";
    })
    .catch((err) => {
      console.error("Error fetching weather data:", err);
      document.querySelector(".error").style.display = "block";
      document.querySelector(".weather").style.display = "none";
    });
});
