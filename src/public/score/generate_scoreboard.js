let _tr_ = document.createElement('tr'),
  _th_ = document.createElement('th'),
  _td_ = document.createElement('td');

function buildHtmlTable(selector, arr) {
  let table = document.getElementById(selector)
  table.innerHTML = "";
  let columns = addAllColumnHeaders(arr, selector);
  for (let i = 0, maxi = arr.length; i < maxi; ++i) {
    let tr = _tr_.cloneNode(false);
    for (let j = 0, maxj = columns.length; j < maxj; ++j) {
      let td = _td_.cloneNode(false);
      cellValue = arr[i][columns[j]];
      td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  return table;
}

function getNext(start_index = 0) {
  let url = 'http://127.0.0.1:8080/api/score/' + start_index.toString();
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (jsonResponse) {
      buildHtmlTable("scoreboard", jsonResponse)
    });
}

function addAllColumnHeaders(arr, selector) {
  let table = document.getElementById(selector),
    columnSet = [],
    tr = _tr_.cloneNode(false);
  for (let i = 0, maxi = arr.length; i < maxi; ++i) {
    for (let key in arr[i]) {
      if (arr[i].hasOwnProperty(key) && columnSet.indexOf(key) === -1) {
        columnSet.push(key);
        let th = _th_.cloneNode(false);
        th.appendChild(document.createTextNode(key));
        tr.appendChild(th);
      }
    }
  }
  table.appendChild(tr);
  return columnSet;
}