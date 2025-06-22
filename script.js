const apiKey = "604ce7dd92d0c7cd45c07d402d183aa8";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");
const unitToggleBtn = document.getElementById("toggle-unit");
const tempElement = document.querySelector(".temp");
const feelsLikeElement = document.querySelector(".feels-like");

let isCelsius = true;
let currentWeatherData = null;

// Confetti particles (unchanged)
function createConfetti() {
  const confettiContainer = document.querySelector('.particles');
  const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'absolute';
    confetti.style.width = Math.random() * 10 + 5 + 'px';
    confetti.style.height = Math.random() * 10 + 5 + 'px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-20px';
    confetti.style.opacity = Math.random() * 0.5 + 0.5;
    confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
    
    const keyframes = `
      @keyframes fall {
        to {
          transform: translateY(105vh) rotate(${Math.random() * 720}deg);
          opacity: 0;
        }
      }
    `;
    
    const style = document.createElement('style');
    style.innerHTML = keyframes;
    document.head.appendChild(style);
    
    confettiContainer.appendChild(confetti);
    
    setTimeout(() => {
      confetti.remove();
      style.remove();
    }, 5000);
  }
}

// Background animation (unchanged)
function animateBackgroundChange() {
  gsap.to("body", {
    duration: 2,
    backgroundPosition: "100% 50%",
    ease: "none",
    onComplete: function() {
      gsap.set("body", { backgroundPosition: "0% 50%" });
    }
  });
}

// Updated weather display with proper unit conversion
function updateWeather(data) {
  currentWeatherData = data;
  
  // Convert to Celsius if data is in Fahrenheit
  const tempC = data.units === "metric" ? data.main.temp : (data.main.temp - 32) * 5/9;
  const feelsLikeC = data.units === "metric" ? data.main.feels_like : (data.main.feels_like - 32) * 5/9;
  
  // Convert to Fahrenheit if needed
  const displayTemp = isCelsius ? Math.round(tempC) : Math.round((tempC * 9/5) + 32);
  const displayFeelsLike = isCelsius ? Math.round(feelsLikeC) : Math.round((feelsLikeC * 9/5) + 32);
  
  tempElement.innerHTML = `${displayTemp}°<span class="unit">${isCelsius ? 'C' : 'F'}</span>`;
  feelsLikeElement.innerHTML = `Feels Like ${displayFeelsLike}°<span class="unit">${isCelsius ? 'C' : 'F'}</span>`;

  document.querySelector(".city").innerText = data.name;
  document.querySelector(".humidity").innerText = data.main.humidity + "%";
  
  // Convert wind speed
  const windSpeed = data.units === "metric" ? 
    Math.round(data.wind.speed * 3.6) : // Convert m/s to km/h
    Math.round(data.wind.speed * 2.237); // Convert m/s to mph
  document.querySelector(".wind").innerText = windSpeed + (isCelsius ? " km/h" : " mph");
  
  document.querySelector(".country").innerText = data.sys.country || '';

  // Weather icon (unchanged)
  const weather = data.weather[0].main;
  const icons = {
    Clouds: "cloud-sun",
    Clear: "sun",
    Rain: "cloud-rain",
    Drizzle: "cloud-rain",
    Mist: "smog",
    Snow: "snowflake",
    Thunderstorm: "bolt"
  };

  const iconElement = document.createElement('i');
  iconElement.className = `fas fa-${icons[weather] || 'cloud'} weather-icon`;
  iconElement.style.fontSize = '80px';
  
  const iconColors = {
    Clear: '#ffcc00',
    Clouds: '#ffffff',
    Rain: '#00aaff',
    Drizzle: '#66ccff',
    Thunderstorm: '#ffaa00',
    Snow: '#ffffff',
    Mist: '#aaccff'
  };
  iconElement.style.color = iconColors[weather] || '#ffffff';
  iconElement.style.filter = `drop-shadow(0 0 10px ${iconColors[weather] || '#ffffff'}80)`;
  
  document.querySelector('.weather-icon-container').innerHTML = '';
  document.querySelector('.weather-icon-container').appendChild(iconElement);

  // Background (unchanged)
  document.body.className = weather.toLowerCase();
  animateBackgroundChange();

  // Local time (unchanged)
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const localTime = new Date(utc + (data.timezone * 1000));
  
  let hours = localTime.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutes = localTime.getMinutes().toString().padStart(2, '0');
  const timeString = `${hours}:${minutes} ${ampm}`;
  
  let localTimeEl = document.querySelector(".local-time");
  if (!localTimeEl) {
    localTimeEl = document.createElement("h3");
    localTimeEl.className = "local-time rainbow-text";
    document.querySelector(".weather").appendChild(localTimeEl);
  }
  localTimeEl.innerHTML = `Local Time: <span class="time-display">${timeString}</span>`;

  document.querySelector(".weather").style.display = "block";
  document.querySelector(".error").style.display = "none";
  
  // Animations (unchanged)
  gsap.from(".weather > *", {
    duration: 0.5,
    opacity: 0,
    y: 20,
    stagger: 0.1,
    ease: "power2.out",
    onStart: createConfetti
  });
  
  gsap.to(tempElement, {
    duration: 0.5,
    scale: 1.2,
    color: getRandomRainbowColor(),
    yoyo: true,
    repeat: 1,
    ease: "power1.inOut"
  });
}

