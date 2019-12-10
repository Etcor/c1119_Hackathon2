
class Event_Weather {
  constructor(lat, lon) {
    this.weatherData = {
      lat: lat,
      lon: lon
    };
    this.domElements = {
      container = null;
      title = null;
      temp = null;
      icon = null;
      description = null;
    };
    this.render = this.render.bind(this);
  }

  render() {
    this.domElements.container = $("<div>").addClass("weather-info");
    this.domElements.title
    this.domElements.temp
    this.domElements.icon
    this.domElements.description
  }
}

// class Instantiate_Weather {
//   constructor() {

//   }
// }
