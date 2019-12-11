$(document).ready(initApp);
var application;
function initApp() {
    application = new Display_result({
    searchButton: $('.search-button'),
    searchInput: $('.search-input'),
    searchContainer: $('#search-result-container')
  });
  application.addEventHandlers();
}
