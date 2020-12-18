
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
        dividendYield: (100 * request.DividendYield).toFixed(2) + "%",
        dividendDate: convertDate(request.DividendDate)
      }
      console.log(stockInfo);
      document.querySelector("[data-view=detail]").append(renderSearchDetail(stockInfo));
      document.forms["search-symbol-form"].reset();
    }
    console.log(request);
  })
  xhr.send();
});

var $dataViewList = document.querySelectorAll("[data-view]")

function swapView (view) {
  for (var i = 0; i < $dataViewList.length; i++) {
    if ($dataViewList[i].dataset.view === view) {
      $dataViewList[i].style.display = "";
    } else {
      $dataViewList[i].style.display = "none";
    }
  }
  data.dataview = view;
}

// var stockInfo = {
//   symbol: 'T',
//   name: 'AT&T Inc',
//   industry: 'Telecom Services',
//   country: 'USA',
//   dividendPerShare: '2.08',
//   dividendYield: '0.068',
//   dividendDate: '2020/11/02'
// }

function renderSearchDetail(stockInfo) {

  var divSearchDetailContainer = document.createElement("div");
  divSearchDetailContainer.className = 'flex wrap font-white search-detail-container'

  var divTitle = document.createElement("div");
  divTitle.className = "column-1";

  var h1Title = document.createElement("h1");
  h1Title.className = "symbol-title";
  h1Title.textContent = stockInfo.name;

  var divInfo = document.createElement("div");
  divInfo.className = "column-1";

  var pShare = document.createElement("p");
  var spanShareTag = document.createElement("span");
  spanShareTag.className = "tag";
  spanShareTag.textContent = "share:"

  var brShare = document.createElement("br");

  var spanShareData = document.createElement("span");
  spanShareData.className = "data";
  spanShareData.textContent = "$" + " TBD";

  var pDivPerShare = document.createElement("p");
  var spanDivPerShareTag = document.createElement("span");
  spanDivPerShareTag.className = "tag";
  spanDivPerShareTag.textContent = "$" + "dividend per share:"

  var brDivPerShare = document.createElement("br");

  var spanDivPerShareData = document.createElement("span");
  spanDivPerShareData.className = "data";
  spanDivPerShareData.textContent = "$" + (1 * stockInfo.dividendPerShare).toFixed(2);

  var pDivYield = document.createElement("p");
  var spanDivYieldTag = document.createElement("span");
  spanDivYieldTag.className = "tag";
  spanDivYieldTag.textContent = "dividend yield:"

  var brDivYield = document.createElement("br");

  var spanDivYieldData = document.createElement("span");
  spanDivYieldData.className = "data";
  spanDivYieldData.textContent = stockInfo.dividendYield;

  var pLastDivDate = document.createElement("p");
  var spanLastDivDateTag = document.createElement("span");
  spanLastDivDateTag.className = "tag";
  spanLastDivDateTag.textContent = "last lividend date:";

  var brLastDivDate = document.createElement("br");

  var spanLastDivDateData = document.createElement("span");
  spanLastDivDateData.className = "data";
  spanLastDivDateData.textContent = stockInfo.dividendDate;

  var pCountry = document.createElement("p");
  var spanCountryTag = document.createElement("span");
  spanCountryTag.className = "tag";
  spanCountryTag.textContent = "country";

  var brCountry = document.createElement("br");

  var spanCountryData = document.createElement("span");
  spanCountryData.className = "data";
  spanCountryData.textContent = stockInfo.country;

  var pIndustry = document.createElement("p");
  var spanIndustryTag = document.createElement("span");
  spanIndustryTag.className = "tag";
  spanIndustryTag.textContent = "industry";

  var brIndustry = document.createElement("br");

  var spanIndustryData = document.createElement("span");
  spanIndustryData.className = "data";
  spanIndustryData.textContent = stockInfo.industry;

  var divButton = document.createElement("div");
  divButton.className = "flex justify-center";

  var aButton = document.createElement("a");
  aButton.className = "save-button";
  aButton.setAttribute("href", "#");
  aButton.textContent = "Add to Favorites";

  divSearchDetailContainer.append(divTitle, divInfo);
  divTitle.append(h1Title);
  divInfo.append(pShare, pDivPerShare, pDivYield, pLastDivDate, pCountry, pIndustry, divButton);
  pShare.append(spanShareTag, brShare, spanShareData);
  pDivPerShare.append(spanDivPerShareTag, brDivPerShare, spanDivPerShareData);
  pDivYield.append(spanDivYieldTag, brDivYield, spanDivYieldData);
  pLastDivDate.append(spanLastDivDateTag, brLastDivDate, spanLastDivDateData);
  pCountry.append(spanCountryTag, brCountry, spanCountryData);
  pIndustry.append(spanIndustryTag, brIndustry, spanIndustryData);
  divButton.append(aButton);

  return divSearchDetailContainer;
}

function convertDate (date) {
  var splitDate = date.split("-");
  var newDate = splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
  return newDate;
}

// convertDate("2020/11/02");
