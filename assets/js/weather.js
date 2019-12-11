
class Event_Weather_Current {
  constructor(lat, lon, parentElem, index) {
    this.weatherData = {
      lat: lat,
      lon: lon,
      index: index
    };
    this.parentElem = $(parentElem);
    this.domElements = {
      title: null,
      name: null,
      tempIconContainer: null,
      temp: null,
      icon: null,
      description: null
    };
    this.render = this.render.bind(this);
  }

  render() {
    this.domElements.title = $("<h1>").addClass("weather-title weather-title-"+this.weatherData.index).text("Current Weather");
    this.domElements.name = $("<h2>").addClass("weather-location-name weather-name-" + this.weatherData.index);
    this.domElements.tempIconContainer = $("<div>").addClass("temp-and-icon-current weather-temp-and-icon-" + this.weatherData.index);
    this.domElements.temp = $("<div>").addClass("temp-current weather-temp-" + this.weatherData.index);
    this.domElements.icon = $("<img>").addClass("icon-current weather-icon-" + this.weatherData.index);
    this.domElements.description = $("<h3>").addClass("weather-description weather-description-" + this.weatherData.index);

    this.parentElem.append(this.domElements.title, this.domElements.name, this.domElements.tempIconContainer.append(this.domElements.temp, this.domElements.icon), this.domElements.description);
  }
}
