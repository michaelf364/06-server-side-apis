//left sidebar elements
var searchbox = document.querySelector("#searchBox");
var submitButton = document.querySelector("#submitButton");
var cityList = document.querySelector("#cityList");
var fiveDay = document.querySelector("#fiveDay");
var citiesList = localStorage.getItem("citiesList")
var city = "";
var lat = 0;
var lon = 0;
var currentCity = document.querySelector("#currentCity");
var currentDate = document.querySelector("#currentDate");
var currentStatus = document.querySelector("#currentStatus");
var currentTemp = document.querySelector("#currentTemp");
var currentHumidity = document.querySelector("#currentHumidity");

// Initial array of cities
var cities = [];


function initialize() {
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

function currentWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=166a433c57516f51dfab1f7edaed8413";
    var message = "";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $("#currentTemp").text(response.main.temp + "ºF");
        $("#currentHumidity").text(response.main.humidity + "%");
        $("#currentWind").text(response.wind.speed + " mph");
        $("#currentDate").text(moment.unix(response.dt).format("YYYY/MM/DD"));
        console.log(response.dt);
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
        if (response.value > 11) {
            $("#currentUV").css("background", "purple");
        }else if (response.value > 7) {
            $("#currentUV").css("background", "red");
        } else if(response.value > 5) {
            $("#currentUV").css("background", "orange");
        }else if(response.value > 2) {
            $("#currentUV").css("background", "yellow");
        }else {
            $("#currentUV").css("background", "green");
        }
        console.log(response);
    });
}

function renderButtons() {
    $("#citiesList").empty();
    localStorage.getItem("citiesList");
    for (var i = 0; i < cities.length; i++) {
        var li = $("<li>");
        var a = $("<button>");
        li.attr("id", "li");
        a.addClass("city hollow button ");
        a.attr("data-name", cities[i]);
        a.text(cities[i]);
        $("#li").append(a)
        $("#cityList").append(li);
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

