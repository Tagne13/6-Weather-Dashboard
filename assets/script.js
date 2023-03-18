$(document).ready(function () {
    // Search Variables
    const searchBtn = $('.searchBtn');
    const clearBtn = $('#clear-history');
    let searchCity = $('#search-city');
    let searchHistory = $('#search-history');
    var city = "";

    // Current Variables
    const cityHeader = $('#city-date');
    const cityIcon = $('#city-icon');
    const cityTemp = $('#city-temp');
    const cityWind = $('#city-wind');
    const cityHumidity = $('#city-humidity');

    // Date
    const todayDate = dayjs();

    // Functions

        // Find current Weather 
    function currentQueryURL() {
        var currentURL = "https://api.openweathermap.org/data/2.5/weather?";
        var APIKey = {"APPID": "c684f4a2d3c668932b65951d98472409"};

        APIKey.q = searchCity
            .val()
            .trim();
        return currentURL + $.param(APIKey);
    }

        // Generate content based on API response
    function findCurrentWeather(response) {
        // Weather icon details
        var weatherIcon = response.weather[0].icon;
        var weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
        var weatherIconDescrip = response.weather[0].description;
        // Convert temp to Fahrenheit
        var tempFar = (response.main.temp - 273.15) * 1.80 + 32;
        // City name
        city = response.name;
        // Current weather details
        cityHeader.text(`${city} (${todayDate.format("MM/DD/YYYY")})`);
        cityHeader.append(cityIcon.attr("src", weatherIconURL).attr("alt", `${weatherIconDescrip}`).attr("title", `${weatherIconDescrip}`));
        cityTemp.text(`Temperature: ${tempFar.toFixed(2)} ℉`);
        cityWind.text(`Wind Speed: ${response.wind.speed} MPH`);
        cityHumidity.text(`Humidity: ${response.main.humidity}%`);
    };
        // 5 Day Forecast
        var currentLat = response.coord.lat;
        var currentLong = response.coord.lon;
        var futureURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentLat}&lon=${currentLong}&exclude=current,minutely,hourly&appid=c684f4a2d3c668932b65`;
    $.ajax({
        url: futureURL,
        method: "GET"
    })
        .then(function (response) {
            $('.day').each(function (day) {
                day = day +1;
                var dayStatus = dayjs.unix(response.daily[day].dt).format("MM/DD/YYYY");
                var forecastIcon = response.daily[day].weather[0].icon;
                var forecastIconURL = `https://openweathermap.org/img/wn/${forecastIcon}.png`;
                var forecastIconDescrip = response.daily[day].weather[0].description;
                var forecastTempFar = (response.daily[day].temp.day - 273.15) * 1.80 + 32;
                var forecastWind = response.daily[day].wind.speed;
                var forecastHumidity = response.daily[day].humidity;
                $($(this)[0].children[0].children[0]).text(dayStatus);
                $($(this)[0].children[0].children[1]).children[0].attr("src", forecastIconURL).attr("alt", `${forecastIconDescrip}`).attr("title", `${forecastIconDescrip}`);
                $($(this)[0].children[0].children[2]).text(`Temp: ${forecastTempFar.toFixed(2)} ℉`);
                $($(this)[0].children[0].children[3]).text(`Wind Speed: ${forecastWind} MPH`);
                $($(this)[0].children[0].children[4]).text(`Humidity: ${forecastHumidity}%`);
            });
        })

        // Store search history
    function storeSearch(searchedCity) {
        localStorage.setItem("city" + localStorage.length, searchedCity);
    }

        // Add searched cities to searched display
    var storedSearchList = "";
    function displaySearch() {
        searchHistory.empty();
        for (var i = 0; i < localStorage.length; i++) {
            storedSearchList = localStorage.getItem("city" + i);
            var searchHistoryBtn = $("<button>").text(storedSearchList).addClass("btn btn-primary button-srch m-2").attr("type", "submit");
            searchHistory.append(searchHistoryBtn);
        }
    }

    // Event Listeners
    searchBtn.on("click", function (event) {
        event.preventDefault();
        storeSearch(searchTerm[0].value.trim());
        displaySearch();

        var queryURL = currentQueryURL();

        $ajax({
            url: queryURL,
            method: "GET"
        })
            .then(findCurrentWeather);
    });

    $(document).on("click", ".searchBtn", function () {
        var prevCity = $(this).text();
        storeSearch(prevCity);
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?appid=c684f4a2d3c668932b65951d9847&q=${prevCity}`,
            method: "GET"
        })
            .then(findCurrentWeather);
    });

    // Clear past searches
    clearBtn.on("click", function () {
        localStorage.clear();
        searchHistory.empty();
        location.reloard();
    });

    // Load default city or last search item
    $(window).on("load", function () {
        displaySearch();
        var lastCity = localStorage.getItem("city" + (localStorage.length - 1));
        var qurl = "";
        if (localStorage.length === 0) {
            qurl = "https://api.openweathermap.org/data/2.5/weather?appid=c684f4a2d3c668932b65951d98472409&q=Detroit";
        } else {
            qurl = "https://api.openweathermap.org/data/2.5/weather?appid=c684f4a2d3c668932b65951d98472409&q=${lastCity}";
        }
        $.ajax({
            url: qurl,
            method: "GET"
        })
            .then(findCurrentWeather);
    });
});
