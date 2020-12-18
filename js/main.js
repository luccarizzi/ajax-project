
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
var requestOverview;
var requestDaily;
var stockInfo = {};
var today = new Date();
var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
var $shareData;

document.addEventListener('submit', function (e) {
  e.preventDefault();
  symbol = document.forms["search-symbol-form"].elements["symbol-search"].value.toUpperCase();

  var xhrOverview = new XMLHttpRequest();
  xhrOverview.open('GET', 'https://www.alphavantage.co/query?function=OVERVIEW&symbol=' + symbol + '&apikey=' + apiKey);
  xhrOverview.responseType = 'json';

  xhrOverview.addEventListener('load', function (e) {
    requestOverview = xhrOverview.response;

    if (requestOverview.Symbol === undefined) {
      $modal.style.display = 'flex';
    } else {
      stockInfo = {
        symbol: requestOverview.Symbol,
        name: requestOverview.Name,
        industry: requestOverview.Industry,
        country: requestOverview.Country,
        dividendPerShare: convertDividendPerShare(requestOverview),
        dividendYield: convertDividendYield(requestOverview),
        dividendDate: convertDate(requestOverview)
      }
      document.querySelector("[data-view=detail]").innerHTML = "";
      document.querySelector("[data-view=detail]").prepend(renderSearchDetail(stockInfo));
      document.forms["search-symbol-form"].reset();
    }
  })
  xhrOverview.send();

  $shareData = document.getElementById("share-data");

  var xhrDaily = new XMLHttpRequest();
  xhrDaily.open('GET', 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=' + symbol + '&apikey=' + apiKey);
  xhrDaily.responseType = 'json';

  xhrDaily.addEventListener('load', function (e) {
    requestDaily = xhrDaily.response;
    // $shareData.value = "$" + requestDaily["Time Series (Daily)"][date]["5. adjusted close"];

  })
  xhrDaily.send();
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
  spanShareData.setAttribute("id", "share-data");
  // spanShareData.textContent = "$" + " TBD";

  var pDivPerShare = document.createElement("p");
  var spanDivPerShareTag = document.createElement("span");
  spanDivPerShareTag.className = "tag";
  spanDivPerShareTag.textContent = "dividend per share:"

  var brDivPerShare = document.createElement("br");

  var spanDivPerShareData = document.createElement("span");
  if (stockInfo.dividendYield === "N/A") {
    spanDivPerShareData.className = "data noDiv";
  } else {
    spanDivPerShareData.className = "data";
  }
  spanDivPerShareData.textContent = stockInfo.dividendPerShare;

  var pDivYield = document.createElement("p");
  var spanDivYieldTag = document.createElement("span");
  spanDivYieldTag.className = "tag";
  spanDivYieldTag.textContent = "dividend yield:"

  var brDivYield = document.createElement("br");

  var spanDivYieldData = document.createElement("span");
  if (stockInfo.dividendYield === "N/A") {
    spanDivYieldData.className = "data noDiv";
  } else {
    spanDivYieldData.className = "data";
  }
  spanDivYieldData.textContent = stockInfo.dividendYield;

  var pLastDivDate = document.createElement("p");
  var spanLastDivDateTag = document.createElement("span");
  spanLastDivDateTag.className = "tag";
  spanLastDivDateTag.textContent = "last dividend date:";

  var brLastDivDate = document.createElement("br");

  var spanLastDivDateData = document.createElement("span");
  if (stockInfo.dividendYield === "N/A") {
    spanLastDivDateData.className = "data noDiv";
  } else {
    spanLastDivDateData.className = "data";
  }
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

function convertDate (request) {
  if (requestOverview.DividendDate === "None" || requestOverview.ForwardAnnualDividendRate === "0") {
    return "N/A";
  } else {
    var date = requestOverview.DividendDate;
    var splitDate = date.split("-");
    var newDate = splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
    return newDate;
  }
}

function convertDividendYield (request) {
  if (requestOverview.ForwardAnnualDividendRate === "0") {
    return "N/A";
  } else {
    var dividendYieldPercentage = (100 * requestOverview.ForwardAnnualDividendYield).toFixed(2) + "%";
    return dividendYieldPercentage;
  }
}

function convertDividendPerShare (request) {
  if (requestOverview.ForwardAnnualDividendRate === "0") {
    return "N/A";
  } else {
    var dividendPerShare = "$" + requestOverview.DividendPerShare;
    return dividendPerShare;
  }
}
