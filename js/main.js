
var $searchInput = document.getElementById('symbol-search');

// remove the initial placeholder when the user starts to type
$searchInput.addEventListener('focus', function (e) {
  $searchInput.setAttribute('placeholder', '');
});

// return the place holder when the user blurs the input
$searchInput.addEventListener('blur', function (e) {
  $searchInput.setAttribute('placeholder', 'Search Stock');
});

// function to get the stock's name using the symbol as a parameter
function getSymbolName(stockSymbol) {
  for (var i = 0; i < stockSymbolName.length; i++) {
    if (stockSymbolName[i].symbol === stockSymbol) {
      return stockSymbolName[i].name;
    }
  }
}

var symbol = '';
var apiKey = 'JI3EUIMS58M4XZ08';
var apiRequest;
var stockInfo = {};

var $loadingSpinner = document.getElementById('loading-spinner');
var $limitModal = document.getElementById('limit-modal');

// API request and returns the information requested or an notification
document.addEventListener('submit', function (e) {
  e.preventDefault();
  symbol = document.forms['search-symbol-form'].elements['symbol-search'].value.toUpperCase();

  var xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=' + symbol + '&outputsize=full&apikey=' + apiKey);
  xhr.responseType = 'json';
  $loadingSpinner.style.display = "flex";

  xhr.onerror = function() {
    console.log(xhr)
  }

  xhr.addEventListener('load', function (e) {
    apiRequest = xhr.response;

    if (apiRequest['Note'] === 'Thank you for using Alpha Vantage! Our standard API call frequency is 5 calls per minute and 500 calls per day. Please visit https://www.alphavantage.co/premium/ if you would like to target a higher API call frequency.') {
      $limitModal.style.display = 'flex';
    } else if (apiRequest["Error Message"] === 'Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for TIME_SERIES_DAILY_ADJUSTED.') {
      $closeModal.style.display = 'flex';
      $loadingSpinner.style.display = "none";
    }

    else {

      var shareSymbol = apiRequest['Meta Data']['2. Symbol'];
      var name = getSymbolName(symbol);
      var request = apiRequest['Time Series (Daily)'];
      var dividendPerShare = 0;
      var dividendPay = 0;
      var annualPaymentRate = 0;
      var adjustedClose = 0;
      var dividendHistory = [];
      var dividendExDate = dividendHistory[0];

      for (var day in request) {
        if (request[day]['7. dividend amount'] !== '0.0000') {
          dividendHistory.push(day);
        }
        if (dividendHistory.length === 0) {
          dividendExDate = 'N/A';
        } else {
          var divDate = dividendHistory[0];
          var splitDate = divDate.split('-');
          dividendExDate = splitDate[1] + '/' + splitDate[2] + '/' + splitDate[0];
        }
      }

      for (var i = 251; i > 0; i--) {
        var date = Object.keys(request)[i];
        if (request[date]['7. dividend amount'] !== '0.0000') {
          dividendPerShare += Number(request[date]['7. dividend amount']);
          dividendPay = Number(request[date]['7. dividend amount']);
          annualPaymentRate++;
        }
        adjustedClose = Number(request[date]['5. adjusted close']);
      }

      var dividendYield = (dividendPerShare / adjustedClose * 100).toFixed(2);

      stockInfo = {
        symbol: shareSymbol,
        name: name,
        share: adjustedClose.toFixed(2),
        dividendPerShare: dividendPerShare.toFixed(2),
        dividendYield: dividendYield,
        dividendDate: dividendExDate,
        dividendPayment: dividendPay.toFixed(2),
        annualPaymentRate: annualPaymentRate
      };

      document.querySelector('[data-view=detail]').innerHTML = '';
      document.querySelector('[data-view=detail]').prepend(renderSearchDetail(stockInfo));
      document.querySelector('[data-view=detail]').style.display = '';
      document.forms['search-symbol-form'].reset();
    }

  });

  try {
    xhr.send();
  }
  catch (err) {
    console.log(err.message)
  }

});

