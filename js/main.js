
const $searchInput = document.getElementById('symbol-search');

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
  for (let i = 0; i < stockSymbolName.length; i++) {
    if (stockSymbolName[i].symbol === stockSymbol) {
      return stockSymbolName[i].name;
    }
  }
}

let symbol = '';
const apiKey = 'JI3EUIMS58M4XZ08';
let apiRequest;
let stockInfo = {};

const $loadingSpinner = document.getElementById('loading-spinner');
const $limitModal = document.getElementById('limit-modal');
const $errorModal = document.getElementById('error-modal');

// API request and returns the information requested or an notification
document.addEventListener('submit', function (e) {
  e.preventDefault();
  symbol = document.forms['search-symbol-form'].elements['symbol-search'].value.toUpperCase();

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${apiKey}`);
  xhr.responseType = 'json';
  $loadingSpinner.style.display = "flex";

  xhr.onerror = function() {
    $errorModal.style.display = 'flex';
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

      const shareSymbol = apiRequest['Meta Data']['2. Symbol'];
      const name = getSymbolName(symbol);
      const request = apiRequest['Time Series (Daily)'];
      let dividendPay = 0;
      let annualPaymentRate = 0;
      let adjustedClose = 0;
      let dividendPerShare = 0;
      let dividendHistory = [];
      let dividendExDate = dividendHistory[0];

      for (const day in request) {
        if (request[day]['7. dividend amount'] !== '0.0000') {
          dividendHistory.push(day);
        }
        if (dividendHistory.length === 0) {
          dividendExDate = 'N/A';
        } else {
          const divDate = dividendHistory[0];
          const splitDate = divDate.split('-');
          dividendExDate = `${splitDate[1]}/${splitDate[2]}/${splitDate[0]}`;
        }
      }

      for (let i = 251; i > 0; i--) {
        const date = Object.keys(request)[i];
        if (request[date]['7. dividend amount'] !== '0.0000') {
          dividendPerShare += Number(request[date]['7. dividend amount']);
          dividendPay = Number(request[date]['7. dividend amount']);
          annualPaymentRate++;
        }
        adjustedClose = Number(request[date]['5. adjusted close']);
      }

      const dividendYield = (dividendPerShare / adjustedClose * 100).toFixed(2);

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
  xhr.send();
});

// function to render the information from the API request
function renderSearchDetail(stockInfo) {

  const divSearchDetailContainer = document.createElement('div');
  divSearchDetailContainer.className = 'flex wrap font-white search-detail-container';

  const divTitle = document.createElement('div');
  divTitle.className = 'column-1';

  const h1Title = document.createElement('h1');
  h1Title.className = 'symbol-title';
  h1Title.textContent = stockInfo.name;

  const divInfo = document.createElement('div');
  divInfo.className = 'column-1';

  const pShare = document.createElement('p');
  const spanShareTag = document.createElement('span');
  spanShareTag.className = 'tag';
  spanShareTag.textContent = 'share:';

  const brShare = document.createElement('br');

  const spanShareData = document.createElement('span');
  spanShareData.className = 'data';
  spanShareData.setAttribute('id', 'share-data');
  spanShareData.textContent = '$' + stockInfo.share;

  const pDivYield = document.createElement('p');
  const spanDivYieldTag = document.createElement('span');
  spanDivYieldTag.className = 'tag';
  spanDivYieldTag.textContent = 'approx. dividend yield:';

  const brDivYield = document.createElement('br');

  const spanDivYieldData = document.createElement('span');
  if (stockInfo.dividendYield === 'N/A' || stockInfo.dividendYield === '0.00') {
    spanDivYieldData.className = 'data no-dividend';
  } else {
    spanDivYieldData.className = 'data';
  }
  spanDivYieldData.textContent = stockInfo.dividendYield + '%';

  const pDivPerShare = document.createElement('p');
  const spanDivPerShareTag = document.createElement('span');
  spanDivPerShareTag.className = 'tag';
  spanDivPerShareTag.textContent = 'dividend per share:';

  const brDivPerShare = document.createElement('br');

  const spanDivPerShareData = document.createElement('span');
  if (stockInfo.dividendPerShare === 'N/A' || stockInfo.dividendPerShare === '0.00') {
    spanDivPerShareData.className = 'data no-dividend';
  } else {
    spanDivPerShareData.className = 'data';
  }
  spanDivPerShareData.textContent = `$${stockInfo.dividendPerShare}`;

  const pDivPayment = document.createElement('p');
  const spanDivPaymentTag = document.createElement('span');
  spanDivPaymentTag.className = 'tag';
  spanDivPaymentTag.textContent = 'dividend payment';

  const brDivPayment = document.createElement('br');

  const spanDivPaymentData = document.createElement('span');
  if (stockInfo.dividendPayment === 'N/A' || stockInfo.dividendPayment === '0.00') {
    spanDivPaymentData.className = 'data no-dividend';
  } else {
    spanDivPaymentData.className = 'data';
  }
  spanDivPaymentData.textContent = `$${stockInfo.dividendPayment}`;

  const pFrequency = document.createElement('p');
  const spanFrequencyTag = document.createElement('span');
  spanFrequencyTag.className = 'tag';
  spanFrequencyTag.textContent = 'dividend frequency';

  const brFrequency = document.createElement('br');

  const spanFrequencyData = document.createElement('span');
  if (stockInfo.annualPaymentRate === 'N/A' || stockInfo.annualPaymentRate === 0) {
    spanFrequencyData.className = 'data no-dividend';
  } else {
    spanFrequencyData.className = 'data';
  }
  spanFrequencyData.textContent = annualFreqConverter(stockInfo.annualPaymentRate);

  const pLastDivDate = document.createElement('p');
  const spanLastDivDateTag = document.createElement('span');
  spanLastDivDateTag.className = 'tag';
  spanLastDivDateTag.textContent = 'last dividend date:';

  const brLastDivDate = document.createElement('br');

  const spanLastDivDateData = document.createElement('span');
  if (stockInfo.dividendDate === 'N/A' || stockInfo.dividendDate === 0) {
    spanLastDivDateData.className = 'data no-dividend';
  } else {
    spanLastDivDateData.className = 'data';
  }
  spanLastDivDateData.textContent = stockInfo.dividendDate;

  const divButton = document.createElement('div');
  divButton.className = 'flex justify-center';

  const aButton = document.createElement('a');
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

  const div = document.createElement('div');

  const divListContainer = document.createElement('div');
  divListContainer.className = 'list-container';

  const divHeader = document.createElement('div');
  divHeader.className = 'column-1 font-white text-center';

  const h1Title = document.createElement('h1');
  h1Title.className = 'title';
  h1Title.textContent = 'Favorites';

  const pSubtitle = document.createElement('p');
  pSubtitle.className = 'subtitle';
  pSubtitle.textContent = 'Keep track of your investments and your favorite stocks.';

  div.append(divHeader, divListContainer);
  divHeader.append(h1Title, pSubtitle);

  if (data.stocks.length !== 0) {

    for (let i = 0; i < data.stocks.length; i++) {
      const divTitle = document.createElement('div');
      divTitle.className = 'flex font-white justify-between list-line';

      const divStock = document.createElement('div');
      divStock.className = 'column-3 list';

      const pStock = document.createElement('p');
      pStock.textContent = data.stocks[i].name;

      const divButtons = document.createElement('div');
      divButtons.className = 'flex align-center';

      const aDetail = document.createElement('a');
      aDetail.setAttribute('href', '#');
      aDetail.className = 'list-button-margin';

      const divDetailButton = document.createElement('div');
      divDetailButton.className = 'list-button list-detail-button';

      const iDetail = document.createElement('i');
      iDetail.className = 'fas fa-bars';

      const aTrash = document.createElement('a');
      aTrash.setAttribute('href', '#');
      aTrash.className = 'list-button-margin';

      const divTrashButton = document.createElement('div');
      divTrashButton.className = 'list-button list-remove-button';

      const iTrash = document.createElement('i');
      iTrash.className = 'fas fa-trash-alt';

      divListContainer.append(divTitle);
      divTitle.append(divStock, divButtons);
      divStock.append(pStock);
      divButtons.append(aDetail, aTrash);

      // aDetail.append(divDetailButton);
      // divDetailButton.append(iDetail);

      aTrash.append(divTrashButton);
      divTrashButton.append(iTrash);
    }
  } else {
    const pEmpty = document.createElement('p');
    pEmpty.className = 'empty-list';
    pEmpty.textContent = 'Your list is currently empty, click on Search to find stocks and add them to Favorites.';
    divHeader.append(pEmpty);
  }
  return div;
}

const $dataViewList = document.querySelectorAll('section[data-view]');

// swaps the view accoding to the anchor element that was clicked
function swapView(view) {
  for (let i = 0; i < $dataViewList.length; i++) {
    if ($dataViewList[i].dataset.view === view) {
      $dataViewList[i].style.display = '';
    } else {
      $dataViewList[i].style.display = 'none';
    }
  }
  data.dataview = view;
}

const $closeButton = document.getElementById('close-modal-button');
const $closeModal = document.getElementById('close-modal');

// close modal
$closeButton.addEventListener('click', function (e) {
  $closeModal.style.display = 'none';
  document.forms['search-symbol-form'].reset();
});

const $closeRepeatButton = document.getElementById('close-repeat-modal-button');

// close repeat modal
$closeRepeatButton.addEventListener('click', function (e) {
  $repeatModal.style.display = 'none';
});

const $limitModalButton = document.getElementById('limit-modal-button');

// close limit modal
$limitModalButton.addEventListener('click', function (e) {
  $limitModal.style.display = 'none';
  $loadingSpinner.style.display = "none";
  document.forms[0].reset();
})

const $errorModalButton = document.getElementById('error-modal-button');

// close error modal
$errorModalButton.addEventListener('click', function(e) {
  $errorModal.style.display = 'none';
  $loadingSpinner.style.display = 'none';
})

const $section = document.querySelector('section[data-view="favorite"]');
const $addedModal = document.getElementById('added-modal');
const $stockNameAdded = document.getElementById('stock-name-added');
const $repeatModal = document.getElementById('repeat-modal');
const $stockNameRepeat = document.getElementById('stock-name-repeat');

const $timer = document.getElementById('timer');

// add to favorites button
document.addEventListener('click', function (e) {
  if (e.target.id === 'add-to-favorite-button') {

    if (data.stocks.length !== 0) {
      for (let i = 0; i < data.stocks.length; i++) {
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
    let counter = 2;
    const addedStockTimer = setInterval(function timerOneSec() {

      if (counter > 0) {
        $timer.textContent = counter;
        counter--;
      } else {
        $addedModal.style.display = "none";
        clearInterval(addedStockTimer);
      }

    }, 300);
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
    return `${freq} times per year`;
  }
}

// remove a stock from Favorites
document.addEventListener('click', function (e) {
  if (e.target.className === 'fas fa-trash-alt' || e.target.className === 'list-button list-remove-button') {
    const toBeRemoved = e.target.closest('div.list-line').firstElementChild.textContent;
    for (let i = 0; i < data.stocks.length; i++) {
      if (data.stocks[i].name === toBeRemoved) {
        data.stocks.splice(i, 1);
        $section.innerHTML = '';
        $section.append(renderFavorites());
      }
    }
  }
});
