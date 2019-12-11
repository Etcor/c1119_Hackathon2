$(document).ready(initApp);

function initApp(){
 $('.makeMap').on('click', makeMap);
}

var parent = $('.ph-event-name .map-info');
var makinMaps = new Event_Map(33.634870, -117.740450, 'learning-fuze', parent, 16);

var test = new Display_result({
  searchButton: $('#search-button')
});
test.addEventHandlers();

var parentElem = $(".ph-event-name .weather-info");
var gettinWeather = new Event_Weather_Current(33.634870, -117.740450, parentElem);
function getCurrentWeatherDataFromServer() {
  var key = "ba298869db4c59aadd8bdebcb3a3e02c";
  var ajaxConfigObject = {
    dataType: 'json',
    url: "http://api.openweathermap.org/data/2.5/weather?lat="+gettinWeather.weatherData.lat+"&lon="+gettinWeather.weatherData.lon+"&appid="+key,
    method: 'GET',
    success: this.processGetServerWeatherData,
    error: this.processGetServerError
  }
  $.ajax(ajaxConfigObject);
}
function processGetServerWeatherData(response) {
  console.log(response);
  gettinWeather.render();
  var currentLocationName = response.name;
  var currentTemp = response.main.temp;
  var currentTempFahr = (currentTemp * (9/5) - 459.67).toFixed(0);
  var currentWeatherIcon = response.weather[0].icon + "@2x.png";
  var currentWeatherDescription = response.weather[0].description;
  $(".weather-location-name").text(currentLocationName);
  $(".temp-current").text(currentTempFahr).append($("<span>").html("&#8457"));
  $(".icon-current").attr("src", "http://openweathermap.org/img/wn/"+currentWeatherIcon);
  $(".weather-description").text(currentWeatherDescription);
}

function processGetServerError(response) {
  console.log(response);
}

function makeMap(){
 makinMaps.render();
}
