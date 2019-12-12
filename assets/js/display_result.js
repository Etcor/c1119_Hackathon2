class Display_result {
  constructor (elementConfig) {
    this.data = [];
    this.elementConfig = {
      searchButton: $(elementConfig.searchButton),
      searchInput: $(elementConfig.searchInput),
      searchContainer: $(elementConfig.searchContainer)
    };
    this.currentEventAddress = null;
    this.numberOfEvents = null;
    this.numberOfEventsCompleted = null;
    this.addEventHandlers();
  }

  addEventHandlers = () => {
    this.elementConfig.searchButton.on('click', this.getSearchResult);
    this.elementConfig.searchInput.on('click', this.clearInputField);
    this.elementConfig.searchInput.on('keypress', this.getSearchResultOnEnterKey);
  }

  getSearchResult = () => {
    var textInputField = this.elementConfig.searchInput.val();
    if(!textInputField) {
      this.handleBadKeyword();
      return;
    }

    var ajaxConfig = {
      type: "GET",
      url: "https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=RpWHpqTak6PwdixiLGSrrPsoBINm24CG"+ '&sort=date,asc',
      data: {
        keyword: textInputField
      },
      async: true,
      dataType: "json",
      success: this.handleSuccessfulSearchResult,
      error: this.handleSearchError
    }
    $.ajax(ajaxConfig);
  }

  getSearchResultOnEnterKey = event => {
    if (event.keyCode == 13) {
      this.getSearchResult();
    }
  }

  handleBadKeyword = () => {
    this.elementConfig.searchInput.addClass('keyword-error');
    this.elementConfig.searchButton.addClass('btn-error');
    $('.fas').removeClass('fa-arrow-right').addClass('fa-times');
    this.elementConfig.searchInput.val('').attr('placeholder', 'Error: No events exist by that name');
  }

  clearInputField = () => {
    this.elementConfig.searchInput.removeClass('keyword-error');
    this.elementConfig.searchButton.removeClass('btn-error');
    $('.fas').addClass('fa-arrow-right').removeClass('fa-times');
    this.elementConfig.searchInput.attr('placeholder', 'Enter Your Event');
    this.elementConfig.searchInput.focus().select()
  }

  handleSuccessfulSearchResult = response => {
    if (!response._embedded) {
      this.handleBadKeyword();
      return;
    }
    $('.landing-page').addClass('hidden');
    $('.result').remove();
    $('.content-loading').removeClass('hidden');

    this.data = [];
    var responseTarget = response._embedded.events;
    for(var searchResultIndex in responseTarget){
      this.data[searchResultIndex] = {
        eventName: responseTarget[searchResultIndex]['name'],
        venueName: responseTarget[searchResultIndex]._embedded.venues[0]['name'],
        eventDate: responseTarget[searchResultIndex].dates.start['localDate'],
        eventCity: responseTarget[searchResultIndex]._embedded.venues[0].city['name'],
        eventAddress: responseTarget[searchResultIndex]._embedded.venues[0].address['line1'],
        eventCountry: responseTarget[searchResultIndex]._embedded.venues[0].country['countryCode'],
        seatingChartLink: responseTarget[searchResultIndex].seatmap['staticUrl'],
        eventStartTime: responseTarget[searchResultIndex].dates.start['localTime'],
        eventInfo: responseTarget[searchResultIndex]['info'],
        ticketLink: responseTarget[searchResultIndex]['url'],
        twentyFourHourTime: responseTarget[searchResultIndex].dates.start['localTime']
      };
      this.numberOfEvents++;
      var address = this.getAddressForGeolocation(searchResultIndex);
      this.getLocationData(address, searchResultIndex);
    }
  }

  handleSearchError = error => console.log(error);

  getAddressForGeolocation = index => {
    /*This function parses event location information from TicketMaster's API and
    converts it into a specific string that the google geolocation API requires to return
    coordinates.*/
    let streetAddressArray = this.data[index].eventAddress.split(' ');
    let addressToJoin = [
      ...streetAddressArray,
      this.data[index].eventCity,
      this.data[index].eventCountry
    ];
    return addressToJoin.join('+');
  }

  getLocationData = (address, index) => {
    var ajaxConfigObject = {
      dataType: 'JSON',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyBgx2H6A2p6G-17WuFQ9s0UPutBhqWtxeQ',
      method: 'GET',
      success: res => this.parseLocationData(res, index),
      error: this.handleLocationDataError
    }
    $.ajax(ajaxConfigObject);
  }

  handleLocationDataError = (response) => console.log(response);

  parseLocationData = (response, resultReceived) => {
    let { results: { [0]: { geometry: { location } } } }  = response;
    let coordinates = {
      lat: location.lat,
      lng: location.lng
    }
    this.data[resultReceived].coordinates = coordinates;
    this.numberOfEventsCompleted++;
    let allRequestsCompleted = this.numberOfEvents === this.numberOfEventsCompleted;
    if(allRequestsCompleted) {
      for(let indexInDataToRender = 0; indexInDataToRender < this.data.length; indexInDataToRender++) {
        this.render(indexInDataToRender);
        this.getLocationWeatherAndMap(indexInDataToRender);
      }
    }
  }

  getLocationWeatherAndMap = index => {
    let latitude = this.data[index].coordinates.lat;
    let longitude = this.data[index].coordinates.lng;
    let mapParent = $('.' + index + ' .map-info');
    let weatherParent = $('.' + index + ' .weather-info');
    let map = new Event_Map(latitude, longitude, index, mapParent, 16);
    let weather = new Event_Weather_Current(latitude, longitude, weatherParent, index);
    map.render();
    weather.render();
    this.getCurrentWeatherData(weather, index);
  }

  getCurrentWeatherData = (weather, index) => {
    var key = "ba298869db4c59aadd8bdebcb3a3e02c";
    var ajaxConfigObject = {
      dataType: 'json',
      url: "http://api.openweathermap.org/data/2.5/weather?lat=" + weather.weatherData.lat + "&lon=" + weather.weatherData.lng + "&appid=" + key,
      method: 'GET',
      success: response => this.processWeatherData(response, weather, index),
      error: this.processWeatherDataError
    }
    $.ajax(ajaxConfigObject);
  }

  processWeatherData = (response, weather, index) => {
    var currentLocationName = response.name;
    var currentTemp = response.main.temp;
    var currentTempFahr = (currentTemp * (9 / 5) - 459.67).toFixed(0);
    var currentWeatherIcon = response.weather[0].icon + "@2x.png";
    var currentWeatherDescription = response.weather[0].description;
    if (currentTempFahr > 89) {
      $(".weather-temp-"+index).parent().parent().addClass("hot-temp");
    } else if (currentTempFahr < 55) {
      $(".weather-temp-"+index).parent().parent().addClass("cold-temp");
    }
    $(".weather-title-"+index).text(currentLocationName);
    $(".weather-temp-"+index).text(currentTempFahr).append($("<span>").html("&#8457"));
    $(".weather-icon-"+index).attr("src", "http://openweathermap.org/img/wn/" + currentWeatherIcon);
    $(".weather-description-"+index).text(currentWeatherDescription);
  }

  processWeatherDataError = response => console.log(response);

  render = index => {
    var $weatherInfo = $('<div>').addClass('weather-info');
    var $mapInfo = $('<div>').addClass('map-info');
    var $locationInfo = $('<div>').addClass('location-info');
    var $pTagVenue = $('<p>').text(this.data[index].venueName);
    var $pTagDate = $('<p>').text(this.data[index].eventDate);
    var $pTagTime = $('<p>').text(this.data[index].eventStartTime);
    var $aTagSeatingChart = $('<a>').text('Click For Seating Chart!').attr({
      href: this.data[index].seatingChartLink,
      target: '_blank'
    });
    var $aTagTicketLink = $('<a>').text('Buy Tickets Now!').attr({
      href: this.data[index].ticketLink,
      target: '_blank'
    });
    var $eventTitle = $('<div>').addClass('event-title').text(this.data[index].eventName);
    var $eventDescription = $('<div>').addClass('event-description');
    var $eventInfo = $('<div>').addClass('event-info');
    var $eventResult = $('<div>').addClass('result ' + index);
    $locationInfo.append($weatherInfo, $mapInfo);
    $eventDescription.append(
      $pTagVenue,
      $pTagDate,
      $pTagTime,
      $aTagSeatingChart,
      $aTagTicketLink
    );
    $eventInfo.append($eventTitle, $eventDescription);
    $eventResult.append($eventInfo, $locationInfo);
    this.elementConfig.searchContainer.append($eventResult);
    $('.content-loading').addClass('hidden');
  }
}
