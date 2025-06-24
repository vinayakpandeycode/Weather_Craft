const proxyBase = "https://weather-api-backend-wsi5.onrender.com/api/proxy";
const targetApi = "https://sijju.pythonanywhere.com/api/getData";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

searchBtn.addEventListener("click", () => {
  fetch(`${proxyBase}?url=${encodeURIComponent(targetApi)}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("Data via proxy:", data);

      document.querySelector(".city").innerText = data.city || "City";
      document.querySelector(".temp").innerText = data.temp
        ? `${data.temp}°C`
        : "N/A";
      document.querySelector(".humidity").innerText = data.humidity
        ? `${data.humidity}%`
        : "N/A";
      document.querySelector(".wind").innerText = data.wind
        ? `${data.wind} km/h`
        : "N/A";

      document.querySelector(".weather").style.display = "block";
      document.querySelector(".error").style.display = "none";
    })
    .catch((err) => {
      console.error("Proxy fetch failed:", err);
      document.querySelector(".error").style.display = "block";
      document.querySelector(".weather").style.display = "none";
    });
});
