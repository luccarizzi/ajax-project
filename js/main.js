
var $searchInput = document.getElementById("symbol-search");

$searchInput.addEventListener("focus", function(e) {
  $searchInput.setAttribute("placeholder", "");
})

$searchInput.addEventListener("blur", function(e) {
  $searchInput.setAttribute("placeholder", "Stock symbol");
})

var $closeButton = document.getElementById('close-modal-button');
var $closeModal = document.getElementById('close-modal');

$closeButton.addEventListener('click', function(e) {
  $closeModal.style.display = 'none';
  document.forms["search-symbol-form"].reset();
})

var symbol = "";
var apiKey = 'JI3EUIMS58M4XZ08';

var request;

document.addEventListener('submit', function (e) {
  e.preventDefault();
  symbol = document.forms["search-symbol-form"].elements["symbol-search"].value.toUpperCase();

  var xhr = new XMLHttpRequest();
  xhr.open('GET','https://www.alphavantage.co/query?function=OVERVIEW&symbol=' + symbol + '&apikey=' + apiKey);
  xhr.responseType = 'json';

  xhr.addEventListener('load', function (e) {
    request = xhr.response;

    if (request.Symbol === undefined) {
      $closeModal.style.display = 'flex';
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
      stocks.push(stockInfo);
      document.forms["search-symbol-form"].reset();
      console.log(stocks)
    }
  })
  xhr.send();
});
