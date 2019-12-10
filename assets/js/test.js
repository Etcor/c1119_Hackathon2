$(document).ready(initApp);

function initApp(){
 $('button').on('click', makeMap);
}

var parent = $('#new-map');
var makinMaps = new Event_Map(33.634870, -117.740450, 'learning-fuze', parent, 16);

function makeMap(){
 makinMaps.render();
}
