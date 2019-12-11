$(document).ready(initApp);

function initApp() {
 var application = new Display_result({
  searchButton: $('.search-button'),
  searchInput: $('.search-input'),
  searchContainer: $('#search-result-container')
 });
 application.addEventHandlers();
}
