class Event_Map {
  constructor(latitude, longitude, eventName, parentElement, mapZoom){

    this.coordinates = {
    lat: latitude,
    lng: longitude
    }
    this.eventName = eventName;
    this.mapZoom = mapZoom;
    this.newMapElement = null;
    this.parentElement = parentElement;

    this.render = this.render.bind(this);
    this.getMap = this.getMap.bind(this);
  }

  render(){
    this.newMapElement = $('<div>').attr('id', this.eventName).addClass('map ' + this.eventName);
    $(this.parentElement).append(this.newMapElement);
    this.getMap();
  }

  getMap(){
    var coordinates = this.coordinates;
    var map = new google.maps.Map(document.getElementById(this.eventName), {
      center: coordinates,
      zoom: this.mapZoom
    });
    var mapMarker = new google.maps.Marker({
      position: coordinates,
      map: map
    });
  }
}
