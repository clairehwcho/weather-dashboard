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
    const APIKey = '53887a25456014fd75935a098671a048'
    const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityname + '&appid=' + APIKey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    displayCurrentWeather(data);
                    displayFutureWeather(data);
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

    const heading = document.createElement('h2');
    const weatherIcon = document.createElement('img');
    const temp = document.createElement('p');
    const wind = document.createElement('p');
    const humidity = document.createElement('p');

    const name = data.city["name"];
    const today = data.list[0]
    const unformattedDate = today["dt_txt"].substring(0, 10).split('-');
    const formattedDate = unformattedDate[1] + "/" + unformattedDate[2] + "/" + unformattedDate[0];
    heading.textContent = name + " (" + formattedDate + ")"

    const iconCode = today["weather"][0]["icon"];
    const iconUrl = 'http://openweathermap.org/img/wn/' + iconCode + '.png';
    const iconDescription = today["weather"][0]["description"];
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    heading.appendChild(weatherIcon);

    temp.textContent = "Temp: " + today["main"]["temp"] + "ºF";
    wind.textContent = "Wind: " + today["wind"]["speed"] + " MPH";
    humidity.textContent = "Humidity: " + today["main"]["humidity"] + " %";

    currentContainerEl.append(heading, temp, wind, humidity);
}

const displayFutureWeather = function (data) {
    if (data.length === 0) {
        futureContainerEl.appendChild('p', 'No forecast data found.');
        return;
    }

    // Clear the innerHTML of future weather container.
    futureContainerEl.innerHTML = '';

    const date = document.createElement('p');
    date.classList = 'future-date';
    const weatherIcon = document.createElement('img');
    const temp = document.createElement('p');
    const wind = document.createElement('p');
    const humidity = document.createElement('p');
    const card = document.createElement('div');
    card.classList = 'card';

    for (let i = 1; i <= 5; i++) {
        const currentDate = data.list[i];

        const unformattedDate = currentDate["dt_txt"].substring(0, 10).split('-');
        const formattedDate = unformattedDate[1] + "/" + unformattedDate[2] + "/" + unformattedDate[0];
        date.textContent = formattedDate

        const iconCode = currentDate["weather"][0]["icon"];
        const iconUrl = 'http://openweathermap.org/img/wn/' + iconCode + '.png';
        const iconDescription = currentDate["weather"][0]["description"];
        weatherIcon.setAttribute('src', iconUrl);
        weatherIcon.setAttribute('alt', iconDescription);

        temp.textContent = "Temp: " + currentDate["main"]["temp"] + "ºF";
        wind.textContent = "Wind: " + currentDate["wind"]["speed"] + " MPH";
        humidity.textContent = "Humidity: " + currentDate["main"]["humidity"] + " %";

        card.append(date, weatherIcon, temp, wind, humidity);
        futureContainerEl.appendChild(card);
    }
}

searchFormEl.addEventListener('submit', formSubmitHandler);
// savedCityButtonEl.addEventListener('click', buttonClickHandler);