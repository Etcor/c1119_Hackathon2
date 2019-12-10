class Display_result {
  constructor (elementConfig) {
    this.data = {};
    this.elementConfig = {
      searchButton: $(elementConfig.searchButton),
    };
    this.render = this.render.bind(this);
    this.getLocationData = this.getLocationData.bind(this);
    this.parseLocationData = this.parseLocationData.bind(this);
  }

  addEventHandlers() {
    this.elementConfig.searchButton.on('click', this.render);
  }

  render(){
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
}
