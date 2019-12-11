class Ticket_Master_Search {
  constructor(keyword) {
    this.keyword = keyword;
    this.data = {};
    this.render = this.render.bind(this);
    this.getLocationData = this.getLocationData.bind(this);
    this.parseLocationData = this.parseLocationData.bind(this);
    this.getResultData = this.getResultData.bind(this);
    this.parseSuccessfulTicketMasterResponse = this.parseSuccessfulTicketMasterResponse.bind(this);
    this.handleTicketMasterError = this.handleTicketMasterError.bind(this);
  }

  getResultData() {
    var textInputField = $("#search-input").val();
    var ajaxConfig = {
      type: "GET",
      url: "https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=RpWHpqTak6PwdixiLGSrrPsoBINm24CG",
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
    for (var index = 0; index <= 4; index++) {
      var eventNameDiv = $('.event-title');
      var eventDescriptionDiv = $('.event-description');
      var pDate = $('.date');
      var pTime = $('.time');
      var pVenue = $('.venue');
      var pAddress = $('.address');
      var pSeatingChart = $('.seatingChart');
      var eventName = ticketmasterResponse._embedded.events[index]['name'];
      var venueName = ticketmasterResponse._embedded.events[index]._embedded.venues[0]['name'];
      var eventDate = ticketmasterResponse._embedded.events[index].dates.start['dateTime'];
      var eventCity = ticketmasterResponse._embedded.events[index]._embedded.venues[0].city['name'];
      var eventState = ticketmasterResponse._embedded.events[index]._embedded.venues[0].state['name'];
      var eventAddress = ticketmasterResponse._embedded.events[index]._embedded.venues[0].address['line1'];
      var eventCountry = ticketmasterResponse._embedded.events[index]._embedded.venues[0].country['countryCode'];
      // var ticketPresale = ticketmasterResponse._embedded.events[index].sales.presales['startDateTime'];
      // var publicOnsale = ticketmasterResponse._embedded.events[index].sales.public['startDateTime'];
      var seatingChartLink = ticketmasterResponse._embedded.events[index].seatmap['staticUrl'];
      // var seatingChartImg = "Click here for seating chart";
      // var seatLink = seatingChartImg.link("seatingChartLink");
      // var priceRangeMin = ticketmasterResponse._embedded.events[index].priceRanges[0]['min'];
      // var priceRangeMax = ticketmasterResponse._embedded.events[index].priceRanges[0]['max'];
      var eventStartTime = ticketmasterResponse._embedded.events[index].dates.start['localTime'];
      // var eventStartTimeHours = eventStartTime.slice(0, 1);
      // var EventStartTimeHoursMinusTwelve = eventStartTimeHours - 12;
      // eventStartTime = EventStartTimeHoursMinusTwelve + eventStartTime;
      var latitude = ticketmasterResponse._embedded.events[index]._embedded.venues[0].location['latitude'];
      var longitude = ticketmasterResponse._embedded.events[index]._embedded.venues[0].location['longitude'];
      var eventInfo = ticketmasterResponse._embedded.events[index]['info'];
      eventNameDiv.text(eventName);
      pDate.text(eventDate);
      pTime.text(eventStartTime);
      pVenue.text(venueName);
      pAddress.text(eventAddress);
      pSeatingChart.text(seatingChartLink);
    }
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
    console.log('latitude: ', response.results[0].geometry.location.lat);
    console.log('longitude: ', response.results[0].geometry.location.lng);
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
