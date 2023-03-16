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


    var APIKey = "c684f4a2d3c668932b65951d98472409";
    var currentURL = "https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API key}";
    var futureURL = "api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}";

    // Functions

        // Find current Weather 
    function currentQueryURL() {
        APIKey.q = searchCity
            .val()
            .trim();
        return currentURL + $.param(APIKey);
    }

        // Generate content based on API response
    function findCurrentWeather(response) {
        var weatherIcon = response.weather[0].icon;
        var weatherIconURL = `https://openweathermap.org/img/wn/${weatherIcon}.png`;
        var weatherIconDescrip = response.weather[0].description;
        var tempFar = (response.main.temp - 273.15) * 1.80 + 32;
        city = response.name;
        cityHeader.text(`${city} (${todayDate.format("MM/DD/YYYY")})`);
        cityHeader.append(cityIcon.attr("src", weatherIconURL).attr("alt", `${weatherIconDescrip}`).attr("title", `${weatherIconDescrip}`));
        cityTemp.text(`Temperature: ${tempFar.toFixed(2)} `);
        cityWind.text(`Wind Speed: ${response.wind.speed} MPH`);
        cityHumidity.text(`Humidity: ${response.main.humidity}%`);
    };
        // 5 Day Forecast

        // Store search history
    function storeSearch()

        // Add searched cities to searched display

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
