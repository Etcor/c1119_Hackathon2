class Event_Map {
  constructor(latitude, longitude, eventName, parentElement, mapZoom){
    this.coordinates = {
      lat: latitude,
      lng: longitude
    }
    this.eventNameId = eventName + '-map';
    this.mapZoom = mapZoom;
    this.newMapElement = null;
    this.parentElement = parentElement;
    this.render = this.render.bind(this);
    this.getMap = this.getMap.bind(this);
  }

  render(){
    this.newMapElement = $('<div>').attr('id', this.eventNameId).addClass('map');
    $(this.parentElement).append(this.newMapElement);
    this.getMap();
  }

  getMap(){
    var coordinates = this.coordinates;
    var map = new google.maps.Map(document.getElementById(this.eventNameId), {
      center: coordinates,
      zoom: this.mapZoom
    });
    var mapMarker = new google.maps.Marker({
      position: coordinates,
      map: map
    });
  }
}