// function to render the information from the API request
function renderSearchDetail(stockInfo) {

  var divSearchDetailContainer = document.createElement('div');
  divSearchDetailContainer.className = 'flex wrap font-white search-detail-container';

  var divTitle = document.createElement('div');
  divTitle.className = 'column-1';

  var h1Title = document.createElement('h1');
  h1Title.className = 'symbol-title';
  h1Title.textContent = stockInfo.name;

  var divInfo = document.createElement('div');
  divInfo.className = 'column-1';

  var pShare = document.createElement('p');
  var spanShareTag = document.createElement('span');
  spanShareTag.className = 'tag';
  spanShareTag.textContent = 'share:';

  var brShare = document.createElement('br');

  var spanShareData = document.createElement('span');
  spanShareData.className = 'data';
  spanShareData.setAttribute('id', 'share-data');
  spanShareData.textContent = '$' + stockInfo.share;

  var pDivYield = document.createElement('p');
  var spanDivYieldTag = document.createElement('span');
  spanDivYieldTag.className = 'tag';
  spanDivYieldTag.textContent = 'approx. dividend yield:';

  var brDivYield = document.createElement('br');

  var spanDivYieldData = document.createElement('span');
  if (stockInfo.dividendYield === 'N/A' || stockInfo.dividendYield === '0.00') {
    spanDivYieldData.className = 'data no-dividend';
  } else {
    spanDivYieldData.className = 'data';
  }
  spanDivYieldData.textContent = stockInfo.dividendYield + '%';

  var pDivPerShare = document.createElement('p');
  var spanDivPerShareTag = document.createElement('span');
  spanDivPerShareTag.className = 'tag';
  spanDivPerShareTag.textContent = 'dividend per share:';

  var brDivPerShare = document.createElement('br');

  var spanDivPerShareData = document.createElement('span');
  if (stockInfo.dividendPerShare === 'N/A' || stockInfo.dividendPerShare === '0.00') {
    spanDivPerShareData.className = 'data no-dividend';
  } else {
    spanDivPerShareData.className = 'data';
  }
  spanDivPerShareData.textContent = '$' + stockInfo.dividendPerShare;

  var pDivPayment = document.createElement('p');
  var spanDivPaymentTag = document.createElement('span');
  spanDivPaymentTag.className = 'tag';
  spanDivPaymentTag.textContent = 'dividend payment';

  var brDivPayment = document.createElement('br');

  var spanDivPaymentData = document.createElement('span');
  if (stockInfo.dividendPayment === 'N/A' || stockInfo.dividendPayment === '0.00') {
    spanDivPaymentData.className = 'data no-dividend';
  } else {
    spanDivPaymentData.className = 'data';
  }
  spanDivPaymentData.textContent = '$' + stockInfo.dividendPayment;

  var pFrequency = document.createElement('p');
  var spanFrequencyTag = document.createElement('span');
  spanFrequencyTag.className = 'tag';
  spanFrequencyTag.textContent = 'dividend frequency';

  var brFrequency = document.createElement('br');

  var spanFrequencyData = document.createElement('span');
  if (stockInfo.annualPaymentRate === 'N/A' || stockInfo.annualPaymentRate === 0) {
    spanFrequencyData.className = 'data no-dividend';
  } else {
    spanFrequencyData.className = 'data';
  }
  spanFrequencyData.textContent = annualFreqConverter(stockInfo.annualPaymentRate);

  var pLastDivDate = document.createElement('p');
  var spanLastDivDateTag = document.createElement('span');
  spanLastDivDateTag.className = 'tag';
  spanLastDivDateTag.textContent = 'last dividend date:';

  var brLastDivDate = document.createElement('br');

  var spanLastDivDateData = document.createElement('span');
  if (stockInfo.dividendDate === 'N/A' || stockInfo.dividendDate === 0) {
    spanLastDivDateData.className = 'data no-dividend';
  } else {
    spanLastDivDateData.className = 'data';
  }
  spanLastDivDateData.textContent = stockInfo.dividendDate;

  var divButton = document.createElement('div');
  divButton.className = 'flex justify-center';

  var aButton = document.createElement('a');
  aButton.className = 'add-button';
  aButton.setAttribute('href', '#');
  aButton.setAttribute('id', 'add-to-favorite-button');
  aButton.setAttribute('onclick', 'this.blur()');
  aButton.textContent = 'Add to Favorites';

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
  $loadingSpinner.style.display = "none";

  return divSearchDetailContainer;
}

