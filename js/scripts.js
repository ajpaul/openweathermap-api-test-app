$(function() {

    const _appId = "e76be248a911350f102453b6f1c2afc5";

    setupForecastClick();
    getWeather();

    ////////////////////////////////////////////////////////////

    function setupForecastClick() {
        $(".forecast-button").click(function() {
            
            if(this.dataset.modal === "ON"){
                this.dataset.modal = "OFF"
                $(this).html("Forecast");
                $(this).prev().slideUp();
            }
            else {
                this.dataset.modal = "ON"
                $(this).html("Close Forecast");

                if (this.dataset.forecast === "NO"){
                    this.dataset.forecast = "YES"; //prevent unnecessary api calls if clicked more than once
                    getForecast(this.dataset.cityId, this.dataset.cityName, this);
                }
                else
                    $(this).prev().slideDown();
            }
        });
    }

    //get the current weather for my 5 cities
    function getWeather() {

        $.ajax({
        method: "GET",
        url: "http://api.openweathermap.org/data/2.5/group?id=2650225,6544881,3027301,3108877,2950159&units=metric&appid=" + _appId,
        })
        .done(function( data ) {
            $(".loader").slideUp().fadeOut();

            console.log("Successfully retrieved city data.");

            buildCityCards(data);
        });

    }

    //get the forecast for the clicked city. It appears that the API returns a list of 3 hour blocks
    //of weather forecasts so I'm just going to read the first one.
    function getForecast(cityId, cityClass, thisRef) {

        $.ajax({
            method: "GET",
            url: "http://api.openweathermap.org/data/2.5/forecast?id=" + cityId + "&appid=" + _appId,
        })
        .done(function( msg ) {
            $(cityClass + " .forecast-text").text(msg.list[0].weather[0].main);
            $(cityClass + " .forecast-icon").html("<img src='http://openweathermap.org/img/w/" + msg.list[0].weather[0].icon + ".png' alt='Icon depicting current weather.'>");
            $(thisRef).prev().slideDown();
        });

    }

    //build our cards. If I was allowed to use ES6 (Angular2/Aurelia) I would've made this a simple
    //repeater and it would've been much more lean, both in the JS and HTML
    function buildCityCards(data) {

        setWind(data.list);
        setTemps(data.list);
        setIcons(data.list);

        $(".cards").animate({ opacity: 1 }, { queue: false, duration: 'slow' });
    }

    function setWind(data) {

        $(".edinburgh .wind").html("Current wind: " + data[0].wind.speed + " m/s");
        $(".amsterdam .wind").html("Current wind: " + data[1].wind.speed + " m/s");
        $(".chamonix .wind").html("Current wind: " + data[2].wind.speed + " m/s");
        $(".sitges .wind").html("Current wind: " + data[3].wind.speed + " m/s");
        $(".berlin .wind").html("Current wind: " + data[4].wind.speed + " m/s");
    }

    function setTemps(data) {

        $(".edinburgh .temp").html(Math.round(data[0].main.temp) + "° C");
        $(".amsterdam .temp").html(Math.round(data[1].main.temp) + "° C");
        $(".chamonix .temp").html(Math.round(data[2].main.temp) + "° C");
        $(".sitges .temp").html(Math.round(data[3].main.temp) + "° C");
        $(".berlin .temp").html(Math.round(data[4].main.temp) + "° C");
    }

    function setIcons(data) {

        $(".edinburgh .icon").html("<img src='http://openweathermap.org/img/w/" + data[0].weather[0].icon + ".png' alt='Icon depicting current weather.'>");
        $(".amsterdam .icon").html("<img src='http://openweathermap.org/img/w/" + data[1].weather[0].icon + ".png' alt='Icon depicting current weather.'>");
        $(".chamonix .icon").html("<img src='http://openweathermap.org/img/w/" + data[2].weather[0].icon + ".png' alt='Icon depicting current weather.'>");
        $(".sitges .icon").html("<img src='http://openweathermap.org/img/w/" + data[3].weather[0].icon + ".png' alt='Icon depicting current weather.'>");
        $(".berlin .icon").html("<img src='http://openweathermap.org/img/w/" + data[4].weather[0].icon + ".png' alt='Icon depicting current weather.'>");
    }

});