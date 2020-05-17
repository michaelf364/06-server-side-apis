//left sidebar elements
var searchbox = document.querySelector("#searchBox");
var submitButton = document.querySelector("#submitButton");
var cityList = document.querySelector("#cityList");
var fiveDay = document.querySelector("#fiveDay");
var city = "";
var lat = 0;
var lon = 0;
var currentCity = document.querySelector("#currentCity");
var currentTemp = document.querySelector("#currentTemp");
var currentHumidity = document.querySelector("#currentHumidity");

// Initial array of cities
var cities = [];


function initialize() {
    loadStorage();
    renderButtons();
}

function fiveDayForecast() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&units=imperial&cnt=5&appid=166a433c57516f51dfab1f7edaed8413";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        for (var day of response.list) {
            var card = document.createElement("div");
            card.setAttribute("class", "card cell small-2");
            card.setAttribute("id", "days");
            var cardSection = document.createElement("div");
            cardSection.setAttribute("class", "card-section");
            var date = document.createElement("h4");
            var icon = document.createElement("img");
            var temp = document.createElement("p");
            var humid = document.createElement("p");
            temp.innerHTML = `${day.temp.max}&deg;F`;
            date.textContent = moment.unix(day.dt).format("YYYY/MM/DD");
            icon.src = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;
            humid.innerHTML = `${day.humidity}%`;
            fiveDay.appendChild(card);
            card.appendChild(cardSection);
            cardSection.appendChild(date);
            cardSection.appendChild(icon);
            cardSection.appendChild(temp);
            cardSection.appendChild(humid);
        }
        lon = response.city.coord.lon;
        lat = response.city.coord.lat;
        currentWeather();
        currentUV();
    });
}

//api for current weather
function currentWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=166a433c57516f51dfab1f7edaed8413";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $("#currentTemp").text(response.main.temp + "ºF");
        $("#currentHumidity").text(response.main.humidity + "%");
        $("#currentWind").text(response.wind.speed + " mph");
        var currentDate = $("<h3>");
        currentDate.attr("id", "currentDate");
        currentDate.text(moment.unix(response.dt).format("YYYY/MM/DD"));
        var currentStatus = $("<img>");
        currentStatus.attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png");
        $("#currentDate").append(currentStatus);
        $("#currentCity").append(currentDate);
        console.log(response.weather[0].icon);
    });
}

//api for current UV
function currentUV() {
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=166a433c57516f51dfab1f7edaed8413";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $("#currentUV").text(response.value);
        $("#currentUV").css("color", "white");
        $("#currentUV").css("padding", "5");
        if (response.value > 11) {
            $("#currentUV").css("background", "purple");
        } else if (response.value > 7) {
            $("#currentUV").css("background", "red");
        } else if (response.value > 5) {
            $("#currentUV").css("background", "orange");
        } else if (response.value > 2) {
            $("#currentUV").css("background", "yellow");
        } else {
            $("#currentUV").css("background", "green");
        }
        console.log(response);
    });
}
// loads from local storage
function loadStorage() {
    var storage = JSON.parse(localStorage.getItem("citiesList"));
    if (storage !== null) {
        cities = storage;
    }
}

function renderButtons() {
    for (var i = 0; i < cities.length; i++) {
        var a = $("<button>");
        a.addClass("city hollow button ");
        a.attr("data-name", cities[i]);
        a.text(cities[i]);
        $("#cityList").append(a);
    }
}

$("#submitButton").on("click", function (event) {
    event.preventDefault();
    fiveDay.innerHTML = "";
    city = $("#searchBox").val().trim();
    currentCity.innerHTML = city;
    cities.push(city);
    localStorage.setItem("citiesList", JSON.stringify(cities));
    renderButtons();
    fiveDayForecast();

    $("#searchBox").val("");
});

// Function for displaying the movie info
// Using $(document).on instead of $(".movie").on to add event listeners to dynamically generated elements
$(document).on("click", ".city", function () {
    fiveDay.innerHTML = "";
    city = $(this).attr("data-name");
    currentCity.innerHTML = city;
    fiveDayForecast();
});

