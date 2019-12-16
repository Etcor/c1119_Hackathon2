
class Event_Weather_Current {
  constructor(lat, lng, parentElem, index) {
    this.weatherData = {
      lat: lat,
      lng: lng,
      index: index
    };
    this.parentElem = $(parentElem);
    this.domElements = {
      location_name: null,
      tempIconContainer: null,
      temp: null,
      icon: null,
      description: null
    };
    this.render = this.render.bind(this);
  }

  addResponseData(response) {
    this.weatherData.responseData = response;
  }

  render() {
    //Data from API Request
    let currentLocationName = this.weatherData.responseData.name;
    let currentTemp = this.weatherData.responseData.main.temp;
    let currentTempFahr = (currentTemp * (9 / 5) - 459.67).toFixed(0);
    let currentWeatherIcon = this.weatherData.responseData.weather[0].icon + "@2x.png";
    let currentWeatherDescription = this.weatherData.responseData.weather[0].description;
    let index = this.weatherData.index;
    //Render Elements
    this.domElements.location_name = $("<h1>").addClass("weather-location weather-location-" + index).text(currentLocationName);
    this.domElements.tempIconContainer = $("<div>").addClass("temp-and-icon-current weather-temp-and-icon-" + index);
    this.domElements.temp = $("<div>").addClass("temp-current weather-temp-" + index).text(currentTempFahr).append($("<span>").html("&#8457"));
    this.domElements.icon = $("<img>").addClass("icon-current weather-icon-" + index).attr("src", "http://openweathermap.org/img/wn/" + currentWeatherIcon);
    this.domElements.description = $("<h3>").addClass("weather-description weather-description-" + index).text(currentWeatherDescription);
    this.parentElem.append(
      this.domElements.location_name,
      this.domElements.tempIconContainer.append(
        this.domElements.temp,
        this.domElements.icon),
      this.domElements.description);

    if (currentTempFahr > 89) {
      $(".weather-temp-" + index).parent().parent().addClass("hot-temp");
    } else if (currentTempFahr < 55) {
      $(".weather-temp-" + index).parent().parent().addClass("cold-temp");
    }
  }

  // whichWeatherSwitch() {
  //   switch(weather) {
  //     case
  //   }
  // }

}
