//left sidebar elements
var searchbox = document.querySelector("#searchBox");
var submitButton = document.querySelector("#submitButton");
var cityList = document.querySelector("#cityList");
var fiveDay = document.querySelector("#fiveDay");
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

// Function for dumping the JSON content for each button into the div
function displayCityInfo() {
    // http://api.openweathermap.org/data/2.5/forecast/daily?q=Phoenix&cnt=6&units=imperial&appid=166a433c57516f51dfab1f7edaed8413
    // api.openweathermap.org/data/2.5/uvi?appid=b8e34f445d2a2fa271c223fa00bafb17&lat={lat}&lon={lon}

    fiveDayForecast();
}

function fiveDayForecast() {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&units=imperial&cnt=5&appid=166a433c57516f51dfab1f7edaed8413";
    var message = "";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        message = JSON.stringify(response);
        console.log(message);
        console.log(response.list[1].temp.max);
        for (let i = 0; i < 5; i++) {
            var card = document.createElement("div");
            card.setAttribute("class", "card cell small-2");
            card.setAttribute("id", "days");
            var cardSection = document.createElement("div");
            cardSection.setAttribute("class", "card-section");
            var date = document.createElement("h4");
            var icon = document.createElement("img");
            var temp = document.createElement("p");
            var humid = document.createElement("p");
            temp.textContent = `${response.list[i].temp.max}` + "&deg;";
            date.textContent = moment.unix(response.list[i].dt).format("YYYY/MM/DD");
            icon.src = `http://openweathermap.org/img/wn/${response["list"][i]["weather"][0]["icon"]}.png`;            temp.textContent = response.list[i].temp.max;
            humid.innerHTML = response.list[i].humidity +"%";
            fiveDay.appendChild(card);
            card.appendChild(cardSection);
            cardSection.appendChild(date);
            cardSection.appendChild(icon);
            console.log(temp.attributes);
            cardSection.appendChild(temp);
            var butt = document.createElement("span");
            butt.textContent = "butt"
            cardSection.appendChild(butt);
            cardSection.appendChild(humid);
            console.log(response.list[i].weather[0].icon);
            console.log(icon.src)
        }
        lon = response.city.coord.lon;
        lat = response.city.coord.lat;
        console.log(lon);
        console.log(lat);

        currentWeather();
        currentUV();
    });
}

function currentWeather() {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&appid=166a433c57516f51dfab1f7edaed8413";
    var message = "";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $("#currentTemp").text(response.main.temp);
        $("#currentHumidity").text(response.main.humidity);
        $("#currentWind").text(response.wind.speed);
        console.log(response);
    });
}
function currentUV() {
    var queryURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=166a433c57516f51dfab1f7edaed8413";
    var message = "";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        $("#currentUV").text(response.value);
        console.log(response);
    });
}
// Function for displaying movie data
function renderButtons() {

    // Deleting the buttons prior to adding new movies
    // (this is necessary otherwise you will have repeat buttons)
    $("#cityList").empty();
    console.log(cities);

    // Looping through the array of movies
    for (var i = 0; i < cities.length; i++) {

        // Then dynamically generating buttons for each movie in the array
        // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
        var a = $("<button>");
        // Adding a class of movie to our button
        a.addClass("city");
        a.addClass("button");
        // Adding a data-attribute
        a.attr("data-name", cities[i]);
        // Providing the initial button text
        a.text(cities[i]);
        // Adding the button to the buttons-view div
        $("#cityList").append(a);
    }
}

// This function handles events where one button is clicked
$("#submitButton").on("click", function (event) {
    event.preventDefault();

    // This line grabs the input from the textbox
    city = $("#searchBox").val().trim();

    // Adding the movie from the textbox to our array
    cities.push(city);
    console.log(cities);

    // Calling renderButtons which handles the processing of our movie array
    renderButtons();
    displayCityInfo();
    $("#searchBox").val("");
});

// Function for displaying the movie info
// Using $(document).on instead of $(".movie").on to add event listeners to dynamically generated elements
$(document).on("click", ".city", function () {
    city = $(this).attr("data-name");
    displayCityInfo();
});

// Calling the renderButtons function to display the initial buttons
renderButtons();