// renders a list of the stocks added to Favorites
function renderFavorites() {

  var div = document.createElement('div');

  var divListContainer = document.createElement('div');
  divListContainer.className = 'list-container';

  var divHeader = document.createElement('div');
  divHeader.className = 'column-1 font-white text-center';

  var h1Title = document.createElement('h1');
  h1Title.className = 'title';
  h1Title.textContent = 'Favorites';

  var pSubtitle = document.createElement('p');
  pSubtitle.className = 'subtitle';
  pSubtitle.textContent = 'Keep track of your investments and your favorite stocks.';

  div.append(divHeader, divListContainer);
  divHeader.append(h1Title, pSubtitle);

  if (data.stocks.length !== 0) {

    for (var i = 0; i < data.stocks.length; i++) {
      var divTitle = document.createElement('div');
      divTitle.className = 'flex font-white justify-between list-line';

      var divStock = document.createElement('div');
      divStock.className = 'column-3 list';

      var pStock = document.createElement('p');
      pStock.textContent = data.stocks[i].name;

      var divButtons = document.createElement('div');
      divButtons.className = 'flex align-center';

      var aDetail = document.createElement('a');
      aDetail.setAttribute('href', '#');
      aDetail.className = 'list-button-margin';

      var divDetailButton = document.createElement('div');
      divDetailButton.className = 'list-button list-detail-button';

      var iDetail = document.createElement('i');
      iDetail.className = 'fas fa-bars';

      var aTrash = document.createElement('a');
      aTrash.setAttribute('href', '#');
      aTrash.className = 'list-button-margin';

      var divTrashButton = document.createElement('div');
      divTrashButton.className = 'list-button list-remove-button';

      var iTrash = document.createElement('i');
      iTrash.className = 'fas fa-trash-alt';

      divListContainer.append(divTitle);
      divTitle.append(divStock, divButtons);
      divStock.append(pStock);
      divButtons.append(aDetail, aTrash);

      aDetail.append(divDetailButton);
      divDetailButton.append(iDetail);

      aTrash.append(divTrashButton);
      divTrashButton.append(iTrash);
    }
  } else {
    var pEmpty = document.createElement('p');
    pEmpty.className = 'empty-list';
    pEmpty.textContent = 'Your list is currently empty, click on Search to find stocks and add them to Favorites.';
    divHeader.append(pEmpty);
  }
  return div;
}

var $dataViewList = document.querySelectorAll('section[data-view]');

// swaps the view accoding to the anchor element that was clicked
function swapView(view) {
  for (var i = 0; i < $dataViewList.length; i++) {
    if ($dataViewList[i].dataset.view === view) {
      $dataViewList[i].style.display = '';
    } else {
      $dataViewList[i].style.display = 'none';
    }
  }
  data.dataview = view;
}

var $closeButton = document.getElementById('close-modal-button');
var $closeModal = document.getElementById('close-modal');

// close modal
$closeButton.addEventListener('click', function (e) {
  $closeModal.style.display = 'none';
  document.forms['search-symbol-form'].reset();
});

var $closeRepeatButton = document.getElementById('close-repeat-modal-button');

// close modal
$closeRepeatButton.addEventListener('click', function (e) {
  $repeatModal.style.display = 'none';
});

var $limitModalButton = document.getElementById('limit-modal-button');

// close modal
$limitModalButton.addEventListener('click', function (e) {
  $limitModal.style.display = 'none';
  $loadingSpinner.style.display = "none";
  document.forms[0].reset();
})

var $section = document.querySelector('section[data-view="favorite"]');
var $addedModal = document.getElementById('added-modal');
var $stockNameAdded = document.getElementById('stock-name-added');
var $repeatModal = document.getElementById('repeat-modal');
var $stockNameRepeat = document.getElementById('stock-name-repeat');

var $timer = document.getElementById('timer');

// add to favorites button
document.addEventListener('click', function (e) {
  if (e.target.id === 'add-to-favorite-button') {

    if (data.stocks.length !== 0) {
      for (var i = 0; i < data.stocks.length; i++) {
        if (stockInfo.name === data.stocks[i].name) {
          $repeatModal.style.display = "flex";
          $stockNameRepeat.textContent = stockInfo.name;
          return;
        }
      }
    }

    data.stocks.unshift(stockInfo);
    $addedModal.style.display = "flex";
    $stockNameAdded.textContent = stockInfo.name;
    var counter = 2;
    var addedStockTimer = setInterval(function timerOneSec() {

      if (counter > 0) {
        $timer.textContent = counter;
        counter--;
      } else {
        $addedModal.style.display = "none";
        clearInterval(addedStockTimer);
      }

    }, 1000);
    counter = 2;
    $timer.textContent = 3;
  }

  if (e.target.dataset.view === 'logo') {
    swapView('search');
  }

  if (e.target.parentNode.tagName === 'NAV') {
    swapView(e.target.dataset.view);
    if (e.target.dataset.view === 'favorite') {
      $section.innerHTML = '';
      $section.append(renderFavorites());
    }
  }
});

// converts dividend frequency to a descriptive period
function annualFreqConverter(freq) {
  if (freq === 1) {
    return 'annually';
  } else if (freq === 4) {
    return 'quarterly';
  } else if (freq === 12) {
    return 'monthly';
  } else {
    return freq + ' times per year';
  }
}

// remove a stock from Favorites
document.addEventListener('click', function (e) {
  if (e.target.className === 'fas fa-trash-alt' || e.target.className === 'list-button list-remove-button') {
    var toBeRemoved = e.target.closest('div.list-line').firstElementChild.textContent;
    for (var i = 0; i < data.stocks.length; i++) {
      if (data.stocks[i].name === toBeRemoved) {
        data.stocks.splice(i, 1);
        $section.innerHTML = '';
        $section.append(renderFavorites());
      }
    }
  }
});
