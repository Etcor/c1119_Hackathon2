var ticketmasterResponse;
$(document).ready(initializeApp());

function initializeApp(){
  $('#search-button').on('click', getData)
}

function getData() {
  var textInputField = $("#search-input").val();
  var ajaxConfig = {
    type: "GET",
    url: "https://app.ticketmaster.com/discovery/v2/events.json?size=5&apikey=RpWHpqTak6PwdixiLGSrrPsoBINm24CG",
    data: {
      keyword: textInputField
    },
    async: true,
    dataType: "json",
    success: function (response) {
      ticketmasterResponse = response;
      console.log("response: ", response);

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
        // eventDescriptionDiv.text("Date: " + eventDate + '\n' + "Time: " + eventStartTime + "Venue: " + venueName + '\n' + " Address: " + eventAddress + '\n');

        pDate.text(eventDate);
        pTime.text(eventStartTime);
        pVenue.text(venueName);
        pAddress.text(eventAddress);
        pSeatingChart.text(seatingChartLink);


        // ticketmasterResponse._embedded.events[index]
        // ticketmasterResponse._embedded.events[index]

        console.log("name: ", eventName);
        console.log("date: ", eventDate);
        console.log("venue name: ", venueName);
        console.log("venue address: ", eventAddress + ", " + venueName + ", " + eventCity + ", " + eventState + ", " + eventCountry);
        console.log("event info: ", eventInfo);
        // console.log("presale date: ", ticketPresale);
        // console.log("presale date: ", publicOnsale);
        console.log("seating chart: ", seatingChartLink)
        // console.log("price min - max: ", "$" + priceRangeMin + " - " + "$" + priceRangeMax);
        console.log("local start time: ", eventStartTime);
        console.log("latitude: ", latitude);
        console.log("longitude: ", longitude);
        console.log('\n');


      }

    },
    error: function (xhr, status, err) {

    },
    // event: {
    //   this.name,
    //   this.date,
    //   this.location
    // }
  }
  $.ajax(ajaxConfig);
}

// class Ticketmaster {

//   constructor(name, location, date){
//     this.event = {
//       name: name,
//       location: location,
//       date: date
//     };
//     //binds
//     this.render = this.render.bind(this);
//     // this.domElements = {
//     //   row: null,
//     //   name1: null,
//     //   name2: null,
//     //   location1: null,
//     //   location2: null,
//     //   date1: null,
//     //   date2: null,
//     // }
//   }

//   render(){
//     this.domElements.row = $('<tr>');
//     this.domElements.name1 = $('<td tr:nth-of-child(1)>').text(this.event.name);
//     this.domElements.name2 = $('<td tr:nth-of-child(2)>').text(this.event.name);
//     this.domElements.location1 = $('<td tr:nth-of-child(1)>').text(this.event.location);
//     this.domElements.location2 = $('<td tr:nth-of-child(2)>').text(this.event.location);
//     this.domElements.date1 = $('<td tr:nth-of-child(1)>').text(this.event.date);
//     this.domElements.date2 = $('<td tr:nth-of-child(2)>').text(this.event.date);

//   }


  // processGetDataFromTicketmaster(response){


    // this.event = {

    // }
  // }

//constructor end
// }
