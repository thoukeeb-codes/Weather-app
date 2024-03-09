const WeatherStatus = document.getElementById("weather-status");
const loader = document.getElementById("loader");
const windSpeed = document.getElementById("wind-speed");
const humidity = document.getElementById("humidity");
const clouds = document.getElementById("clouds");
const toggleSwitch = document.getElementById("toggleSwitch");
const contentToHide = document.getElementById("contentToHide");
const locationn = document.getElementById("location");
const catswitch = document.getElementById("catswitch");
const locationAccess = document.getElementById("location-access");

const apiKey = "db5189d76cf5add9df90821359678d65";
function renderWeatherInfo(data) {
  console.log("im render");
  const temperature = document.getElementById("temperature-c");
  temperature.textContent = `${data?.main?.temp.toFixed(2)} °c`;
}

toggleSwitch.addEventListener("change", function () {
  contentToHide.style.display = this.checked ? "block" : "none";
  locationn.style.display = this.checked ? "none" : "none";
  locationAccess.style.display = this.checked ? "none" : "block";
  catswitch.textContent = this.checked
    ? "switch to Auto location"
    : "switch to search by city";
});

async function handleButtonClick() {
  // Get the input value
  var inputText = document.getElementById("textInput").value;
  document.getElementById("loader").style.display = "block";
  locationn.style.display = "none";

  // Call the asynchronous function and wait for it to complete
  try {
    await fetchWeatherDetails(inputText);

    console.log("Processing complete.");
    // Add additional code to run after the async operation is complete
  } catch (error) {
    console.error("Error in async operation:", error);
  }
}
function revealDiv(data) {
  const cityName = document.getElementById("city-name");
  // Display the hidden div
  const city = data.name;
  console.log(city);

  cityName.textContent = city;
  WeatherStatus.textContent = data?.weather?.[0]?.description;
  windSpeed.textContent = `${data?.wind?.speed} kmph`;
  humidity.textContent = `${data?.main?.humidity} %`;
  clouds.textContent = `${data?.clouds?.all} %`;

  document.getElementById("location").style.display = "block";
}
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    locationAccess.style.display = "none";
    document.getElementById("loader").style.display = "block";
  } else {
    alert("no geolocation available");
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };

  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

async function fetchWeatherDetails(inputValue) {
  try {
    let city = inputValue;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    const data = await response.json();
    console.log("Weather data:->", data);
    renderWeatherInfo(data);
    revealDiv(data);
    document.getElementById("loader").style.display = "none";
  } catch (error) {}
}

async function fetchUserWeatherInfo(coordinates) {
  const { lat, lon } = coordinates;
  try {
    const result = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );

    let data = await result.json();
    console.log(data);
    renderWeatherInfo(data);
    revealDiv(data);
    document.getElementById("loader").style.display = "none";
  } catch (error) {
    console.log("Error Found", error);
  }
}
