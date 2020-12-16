
var symbol = "";
var apiKey = 'JI3EUIMS58M4XZ08';

var request;

document.addEventListener('submit', function (e) {
  e.preventDefault();
  symbol = document.forms["search-symbol-form"].elements["symbol-search"].value.toUpperCase();

  var xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    'https://www.alphavantage.co/query?function=OVERVIEW&symbol=' + symbol + '&apikey=' + apiKey);
  xhr.responseType = 'json';

  xhr.addEventListener('load', function (e) {
    request = xhr.response;

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
  })

  xhr.send();
});