// Helper function (unchanged)
function getRandomRainbowColor() {
  const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Check weather with proper unit handling
async function checkWeather(city) {
  if (!city) return;
  
  gsap.to(searchBtn, {
    duration: 0.3,
    backgroundColor: getRandomRainbowColor(),
    color: '#fff',
    yoyo: true,
    repeat: 1,
    ease: "power1.inOut"
  });
  
  const units = isCelsius ? "metric" : "imperial";
  try {
    const response = await fetch(`${apiUrl}${units}&q=${city}&appid=${apiKey}`);
    if (response.status === 404) {
      document.querySelector(".error").style.display = "block";
      document.querySelector(".weather").style.display = "none";
      gsap.to(".error", {
        duration: 0.5,
        backgroundColor: '#ff0000',
        color: '#fff',
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut"
      });
    } else {
      const data = await response.json();
      data.units = units;
      updateWeather(data);
    }
  } catch (error) {
    console.error("Error fetching weather data:", error);
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
  }
}

// Event listeners (unchanged except for unit toggle)
searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
  gsap.to(searchBtn, {
    duration: 0.2,
    scale: 0.9,
    yoyo: true,
    repeat: 1,
    ease: "power2.inOut"
  });
});

searchBox.addEventListener("keypress", e => {
  if (e.key === "Enter") {
    checkWeather(searchBox.value);
    gsap.to(searchBox, {
      duration: 0.1,
      x: -5,
      yoyo: true,
      repeat: 5,
      ease: "power1.inOut"
    });
  }
});

// Updated unit toggle
unitToggleBtn.addEventListener("click", () => {
  isCelsius = !isCelsius;
  unitToggleBtn.innerText = isCelsius ? "Switch to °F" : "Switch to °C";
  
  gsap.to(unitToggleBtn, {
    duration: 0.5,
    backgroundColor: getRandomRainbowColor(),
    color: '#fff',
    scale: 1.1,
    yoyo: true,
    repeat: 1,
    ease: "elastic.out(1, 0.5)",
    onComplete: () => {
      if (currentWeatherData) {
        updateWeather(currentWeatherData);
      } else if (searchBox.value) {
        checkWeather(searchBox.value);
      }
    }
  });
});

// Initial load (unchanged)
window.addEventListener("load", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const units = isCelsius ? "metric" : "imperial";
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`
        );
        const data = await response.json();
        data.units = units;
        updateWeather(data);
      } catch (error) {
        console.error("Error fetching location weather:", error);
      }
    });
  }
  
  gsap.from(".card", {
    duration: 1,
    opacity: 0,
    y: 50,
    backgroundColor: getRandomRainbowColor(),
    ease: "back.out(1.7)"
  });
});