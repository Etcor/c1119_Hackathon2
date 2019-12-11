class Display_result {
  constructor (elementConfig) {
    this.data = {};
    this.elementConfig = {
      searchButton: $(elementConfig.searchButton),
    };
    this.currentEventAddress = null;
    this.render = this.render.bind(this);
    this.getLocationData = this.getLocationData.bind(this);
    this.parseLocationData = this.parseLocationData.bind(this);
    this.getResultData = this.getResultData.bind(this);
    this.parseSuccessfulTicketMasterResponse = this.parseSuccessfulTicketMasterResponse.bind(this);
    this.handleTicketMasterError = this.handleTicketMasterError.bind(this);
    this.getAddressString = this.getAddressString.bind(this);
    this.getCurrentWeatherDataFromServer = this.getCurrentWeatherDataFromServer.bind(this);
    this.processGetServerWeatherData = this.processGetServerWeatherData.bind(this);
    this.processGetServerError = this.processGetServerError.bind(this);
  }

  addEventHandlers() {
    this.elementConfig.searchButton.on('click', this.getResultData);
  }

  getResultData() {
    var textInputField = $("#search-input").val();
    var ajaxConfig = {
      type: "GET",
      url: "https://app.ticketmaster.com/discovery/v2/events.json?size=3&apikey=RpWHpqTak6PwdixiLGSrrPsoBINm24CG",
      data: {
        keyword: textInputField
      },
      async: true,
      dataType: "json",
      success: this.parseSuccessfulTicketMasterResponse,
      error: this.handleTicketMasterError
    }
    $.ajax(ajaxConfig);
  }

  parseSuccessfulTicketMasterResponse(response) {
    var responseTarget = response._embedded.events;
    for(var index in responseTarget){
      this.data[index] = {
        eventName: responseTarget[index]['name'],
        venueName: responseTarget[index]._embedded.venues[0]['name'],
        eventDate: responseTarget[index].dates.start['dateTime'],
        eventCity: responseTarget[index]._embedded.venues[0].city['name'],
        eventState: responseTarget[index]._embedded.venues[0].state['name'],
        eventAddress: responseTarget[index]._embedded.venues[0].address['line1'],
        eventCountry: responseTarget[index]._embedded.venues[0].country['countryCode'],
        seatingChartLink: responseTarget[index].seatmap['staticUrl'],
        eventStartTime: responseTarget[index].dates.start['localTime'],
        eventInfo: responseTarget[index]['info']
      };
      var address = this.getAddressString(index);
      this.getLocationData(address, index);

    }
  }

  getAddressString(index) {
    var streetAddress = this.data[index].eventAddress;
    var streetAddressArray = streetAddress.split(' ');
    var addressToJoin = [
      this.data[index].eventCity + ',',
      this.data[index].eventState + ',',
      this.data[index].eventCountry
    ]
    for(var indexOfAddresses in addressToJoin) {
      streetAddressArray.push(addressToJoin[indexOfAddresses]);
    }
    return streetAddressArray.join('+');
  }

  handleTicketMasterError(error) {
    console.log(error);
  }

  getLocationData(address, index) {
    var ajaxConfigObject = {
      dataType: 'JSON',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyBgx2H6A2p6G-17WuFQ9s0UPutBhqWtxeQ',
      method: 'GET',
      success: res => this.parseLocationData(res, index),
      error: function (response) {
        console.log(response);
      }
    }
    $.ajax(ajaxConfigObject);
  }

  parseLocationData(response, index) {
    var coordinates = {
      lat: response.results[0].geometry.location.lat,
      lng: response.results[0].geometry.location.lng
    }
    this.data[index].coordinates = coordinates;
    this.render(index);
    this.getLocationInfo(index);
  }

  getCurrentWeatherDataFromServer(weather, index) {
    var key = "ba298869db4c59aadd8bdebcb3a3e02c";
    var ajaxConfigObject = {
      dataType: 'json',
      url: "http://api.openweathermap.org/data/2.5/weather?lat=" + weather.weatherData.lat + "&lon=" + weather.weatherData.lon + "&appid=" + key,
      method: 'GET',
      success: response => this.processGetServerWeatherData(response, weather, index),
      error: this.processGetServerError
    }
    $.ajax(ajaxConfigObject);
  }
  processGetServerWeatherData(response, weather, index) {
    console.log(response);
    var currentLocationName = response.name;
    var currentTemp = response.main.temp;
    var currentTempFahr = (currentTemp * (9 / 5) - 459.67).toFixed(0);
    var currentWeatherIcon = response.weather[0].icon + "@2x.png";
    var currentWeatherDescription = response.weather[0].description;
    $(".weather-title-"+index).text(currentLocationName);
    $(".weather-temp-"+index).text(currentTempFahr).append($("<span>").html("&#8457"));
    $(".weather-icon-"+index).attr("src", "http://openweathermap.org/img/wn/" + currentWeatherIcon);
    $(".weather-description-"+index).text(currentWeatherDescription);
  }

  processGetServerError(response) {
    console.log(response);
  }


  getLocationInfo(index){
    var latitude = this.data[index].coordinates.lat;
    var longitude = this.data[index].coordinates.lng;
    var mapParent = $('.' + index + ' .map-info');
    var weatherParent = $('.' + index + ' .weather-info');
    var map = new Event_Map(latitude, longitude, index, mapParent, 16);
    var weather = new Event_Weather_Current(latitude, longitude, weatherParent, index);
    map.render();
    weather.render();
    this.getCurrentWeatherDataFromServer(weather, index);
  }

  render(index) {
    var $weatherInfo = $('<div>').addClass('weather-info');
    var $mapInfo = $('<div>').addClass('map-info');
    var $locationInfo = $('<div>').addClass('location-info');
    $locationInfo.append($weatherInfo, $mapInfo);
    var $eventTitle = $('<div>').addClass('event-title');
    var $eventDescription = $('<div>').addClass('event-description');
    var $eventInfo = $('<div>').addClass('event-info');
    $eventInfo.append($eventTitle, $eventDescription);
    var $eventResult = $('<div>').addClass('result ' + index);
    $eventResult.append($eventInfo, $locationInfo);
    $('#search-result-container').append($eventResult);
  }
}
