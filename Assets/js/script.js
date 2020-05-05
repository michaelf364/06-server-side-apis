//left sidebar elements
var searchbox = document.querySelector("#searchBox");
var submitButton = document.querySelector("#submitButton");
var cityList = document.querySelector("#cityList");

var currentCity = document.querySelector("#currentCity");
var currentDate = document.querySelector("#currentDate");
var currentStatus = document.querySelector("#currentStatus")

// Initial array of cities
var cities = [];

// Function for dumping the JSON content for each button into the div
function displayCityInfo() {
    // http://api.openweathermap.org/data/2.5/forecast/daily?q=Phoenix&cnt=6&units=imperial&appid=166a433c57516f51dfab1f7edaed8413
    // api.openweathermap.org/data/2.5/uvi?appid=b8e34f445d2a2fa271c223fa00bafb17&lat={lat}&lon={lon}
    var city = $(this).attr("data-name");
    var queryURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + city + "&units=imperial&cnt=5&appid=166a433c57516f51dfab1f7edaed8413";
    var message = "";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        message = JSON.stringify(response);
        console.log(message);
        
        var daytwoTemp = response.list[1].temp.max;
        $("#dayTwoTemp").html(daytwoTemp);
        console.log(response.list[1].temp.max);

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
    var city = $("#searchBox").val().trim();

    // Adding the movie from the textbox to our array
    cities.push(city);
    console.log(cities);

    // Calling renderButtons which handles the processing of our movie array
    renderButtons();
});

// Function for displaying the movie info
// Using $(document).on instead of $(".movie").on to add event listeners to dynamically generated elements
$(document).on("click", ".city", displayCityInfo);

// Calling the renderButtons function to display the initial buttons
renderButtons();