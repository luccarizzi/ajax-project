/* exported data */

var data = {
  stocks: [],
  dataview: ''
}

window.addEventListener('beforeunload', function(e) {
  var dataJSON = JSON.stringify(data);
  localStorage.setItem('javascript-local-storage', dataJSON);

  console.log(dataJSON);
})
