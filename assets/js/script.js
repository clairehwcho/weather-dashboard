// Save reference to important DOM elements.
const searchFormEl = document.querySelector('.search-form');
const cityInputEl = document.querySelector('#search-term');
const searchButtonEl = document.querySelector('.search-btn');
const searchHistoryListEl = document.querySelector('.search-history-list');
const savedCityButtonEl = document.querySelector('saved-city-btn');
const currentContainerEl = document.querySelector('.current-container');
const futureContainerEl = document.querySelector('.future-container');

const formSubmitHandler = function (event) {
    event.preventDefault();

    const city = cityInputEl.value.trim();

    if (city) {
        getWeather(city);

        cityInputEl.value = '';
    } else {
        alert('The entered city cannot be found. Please try again.')
    }
};

const buttonClickHandler = function (event) {
    const savedCity = event.target.getAttribute('data-city');

    if (savedCity) {
        getWeather(savedCity);
    }
};

const getWeather = function (cityname) {
    let apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityname + '&appid=022b16ff817e6ce8bad0d6967ff115f1';

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    displayCurrentWeather(data);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather');
        });
}

const displayCurrentWeather = function (data) {
    if (data.length === 0) {
        currentContainerEl.textContent = 'No forecast data found.';
        return;
    }
    // Clear the innerHTML of current weather container.
    currentContainerEl.innerHTML = '';


    // Create elements and append to the container.
    const heading = document.createElement('h2');
    const weatherIcon = document.createElement('img');s
    const temp = document.createElement('p');
    const wind = document.createElement('p');
    const humidity = document.createElement('p');

    const name = data.city["name"];

    const today = data.list[0]
    const unformattedDate = today["dt_txt"].substring(0, 10).split('-');
    const currentDate = unformattedDate[1] + "/" + unformattedDate[2] + "/" + unformattedDate[0];

    const iconCode = today["weather"][0]["icon"];
    const iconUrl = 'http://openweathermap.org/img/wn/' + iconCode + '.png';
    const iconDescription = today["weather"][0]["description"];
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);

    heading.textContent = name + " (" + currentDate + ")"
    heading.appendChild(weatherIcon);
    temp.textContent = "Temp: " + today["main"]["temp"] + "ºF";
    wind.textContent = "Wind: " + today["wind"]["speed"] + " MPH";
    humidity.textContent = "Humidity: " + today["main"]["humidity"] + " %";

    currentContainerEl.append(heading, temp, wind, humidity);
}

const displayFutureWeather = function (data) {
    if (data.length === 0) {
        currentContainerEl.textContent = 'No forecast data found.';
        return;
    }
    // Clear the innerHTML of current weather container.
    currentContainerEl.innerHTML = '';


    // Create elements and append to the container.
    const heading = document.createElement('h2');
    const weatherIcon = document.createElement('img');
    const temp = document.createElement('p');
    const wind = document.createElement('p');
    const humidity = document.createElement('p');

    const name = data.city["name"];

    const today = data.list[0]
    const unformattedDate = today["dt_txt"].substring(0, 10).split('-');
    const currentDate = unformattedDate[1] + "/" + unformattedDate[2] + "/" + unformattedDate[0];

    const iconCode = today["weather"][0]["icon"];
    const iconUrl = 'http://openweathermap.org/img/wn/' + iconCode + '.png';
    const iconDescription = today["weather"][0]["description"];
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);

    heading.textContent = name + " (" + currentDate + ")"
    heading.appendChild(weatherIcon);
    temp.textContent = "Temp: " + today["main"]["temp"] + "ºF";
    wind.textContent = "Wind: " + today["wind"]["speed"] + " MPH";
    humidity.textContent = "Humidity: " + today["main"]["humidity"] + " %";

    currentContainerEl.append(heading, temp, wind, humidity);
}

searchFormEl.addEventListener('submit', formSubmitHandler);
// savedCityButtonEl.addEventListener('click', buttonClickHandler);