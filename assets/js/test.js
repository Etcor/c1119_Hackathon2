// $(document).ready(initApp);

// function initApp(){
//  var application = new Display_result({
//   searchButton: $('#search-button'),
//   searchInput: $('#search-input'),
//   searchContainer: $('#search-result-container')
//  });
//  application.addEventHandlers();
// }
var twentyFourHourTime = this.data[index].twentyFourHourTime
console.log("24h Time from ticketmaster: ", twentyFourHourTime);

var twelveHours = twentyFourHourTime.slice(0, 2);
console.log("first two digits from: ", twelveHours);
var minutesAndSeconds = twentyFourHourTime.slice(2);
console.log("hrs and mins: ", minutesAndSeconds)

if (twelveHours > 12) {
  var hoursMinusTwelve = twelveHours - 12;
  var PM = hoursMinusTwelve + " PM"
  var fixedTime = hoursMinusTwelve + minutesAndSeconds + " PM"
  // this.$pTagTime = fixedTime;
  console.log("fixed time: ", fixedTime);
} else if (twelveHours === '12') {
  twentyFourHourTime += " PM"
  // this.$pTagTime = twentyFourHourTime
  console.log("24 hr time: ", twentyFourHourTime);
} else {
  twentyFourHourTime += " AM"
  // this.$pTagTime = twentyFourHourTime;
  console.log("24 fixed hours: ", twentyFourHourTime);

  // banana
