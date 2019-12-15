
class Event_Weather_Current {
  constructor(lat, lng, parentElem, index) {
    this.weatherData = {
      lat: lat,
      lng: lng,
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
    this.parentElem.append(
      this.domElements.title,
      this.domElements.name,
      this.domElements.tempIconContainer.append(
        this.domElements.temp,
        this.domElements.icon),
      this.domElements.description);
  }

//   <body class="back-row-toggle splat-toggle">
//   <div class="rain front-row"></div>
//   <div class="rain back-row"></div>
//   <div class="toggles">
//     <div class="splat-toggle toggle active">SPLAT</div>
//     <div class="back-row-toggle toggle active">BACK<br>ROW</div>
//       <div class="single-toggle toggle">SINGLE</div>
//     </div>
// </body>

/**
*  html {
*    height: 100 %;
*  }
*
*
*  body {
*    height: 100 %;
*    margin: 0;
*    overflow: hidden;
*    background: linear - gradient(to bottom, #202020, #111119);
*  }
*
*  .rain {
*    position: absolute;
*    left: 0;
*    width: 100 %;
*    height: 100 %;
*    z - index: 2;
*  }
*
*  .rain.back - row {
*    display: none;
*    z - index: 1;
*    bottom: 60px;
*    opacity: 0.5;
*  }
*
*  body.back - row - toggle.rain.back - row {
*    display: block;
*  }
*
*  .drop {
*    position: absolute;
*    bottom: 100 %;
*    width: 15px;
*    height: 120px;
*    pointer - events: none;
*    animation: drop 0.5s linear infinite;
*  }
*
*  @keyframes drop {
*    0 % {
*      transform: translateY(0vh);
*    }
*    75 % {
*      transform: translateY(90vh);
*    }
*    100 % {
*      transform: translateY(90vh);
*    }
*  }
*
*  .stem {
*    width: 1px;
*    height: 60 %;
*    margin - left: 7px;
*    background: linear - gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.25));
*    animation: stem 0.5s linear infinite;
*  }
*
*  @keyframes stem {
*    0 % {
*      opacity: 1;
*    }
*    65 % {
*      opacity: 1;
*    }
*    75 % {
*      opacity: 0;
*    }
*    100 % {
*      opacity: 0;
*    }
*  }
*
*  .splat {
*    width: 15px;
*    height: 10px;
*    border - top: 2px dotted rgba(255, 255, 255, 0.5);
*    border - radius: 50 %;
*    opacity: 1;
*    transform: scale(0);
*    animation: splat 0.5s linear infinite;
*    display: none;
*  }
*
*  body.splat - toggle.splat {
*    display: block;
*  }
*
*  @keyframes splat {
*    0 % {
*      opacity: 1;
*      transform: scale(0);
*    }
*    80 % {
*      opacity: 1;
*      transform: scale(0);
*    }
*    90 % {
*      opacity: 0.5;
*      transform: scale(1);
*    }
*    100 % {
*      opacity: 0;
*      transform: scale(1.5);
*    }
*  }
*
*  .toggles {
*    position: absolute;
*    top: 0;
*    left: 0;
*    z - index: 3;
*  }
*
*  .toggle {
*    position: absolute;
*    left: 20px;
*    width: 50px;
*    height: 50px;
*    line - height: 51px;
*    box - sizing: border - box;
*    text - align: center;
*    font - family: sans - serif;
*    font - size: 10px;
*    font - weight: bold;
*    background - color: rgba(255, 255, 255, 0.2);
*    color: rgba(0, 0, 0, 0.5);
*    border - radius: 50 %;
*    cursor: pointer;
*    transition: background - color 0.3s;
*  }
*
*  .toggle: hover {
*    background - color: rgba(255, 255, 255, 0.25);
*  }
*
*  .toggle: active {
*    background - color: rgba(255, 255, 255, 0.3);
*  }
*
*  .toggle.active {
*    background - color: rgba(255, 255, 255, 0.4);
*  }
*
*  .splat - toggle {
*    top: 20px;
*  }
*
*  .back - row - toggle {
*    top: 90px;
*    line - height: 12px;
*    padding - top: 14px;
*  }
*
*  .single - toggle {
*    top: 160px;
*  }
*
*  body.single - toggle.drop {
*    display: none;
*  }
*
*  body.single - toggle.drop: nth - child(10) {
*    display: block;
*  }
**/
}
