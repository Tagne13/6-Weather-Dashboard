$(document).ready(function () {
    // Search Variables
    const searchBtn = $("#searchBtn");
    const clearBtn = $("#clear-history");
    var searchCity = $("#city");
    var searchHistory = $("#search-history");
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
        // API URL
        var currentURL = `https://api.openweathermap.org/data/2.5/weather?`;

        // Build object for API call
        var APIKey = { "APPID": "f3e794b6f19299364c3a368c93f4e895" };

        // Search term
        APIKey.q = searchCity
            .val()
            .trim();

        // Generate URL
        return currentURL + $.param(APIKey);
    }

    // Generate page content based on API response
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
        // 5 Day Forecast
        var currentLat = response.coord.lat;
        var currentLong = response.coord.lon;
        var futureURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentLat}&lon=${currentLong}&exclude=current,minutely,hourly&appid=f3e794b6f19299364c3a368c93f4e895`;

        // AJAX for current 5-day forecase
        $.ajax({
            url: futureURL,
            method: "GET"
        })
            .then(function (response) {
                $(".day").each(function (day) {
                    var day = day + 1
                    $(this).html("")
                    // Forecast date
                    var dayStatus = dayjs.unix(response.daily[day].dt).format("MM/DD/YYYY");
                    // Weather icon details
                    var forecastIcon = response.daily[day].weather[0].icon;
                    var forecastIconURL = `https://openweathermap.org/img/wn/${forecastIcon}.png`;
                    var forecastIconDescrip = response.daily[day].weather[0].description;
                    // Temperature; converted to Fahrenheit
                    var forecastTempFar = ((response.daily[day].temp.day - 273.15) * 1.80 + 32).toFixed(2);
                    // Wind speed
                    var forecastWind = response.daily[day].wind_speed;
                    // Humidity
                    var forecastHumidity = response.daily[day].humidity;
                    // Fill out forecast
                    // console.log(dayStatus, forecastIcon, forecastIconURL, forecastIconDescrip, forecastTempFar, forecastWind, forecastHumidity);
                    var newDiv = $("<div>").attr("class", "day-body border-left border-bottom border-dark p-2");
                    var newDate = $("<h5>").attr("class", "day-date").text(dayStatus);
                    var newIcon = $("<p>").attr("class", "day-icon").html("<img class='weather-icon' src=" + forecastIconURL + " />");
                    var newTemp = $("<p>").attr("class", "day-temp").text(`Temperature: ` + forecastTempFar + `℉`);
                    var newWind = $("<p>").attr("class", "day-wind").text(`Wind Speed: ` + forecastWind +  `MPH`);
                    var newHumidity = $("<p>").attr("class", "day-humidity").text(`Humidity: ` + forecastHumidity + `%`);

                    newDiv.append(newDate, newIcon, newTemp, newWind, newHumidity)

                    $(this).append(newDiv)
                });
            })
    };

    // Store search history
    function storeSearch(searchedCity) {
        localStorage.setItem("city" + localStorage.length, searchedCity);
    }

    // Add searched cities to searched display
    var storedSearchList = "";
    function displaySearch() {
        searchHistory.empty();
        // Create a button for each searched city
        for (var i = 0; i < localStorage.length; i++) {
            storedSearchList = localStorage.getItem("city" + i);
            var searchHistoryBtn = $("<button>").text(storedSearchList).addClass("btn btn-primary button-search m-2").attr("type", "submit");
            searchHistory.append(searchHistoryBtn);
        }
    }

    // Event Listeners
    searchBtn.on("click", function (event) {
        event.preventDefault();
        var searchTerm = $("#city").val()
        storeSearch(searchTerm);
        displaySearch();

        var queryURL = currentQueryURL();

        $.ajax({
            url: queryURL,
            method: "GET"
        })
            .then(findCurrentWeather);
    });

    $(document).on("click", ".button-search", function () {
        var prevCity = $(this).text();
        storeSearch(prevCity);
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?appid=f3e794b6f19299364c3a368c93f4e895&q=${prevCity}`,
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
    displaySearch();
    var lastCity = localStorage.getItem("city" + (localStorage.length - 1));
    var qurl = "";
    if (localStorage.length === 0) {
        qurl = `https://api.openweathermap.org/data/2.5/weather?appid=f3e794b6f19299364c3a368c93f4e895&q=Detroit`;
    } else {
        qurl = `https://api.openweathermap.org/data/2.5/weather?appid=f3e794b6f19299364c3a368c93f4e895&q=${lastCity}`;
    }
    $.ajax({
        url: qurl,
        method: "GET"
    })
        .then(findCurrentWeather);

});
