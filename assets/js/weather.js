
class Event_Weather_Current {
  constructor(lat, lon, parentElem) {
    this.weatherData = {
      lat: lat,
      lon: lon
    };
    this.parentElem = $(parentElem);
    this.domElements = {
      title: null,
      tempIconContainer: null,
      temp: null,
      icon: null,
      description: null
    };
    this.render = this.render.bind(this);
  }

  render() {
    this.domElements.title = $("<h2>").addClass("weather-title");
    this.domElements.tempIconContainer = $("<div>").addClass("temp-and-icon-current");
    this.domElements.temp = $("<div>").addClass("temp-current");
    this.domElements.icon = $("<img>").addClass("icon-current");
    this.domElements.description = $("<h3>").addClass("weather-description");

    this.parentElem.append(this.domElements.title, this.domElements.tempIconContainer.append(this.domElements.temp, this.domElements.icon), this.domElements.description);
    // return this.parentElem;
  }
}