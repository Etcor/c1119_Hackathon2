class Display_result {
  constructor(elementConfig) {
    this.data = [];
    this.elementConfig = {
      searchButton: $(elementConfig.searchButton),
      searchInput: $(elementConfig.searchInput),
      searchContainer: $(elementConfig.searchContainer)
    };
    this.currentEventAddress = null;
    this.numberOfEvents = null;
    this.numberOfEventsCompleted = null;
    this.darkMode = false;

    this.getSearchResult = this.getSearchResult.bind(this);
    this.getSearchResultOnEnterKey = this.getSearchResultOnEnterKey.bind(this);
    this.clearInputField = this.clearInputField.bind(this);
    this.handleSuccessfulSearchResult = this.handleSuccessfulSearchResult.bind(this);
    this.getAddressForGeolocation = this.getAddressForGeolocation.bind(this);
    this.returnHome = this.returnHome.bind(this);
    this.activateDarkMode = this.activateDarkMode.bind(this);
    this.render = this.render.bind(this);
  }

  addEventHandlers() {
    this.elementConfig.searchButton.on('click', this.getSearchResult);
    this.elementConfig.searchInput.on('click', this.clearInputField);
    this.elementConfig.searchInput.on('keypress', this.getSearchResultOnEnterKey);
    $('.home-btn').on('click', this.returnHome);
    $('.darkmode-btn').on('click', this.activateDarkMode);
  }

  getSearchResult() {
    var textInputField = this.elementConfig.searchInput.val();
    if (!textInputField) {
      this.handleBadKeyword();
      return;
    }

    var ajaxConfig = {
      type: "GET",
      url: "https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=RpWHpqTak6PwdixiLGSrrPsoBINm24CG" + '&sort=date,asc',
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

  getSearchResultOnEnterKey(event) {
    if (event.keyCode == 13) {
      this.getSearchResult();
    }
  }

  handleBadKeyword() {
    this.elementConfig.searchInput.addClass('keyword-error');
    this.elementConfig.searchButton.addClass('btn-error');
    $('.fa-arrow-right')
      .removeClass('fa-arrow-right')
      .addClass('fa-times');
    this.elementConfig.searchInput.val('').attr('placeholder', 'Error: No events exist by that name');
  }

  clearInputField() {
    this.elementConfig.searchInput.removeClass('keyword-error');
    this.elementConfig.searchButton.removeClass('btn-error');
    $('.fa-times')
      .addClass('fa-arrow-right')
      .removeClass('fa-times');
    this.elementConfig.searchInput.attr('placeholder', 'Enter Your Event');
    this.elementConfig.searchInput.focus().select()
  }

  handleSuccessfulSearchResult(response) {
    if (!response._embedded) {
      this.handleBadKeyword();
      return;
    }
    this.data = [];

    $('.landing-page').addClass('hidden');
    $('.result').remove();
    $('.content-loading').removeClass('hidden');

    var responseTarget = response._embedded.events;
    for (var searchResultIndex in responseTarget) {
      this.data[searchResultIndex] = {
        eventName: responseTarget[searchResultIndex]['name'],
        venueName: responseTarget[searchResultIndex]._embedded.venues[0]['name'],
        eventDate: responseTarget[searchResultIndex].dates.start['localDate'],
        eventCity: responseTarget[searchResultIndex]._embedded.venues[0].city['name'],
        eventAddress: responseTarget[searchResultIndex]._embedded.venues[0].address['line1'],
        eventCountry: responseTarget[searchResultIndex]._embedded.venues[0].country['countryCode'],
        eventStartTime: responseTarget[searchResultIndex].dates.start['localTime'],
        eventInfo: responseTarget[searchResultIndex]['info'],
        ticketLink: responseTarget[searchResultIndex]['url'],
        twentyFourHourTime: responseTarget[searchResultIndex].dates.start['localTime']
      };
      if (responseTarget[searchResultIndex].seatmap && responseTarget[searchResultIndex].seatmap['staticUrl']) {
        this.data[searchResultIndex].seatingChartLink = responseTarget[searchResultIndex].seatmap['staticUrl'];
      }
      this.numberOfEvents++;
      var address = this.getAddressForGeolocation(searchResultIndex);
      this.getLocationData(address, searchResultIndex);
    }
  }

  handleSearchError(error) {
    console.log(error);
  }

  getAddressForGeolocation(index) {
    /*
    This function parses event location information from TicketMaster's API and
    converts it into a specific string that the google geolocation API requires to return
    coordinates for use in the Event_Weather and Event_Map classes.
    */
    let streetAddressArray = this.data[index].eventAddress.split(' ');
    let addressToJoin = [
      ...streetAddressArray,
      this.data[index].eventCity,
      this.data[index].eventCountry
    ];
    return addressToJoin.join('+');
  }

  getLocationData(address, index) {
    var ajaxConfigObject = {
      dataType: 'JSON',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyBgx2H6A2p6G-17WuFQ9s0UPutBhqWtxeQ',
      method: 'GET',
      success: res => this.parseLocationData(res, index),
      error: this.handleLocationDataError
    }
    $.ajax(ajaxConfigObject);
  }

  handleLocationDataError(response) {
    console.log(response);
  }

  parseLocationData(response, resultReceived) {
    let { results: { [0]: { geometry: { location } } } } = response;
    let coordinates = {
      lat: location.lat,
      lng: location.lng
    }
    this.data[resultReceived].coordinates = coordinates;
    this.numberOfEventsCompleted++;
    let allRequestsCompleted = this.numberOfEvents === this.numberOfEventsCompleted;
    if (allRequestsCompleted) {
      for (let indexInDataToRender = 0; indexInDataToRender < this.data.length; indexInDataToRender++) {
        this.render(indexInDataToRender);
        this.getLocationWeatherAndMap(indexInDataToRender);
      }
    }
  }

  getLocationWeatherAndMap(index) {
    let latitude = this.data[index].coordinates.lat;
    let longitude = this.data[index].coordinates.lng;
    let mapParent = $('.' + index + ' .map-info');
    let weatherParent = $('.' + index + ' .weather-info');
    let map = new Event_Map(latitude, longitude, index, mapParent, 16);
    let weather = new Event_Weather_Current(latitude, longitude, weatherParent, index);
    map.render();
    this.getCurrentWeatherData(weather, index);
  }

  getCurrentWeatherData(weather, index) {
    var key = "ba298869db4c59aadd8bdebcb3a3e02c";
    var ajaxConfigObject = {
      dataType: 'json',
      url: "http://api.openweathermap.org/data/2.5/weather?lat=" + weather.weatherData.lat + "&lon=" + weather.weatherData.lng + "&appid=" + key,
      method: 'GET',
      success: response => this.processWeatherData(weather, response),
      error: this.processWeatherDataError
    }
    $.ajax(ajaxConfigObject);
  }

  processWeatherData(weather, response) {
    weather.addResponseData(response);
    weather.render();
  }

  processWeatherDataError(response) {
    console.log(response);
  }

  returnHome() {
    $('.result').remove();
    this.clearInputField();
    this.elementConfig.searchInput.val('');
    $('.landing-page').removeClass('hidden');
  }

  formatDate(index) {
    let eventDateArr = this.data[index].eventDate.split('-');
    let date = new Date(eventDateArr.join('/'));
    let month = date.toLocaleString('default', { month: 'long' });
    return `${month} ${eventDateArr[2]}, ${eventDateArr[0]}`;
  }

  formatTime(index) {
    let dateAndTime = `${this.formatDate(index)} ${this.data[index].eventStartTime}`;
    let date = new Date(dateAndTime);
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    let timeString = date.toLocaleString('en-US', options);
    if (timeString === 'Invalid Date') {
      return 'TBD';
    }
    return `${timeString} local time`;
  }

  activateDarkMode() {
    let $app_container = $('#app-container');
    let $search_result_container = $('#search-result-container');
    let $landing_page = $(".img-container, .about-us-container, .testimonial, .search-input");
    let $search_results = $("#search-bar, .result, .event-description > *");

    if (!this.darkMode) {
      $app_container.addClass('dark-grey');
      $search_result_container.addClass('medium-grey');
      $landing_page.addClass('content-grey');
      $search_results.addClass('content-grey');

      this.darkMode = true;

    } else if (this.darkMode) {
      $app_container.removeClass('dark-grey');
      $search_result_container.removeClass('medium-grey');
      $landing_page.removeClass('content-grey');
      $search_results.removeClass('content-grey');

      this.darkMode = false;
    }
  }

  render(index) {
    let resultTheme;
    let textTheme;
    if (this.darkMode) {
      resultTheme = `result ${index} content-grey`;
      textTheme = 'content-grey'
    } else {
      resultTheme = `result ${index}`
      textTheme = '';
    }
    var $weatherInfo = $('<div>').addClass('weather-info');
    var $mapInfo = $('<div>').addClass('map-info');
    var $locationInfo = $('<div>').addClass('location-info');
    var $venue = $('<p>').text(this.data[index].venueName);
    var $date = $('<p>').text(this.formatDate(index));
    var $startTime = $('<p>').text(this.formatTime(index));
    var $seatingChart = $('<a>')
      .text('Tap For Seating Chart!')
      .attr({
        href: this.data[index].seatingChartLink,
        target: '_blank'
      });
    var $ticketLink = $('<a>')
      .text('Buy Tickets Now!')
      .attr({
        href: this.data[index].ticketLink,
        target: '_blank'
      });
    var $eventTitle = $('<div>')
      .addClass('event-title')
      .text(this.data[index].eventName);
    var $eventDescription = $('<div>').addClass('event-description');
    var $eventInfo = $('<div>').addClass('event-info');
    var $eventResult = $('<div>').addClass(resultTheme);
    $locationInfo.append($weatherInfo, $mapInfo);
    $eventDescription.append(
      $venue,
      $date,
      $startTime,
      $seatingChart,
      $ticketLink
    );
    $eventInfo.append($eventTitle, $eventDescription);
    $eventResult.append($eventInfo, $locationInfo);
    this.elementConfig.searchContainer.append($eventResult);
    $('.content-loading').addClass('hidden');
    $('.event-description > *').addClass(textTheme);
  }
}
