
var symbol = "";

document.addEventListener('submit', function (e) {
  e.preventDefault();
  symbol = document.forms["search-symbol-form"].elements["symbol-search"].value.toUpperCase();

  // console.log(symbol);
});
