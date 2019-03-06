let testJSON = [
    { "Place": "0", "Name": "profile0", "Score": "1009" },
    { "Place": "1", "Name": "profile1", "Score": "1008" },
    { "Place": "2", "Name": "profile2", "Score": "1007" },
    { "Place": "3", "Name": "profile3", "Score": "1006" },
    { "Place": "4", "Name": "profile4", "Score": "1005" },
    { "Place": "5", "Name": "profile5", "Score": "1004" },
    { "Place": "6", "Name": "profile6", "Score": "1003" },
    { "Place": "7", "Name": "profile7", "Score": "1002" },
    { "Place": "8", "Name": "profile8", "Score": "1001" },
    { "Place": "9", "Name": "profile9", "Score": "1000" },
];
  
let _tr_ = document.createElement('tr'),
    _th_ = document.createElement('th'),
    _td_ = document.createElement('td');

function buildHtmlTable(selector, arr) {
    arr = testJSON;
    let table = document.getElementById(selector)
    table.innerHTML = ""
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