/* exported data */

var data = {
  stocks: [],
  dataview: ''
}

window.addEventListener('beforeunload', function(e) {
  var dataJSON = JSON.stringify(data);
  console.log(dataJSON);
})
