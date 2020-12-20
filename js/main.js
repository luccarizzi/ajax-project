
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
var apiRequest;
var stockInfo = {};

document.addEventListener('submit', function (e) {
  e.preventDefault();
  symbol = document.forms["search-symbol-form"].elements["symbol-search"].value.toUpperCase();

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=' + symbol + '&outputsize=full&apikey=' + apiKey);
  xhr.responseType = 'json';

  xhr.addEventListener('load', function (e) {
    apiRequest = xhr.response;

    if (apiRequest["Meta Data"] === undefined) {
      $modal.style.display = 'flex';
    } else {

      var shareName = apiRequest["Meta Data"]["2. Symbol"];
      var request = apiRequest['Time Series (Daily)'];
      var dividendPerShare = 0;
      var dividendPay = 0;
      var annualPaymentRate = 0;
      var adjustedClose = 0;
      var dividendHistory = [];
      var dividendExDate = dividendHistory[0];

      for (var day in request) {
        if (request[day]['7. dividend amount'] !== "0.0000") {
          dividendHistory.push(day);
        }
        if (dividendHistory.length === 0) {
          dividendExDate = "N/A"
        } else {
          var divDate = dividendHistory[0];
          var splitDate = divDate.split("-");
          dividendExDate = splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
        }
      }

      for (var i = 251; i > 0; i--) {
        var date = Object.keys(request)[i];
        if (request[date]['7. dividend amount'] !== "0.0000") {
          dividendPerShare += Number(request[date]['7. dividend amount']);
          dividendPay = Number(request[date]['7. dividend amount'])
          annualPaymentRate++;
        }
        adjustedClose = Number(request[date]["5. adjusted close"]);
      }

      var dividendYield = (dividendPerShare / adjustedClose * 100).toFixed(2);

      // console.log('dividendPerShare:', Number(dividendPerShare.toFixed(2)));
      // console.log('dividendPay:', Number(dividendPay.toFixed(2)));
      // console.log('annualPaymentRate:', annualPaymentRate);
      // console.log('dividendExDate:', dividendExDate);
      // console.log('adjustedClose:', adjustedClose);
      // console.log('dividendYield:', Number(dividendYield));

      stockInfo = {
        name: shareName,
        share: adjustedClose.toFixed(2),
        dividendPerShare: dividendPerShare.toFixed(2),
        dividendYield: dividendYield,
        dividendDate: dividendExDate,
        dividendPayment: dividendPay.toFixed(2),
        annualPaymentRate: annualPaymentRate
      }
    }
    document.querySelector("[data-view=detail]").innerHTML = "";
    document.querySelector("[data-view=detail]").prepend(renderSearchDetail(stockInfo));
    document.forms["search-symbol-form"].reset();
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
  spanShareData.textContent = "$" + stockInfo.share;

  var pDivYield = document.createElement("p");
  var spanDivYieldTag = document.createElement("span");
  spanDivYieldTag.className = "tag";
  spanDivYieldTag.textContent = "approx. dividend yield:"

  var brDivYield = document.createElement("br");

  var spanDivYieldData = document.createElement("span");
  if (stockInfo.dividendYield === "N/A" || stockInfo.dividendYield === '0.00') {
    spanDivYieldData.className = "data noDiv";
  } else {
    spanDivYieldData.className = "data";
  }
  spanDivYieldData.textContent = stockInfo.dividendYield + '%';

  var pDivPerShare = document.createElement("p");
  var spanDivPerShareTag = document.createElement("span");
  spanDivPerShareTag.className = "tag";
  spanDivPerShareTag.textContent = "dividend per share:"

  var brDivPerShare = document.createElement("br");

  var spanDivPerShareData = document.createElement("span");
  if (stockInfo.dividendPerShare === "N/A" || stockInfo.dividendPerShare === "0.00") {
    spanDivPerShareData.className = "data noDiv";
  } else {
    spanDivPerShareData.className = "data";
  }
  spanDivPerShareData.textContent = '$' + stockInfo.dividendPerShare;

  var pDivPayment = document.createElement("p");
  var spanDivPaymentTag = document.createElement("span");
  spanDivPaymentTag.className = "tag";
  spanDivPaymentTag.textContent = "dividend payment";

  var brDivPayment = document.createElement("br");

  var spanDivPaymentData = document.createElement("span");
  if (stockInfo.dividendPayment === "N/A" || stockInfo.dividendPayment === "0.00") {
    spanDivPaymentData.className = "data noDiv";
  } else {
    spanDivPaymentData.className = "data";
  }
  spanDivPaymentData.textContent = '$' + stockInfo.dividendPayment;

  var pFrequency = document.createElement("p");
  var spanFrequencyTag = document.createElement("span");
  spanFrequencyTag.className = "tag";
  spanFrequencyTag.textContent = "dividend frequency";

  var brFrequency = document.createElement("br");

  var spanFrequencyData = document.createElement("span");
  if (stockInfo.annualPaymentRate === "N/A" || stockInfo.annualPaymentRate === 0) {
    spanFrequencyData.className = "data noDiv";
  } else {
    spanFrequencyData.className = "data";
  }
  spanFrequencyData.textContent = annualFreqConverter(stockInfo.annualPaymentRate);

  var pLastDivDate = document.createElement("p");
  var spanLastDivDateTag = document.createElement("span");
  spanLastDivDateTag.className = "tag";
  spanLastDivDateTag.textContent = "last dividend date:";

  var brLastDivDate = document.createElement("br");

  var spanLastDivDateData = document.createElement("span");
  if (stockInfo.dividendDate === "N/A" || stockInfo.dividendDate === 0) {
    spanLastDivDateData.className = "data noDiv";
  } else {
    spanLastDivDateData.className = "data";
  }
  spanLastDivDateData.textContent = stockInfo.dividendDate;

  var divButton = document.createElement("div");
  divButton.className = "flex justify-center";

  var aButton = document.createElement("a");
  aButton.className = "save-button";
  aButton.setAttribute("href", "#");
  aButton.setAttribute('id', 'add-to-favorite-button');
  aButton.setAttribute('onclick', 'this.blur()');
  aButton.textContent = "Add to Favorites";

  divSearchDetailContainer.append(divTitle, divInfo);
  divTitle.append(h1Title);
  divInfo.append(pShare, pDivYield, pDivPerShare, pDivPayment, pFrequency, pLastDivDate, divButton);
  pShare.append(spanShareTag, brShare, spanShareData);
  pDivYield.append(spanDivYieldTag, brDivYield, spanDivYieldData);
  pDivPerShare.append(spanDivPerShareTag, brDivPerShare, spanDivPerShareData);
  pDivPayment.append(spanDivPaymentTag, brDivPayment, spanDivPaymentData);
  pFrequency.append(spanFrequencyTag, brFrequency, spanFrequencyData);
  pLastDivDate.append(spanLastDivDateTag, brLastDivDate, spanLastDivDateData);

  divButton.append(aButton);

  return divSearchDetailContainer;
}

document.addEventListener('click', function(e) {
  if (e.target.id === 'add-to-favorite-button') {
    data.stocks.unshift(stockInfo);
  }
  if (e.target.parentNode = "NAV") {
    console.log("Nav clicked.")
  }
})

function annualFreqConverter(freq) {
  if (freq === 1) {
    return "annually";
  } else if (freq === 4) {
    return "quarterly"
  } else if (freq === 12) {
    return "monthly"
  } else {
    return freq + ' times per year';
  }
}
