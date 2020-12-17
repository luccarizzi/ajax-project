
var $searchInput = document.getElementById("symbol-search");

$searchInput.addEventListener("focus", function(e) {
  $searchInput.setAttribute("placeholder", "");
})

$searchInput.addEventListener("blur", function(e) {
  $searchInput.setAttribute("placeholder", "Stock symbol");
})

var $closeButton = document.getElementById('close-modal-button');
var $modal = document.getElementById('modal');

$closeButton.addEventListener('click', function(e) {
  $modal.style.display = 'none';
  document.forms["search-symbol-form"].reset();
})

var symbol = "";
var apiKey = 'JI3EUIMS58M4XZ08';

document.addEventListener('submit', function (e) {
  e.preventDefault();
  symbol = document.forms["search-symbol-form"].elements["symbol-search"].value.toUpperCase();

  var xhr = new XMLHttpRequest();
  xhr.open('GET','https://www.alphavantage.co/query?function=OVERVIEW&symbol=' + symbol + '&apikey=' + apiKey);
  xhr.responseType = 'json';

  xhr.addEventListener('load', function (e) {
    var request = xhr.response;

    if (request.Symbol === undefined) {
      $modal.style.display = 'flex';
    } else {
      var stockInfo = {
        symbol: request.Symbol,
        name: request.Name,
        industry: request.Industry,
        country: request.Country,
        dividendPerShare: request.DividendPerShare,
        dividendYield: request.DividendYield,
        dividendDate: request.DividendDate
      }
      console.log(stockInfo);
      document.forms["search-symbol-form"].reset();
    }
  })
  xhr.send();
});

var $dataViewList = document.querySelectorAll("[data-view]")

function swapView (view) {

}
