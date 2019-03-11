import ButtonComponent from '../Button/Button.js';
export default class ScoreComponent {
    constructor({
        parent = document.body
    } = {}) {
        this._parent = parent;
    }

    foo () {  console.log("i am clicked"); };

    render() {
        this._parent.innerHTML = fest['components/Score/Score.tmpl'](this.scoreboard);
        let prev = document.querySelector('[data-section="Prev10"]')
        let next = document.querySelector('[data-section="Next10"]')

        const prevButton = new ButtonComponent({
            parent: prev,
            name: "Prev 10",
            title: "Prev 10",
            onClick: this.getNext.bind(this, -10)
        });

        const nextButton = new ButtonComponent({
            parent: next,
            name: "Next 10",
            title: "Next 10",
            onClick: this.getNext.bind(this, 10)
        });

        prevButton.render();
        nextButton.render();
        this.getNext();
    }

    /**
     * Обращается к BACKEND и строит html таблицу результатов на основе ответа
     * 
     * @param  {} startIndex=0 - integer - Смещение относительно текущего начала.
     */
    getNext(start_index = 0) {
        /**
         * Формирует HTML таблицу на основе JSON
         * 
         * @param  {} selector - stirng - id элемента - таблицы
         * @param  {} arr - [{string: value}...{string: value}] - Массив ассоциативных массивов (вида JSON).
         */
        function buildHtmlTable(selector, arr) {
            /**
             * Добавляет заголовки таблице из массива ассоциативных массивов
             * 
             * @param  {} arr -[{string: value}...{string: value}] - Массив ассоциативных массивов (вида JSON). По его ключам строятся заголовки.
             * @param  {} selector - string - id элемента - таблицы, в который будут добавлены заголовки
             */
            function addAllColumnHeaders(arr, selector) {
                let table = document.getElementById(selector),
                    _tr_ = document.createElement('tr'),
                    _th_ = document.createElement('th'),
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

            let table = document.getElementById(selector),
                _tr_ = document.createElement('tr'),
                _td_ = document.createElement('td');
            table.innerHTML = "";
            let columns = addAllColumnHeaders(arr, selector);
            for (let i = 0, maxi = arr.length; i < maxi; ++i) {
                let tr = _tr_.cloneNode(false);
                for (let j = 0, maxj = columns.length; j < maxj; ++j) {
                    let td = _td_.cloneNode(false);
                    td.appendChild(document.createTextNode(arr[i][columns[j]] || ''));
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            return table;
        }

        const url = 'http://localhost:8080/api/score?offset=' + start_index.toString();
        fetch(url)
            .then((response) => response.json())
            .then((jsonResponse) => buildHtmlTable("scoreboard", jsonResponse));
    }

}