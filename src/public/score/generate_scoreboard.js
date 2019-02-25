let testJSON = [
    { "Место": "0", "Никнейм": "profile0", "Очки": "1009" },
    { "Место": "1", "Никнейм": "profile1", "Очки": "1008" },
    { "Место": "2", "Никнейм": "profile2", "Очки": "1007" },
    { "Место": "3", "Никнейм": "profile3", "Очки": "1006" },
    { "Место": "4", "Никнейм": "profile4", "Очки": "1005" },
    { "Место": "5", "Никнейм": "profile5", "Очки": "1004" },
    { "Место": "6", "Никнейм": "profile6", "Очки": "1003" },
    { "Место": "7", "Никнейм": "profile7", "Очки": "1002" },
    { "Место": "8", "Никнейм": "profile8", "Очки": "1001" },
    { "Место": "9", "Никнейм": "profile9", "Очки": "1000" },
];
  
let _tr_ = document.createElement('tr'),
    _th_ = document.createElement('th'),
    _td_ = document.createElement('td');

function buildHtmlTable(selector, arr) {
    arr = testJSON;
    let table = document.getElementById(selector),
        columns = addAllColumnHeaders(arr, selector);
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