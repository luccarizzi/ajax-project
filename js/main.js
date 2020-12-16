
var symbol = "";
var apiKey = 'JI3EUIMS58M4XZ08';

var requestReturn; // delete after

document.addEventListener('submit', function (e) {
  e.preventDefault();
  symbol = document.forms["search-symbol-form"].elements["symbol-search"].value.toUpperCase();

  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'https://www.alphavantage.co/query?function=OVERVIEW&symbol=' + symbol + '&apikey=' + apiKey);
  xhr.responseType = 'json';

  xhr.addEventListener('load', function (e) {
    requestReturn = xhr.response;
  })

  xhr.send();
});
