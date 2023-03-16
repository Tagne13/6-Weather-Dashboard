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

        // Current Weather 

        // Generate content based on API response

        // 5 Day Forecast

        // Store search history

        // Add searched cities to searched display

    // Event Listeners

    // Clear past searches
    clearBtn.on("click", function () {
        localStorage.clear();
        searchHistory.empty();
        location.reloard();
    });

    // Load default city or last search item

});
