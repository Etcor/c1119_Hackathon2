$(document).ready(initApp);

function initApp(){
 $('.makeMap').on('click', makeMap);
}

var parent = $('.ph-event-name .map-info');
var makinMaps = new Event_Map(33.634870, -117.740450, 'learning-fuze', parent, 16);

var test = new Display_result({
  searchButton: $('.makeMap')
});
function makeMap(){
 makinMaps.render();
}
