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
      debugger;
      var address = this.getAddressString(index);
      this.data[index].coordinates = this.getLocationData(address);
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

  getLocationData(address) {
    var ajaxConfigObject = {
      dataType: 'JSON',
      url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=AIzaSyBgx2H6A2p6G-17WuFQ9s0UPutBhqWtxeQ',
      method: 'GET',
      success: this.parseLocationData,
      error: function (response) {
        console.log(response);
      }
    }
    $.ajax(ajaxConfigObject);
  }

  parseLocationData(response) {
    var coordinates = {
      lat: response.results[0].geometry.location.lat,
      lng: response.results[0].geometry.location.lng
    }
    console.log('latitude: ', response.results[0].geometry.location.lat);
    console.log('longitude: ', response.results[0].geometry.location.lng);
    return coordinates;
  }

  render() {
    var $weatherInfo = $('<div>').addClass('weather-info');
    var $mapInfo = $('<div>').addClass('map-info');
    var $locationInfo = $('<div>').addClass('location-info');
    $locationInfo.append($weatherInfo, $mapInfo);
    var $eventTitle = $('<div>').addClass('event-title');
    var $eventDescription = $('<div>').addClass('event-description');
    var $eventInfo = $('<div>').addClass('event-info');
    $eventInfo.append($eventTitle, $eventDescription);
    var $eventResult = $('<div>').addClass('result ' + 'ph-event-name');
    $eventResult.append($eventInfo, $locationInfo);
    $('#search-result-container').append($eventResult);
  }
}
