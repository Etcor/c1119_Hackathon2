$(document).ready(initApp);

function initApp(){
 $('.makeMap').on('click', makeMap);
}

var parent = $('#new-map');
var makinMaps = new Event_Map(33.634870, -117.740450, 'learning-fuze', parent, 16);

var parentElem = $(".ph-event-name .weather-info");
var gettinWeather = new Event_Weather_Current(33.634870, -117.740450, parentElem);
function getDataFromServer() {
  var key = "ba298869db4c59aadd8bdebcb3a3e02c";
  var ajaxConfigObject = {
    dataType: 'json',
    url: "http://api.openweathermap.org/data/2.5/weather?lat="+gettinWeather.weatherData.lat+"&lon="+gettinWeather.weatherData.lon+"&appid="+key,
    method: 'GET',
    success: this.processGetServerData,
    error: this.processGetServerError
  }
  $.ajax(ajaxConfigObject);
}
function processGetServerData(response) {
  console.log(response);
  gettinWeather.render();


  // $("#displayArea").empty();
  // this.data = {};
  // var studentName = null;
  // var studentGrade = null;
  // var studentCourse = null;
  // var studentId = null;
  // for (var key in response) {
  //   studentName = response[key].name;
  //   studentGrade = response[key].grade;
  //   studentCourse = response[key].course;
  //   studentId = response[key].id;
  //   this.createStudent(studentName, studentCourse, studentGrade, studentId);
  //   this.displayAllStudents();
  // }
}

function makeMap(){
 makinMaps.render();
}
