/* exported data */

var data = {
  stocks: [],
  dataview: ''
}

var previousDataJSON = localStorage.getItem('javascript-local-storage');

window.addEventListener('beforeunload', function(e) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('javascript-local-storage', dataJSON);
})
