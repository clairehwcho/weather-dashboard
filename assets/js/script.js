// Save reference to important DOM elements.
const searchFormEl = document.querySelector('.search-form');
const cityInputEl = document.querySelector('#search-term');
const searchButtonEl = document.querySelector('.search-btn');
const searchHistoryListEl = document.querySelector('.search-history-list');
const currentContainerEl = document.querySelector('.current-container');
const futureContainerEl = document.querySelector('.future-container');

// Save reference to API key.
const APIKey = '53887a25456014fd75935a098671a048';

// The getCityFromStorage function returns an array of cities that have been searched.
const getCityFromStorage = function (cityname) {
    const cityArr = localStorage.getItem('city');
    if (cityArr) {
        storedCityArr = JSON.parse(cityArr);
        console.log("Search history found from local storage");
        return storedCityArr;
    }
    else {
        console.log("No search history found from local storage");
        return null;
    }
};

// The storecityToStorage function stores search history to local storage.
const storeCityToStorage = function (cityname) {
    if (!localStorage["city"]) {
        const newCityArr = [];
        newCityArr.push(cityname);
        localStorage.setItem("city", JSON.stringify(newCityArr));
    }
    else {
        const cityArr = getCityFromStorage();
        if (!cityArr.includes(cityname)) {
            cityArr.push(cityname);
            localStorage.setItem("city", JSON.stringify(cityArr));
        }
        else {
            return;
        }
    }
    console.log("Search history stored in local storage");
};

// The displayCurrentWeather function renders the current weather condition.
const displayCurrentWeather = function (data) {
    if (data.length === 0) {
        currentContainerEl.textContent = 'No weather data found.';
        return;
    };

    // Clear the innerHTML of current weather container.
    currentContainerEl.innerHTML = '';

    const heading = document.createElement('h2');
    const weatherIcon = document.createElement('img');
    const temp = document.createElement('p');
    const wind = document.createElement('p');
    const humidity = document.createElement('p');

    const name = data["name"];
    const today = dayjs().format('M/D/YYYY');
    heading.textContent = name + " (" + today + ")";

    const iconCode = data["weather"][0]["icon"];
    const iconUrl = 'http://openweathermap.org/img/wn/' + iconCode + '.png';
    const iconDescription = data["weather"][0]["description"];
    weatherIcon.setAttribute('src', iconUrl);
    weatherIcon.setAttribute('alt', iconDescription);
    heading.appendChild(weatherIcon);

    temp.textContent = "Temp: " + data["main"]["temp"] + "ºF";
    wind.textContent = "Wind: " + data["wind"]["speed"] + " MPH";
    humidity.textContent = "Humidity: " + data["main"]["humidity"] + " %";

    currentContainerEl.append(heading, temp, wind, humidity);
};

// The displayFutureWeather function renders the weather conditions of the next 5 days.
const displayFutureWeather = function (data) {
    if (data.length === 0) {
        futureContainerEl.appendChild('p', 'No forecast data found.');
        return;
    }

    // Clear the innerHTML of future weather container.
    futureContainerEl.innerHTML = '';

    for (let i = 0; i < data.list.length; i++) {
        const date = document.createElement('p');
        date.classList = 'future-date';
        const weatherIcon = document.createElement('img');
        weatherIcon.classList = 'weather-icon';
        const temp = document.createElement('p');
        const wind = document.createElement('p');
        const humidity = document.createElement('p');
        const card = document.createElement('div');
        card.classList = 'card';

        const currentDate = data.list[i];
        const today = dayjs().format('YYYY-MM-DD');

        if (!currentDate["dt_txt"].includes(today) && currentDate["dt_txt"].includes("09:00:00")) {
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
            futureContainerEl.append(card);
        }

        if (document.getElementsByClassName('card').length === 5) {
            return;
        }
    }
}

// The displaySavedCityButton function creates and renders a button under the search bar when search is done.
const displaySavedCityButton = function () {
    const cityArr = getCityFromStorage();
    console.log(cityArr);
    if (!cityArr) {
        console.log("No search history to be rendered");
        return;
    };

    searchHistoryListEl.innerHTML = '';

    for (let i = 0; i < cityArr.length; i++) {
        const savedCityButton = document.createElement('li');
        savedCityButton.classList = 'saved-city-btn button';;
        const currentCity = cityArr[i];
        savedCityButton.setAttribute('data-city', currentCity);
        savedCityButton.textContent = currentCity;
        searchHistoryListEl.append(savedCityButton);

        savedCityButton.addEventListener('click', savedCityButtonClickHandler);
    };
}

// The getCurrentWeather requests the current weather data to API.
const getCurrentWeather = function (cityname) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityname + '&appid=' + APIKey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    displayCurrentWeather(data);
                    storeCityToStorage(data.name);
                    displaySavedCityButton();

                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to OpenWeather');
        });
}

// The getFutureWeather function requests the weather data of the next 5 days to API.
const getFutureWeather = function (cityname) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityname + '&appid=' + APIKey;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
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

// The formSubmitHandler function calls the functions to get data from API.
const formSubmitHandler = function (event) {
    event.preventDefault();

    const city = cityInputEl.value.trim();

    if (city) {
        getCurrentWeather(city);
        getFutureWeather(city);

        cityInputEl.value = '';
    } else {
        alert('Please enter a correct name of city.')
    }
};

// The savedCityButtonClickHandler function calls the functions to get data from API.
const savedCityButtonClickHandler = function (event) {
    const savedCity = event.target.getAttribute('data-city');
    console.log(savedCity);

    if (savedCity) {
        getCurrentWeather(savedCity);
        getFutureWeather(savedCity);
    }
};

// The formSubmitHandler function is called when the form is submitted.
searchFormEl.addEventListener('submit', formSubmitHandler);

displaySavedCityButton();