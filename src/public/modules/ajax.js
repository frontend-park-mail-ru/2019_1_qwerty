
const noop = () => null;
const API_URL = 'http://localhost:8080/api';

export default class AjaxModule {
    /**
     * Метод осуществляет работу с сетью
     *
     * @param {Function} callback callback-функция
     * @param {string} method метод для HTTP запроса
     * @param {string} path путь запроса
     * @param {Boolean} isAsync асинхронность
     * @param {Object} body данные
     */
    static ajax ({
        callback = noop,
        method = 'GET',
        path = '/',
        isAsync = true,
        body = {}
    } = {}) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, path, isAsync);

        xhr.withCredentials = true;

        xhr.onreadystatechange = () => {
            if (xhr.readyState !== 4) {
                return;
            }

            callback(xhr);
        };
        if (body) {
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            xhr.send(JSON.stringify(body));
        } else {
            xhr.send();
        }
    }

    static sendData ({
        path = '/',
        file
    }) {
        const newPath = API_URL + path;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', newPath, true);

        const formdata = new FormData();
        formdata.append('file', file);
        xhr.send(formdata);
    }

    /**
     * Метод отсылки пост запроса
     *
     * @param {Function} callback callback-функция
     * @param {string} path путь запроса
     * @param {Object} body данные.
     */
    static doPost ({
        callback = noop,
        path = '/',
        body = {}
    } = {}) {
        const apiPath = API_URL + path;
        AjaxModule.ajax({
            callback,
            method: 'POST',
            path: apiPath,
            body
        });
    }

    /**
     * Метод отсылки гет запроса
     *
     * @param {Function} callback callback-функция
     * @param {string} path путь запроса
     * @param {Object} body данные.
     */
    static doGet ({ callback = noop,
        path = '/',
        body = {}
    } = {}) {
        const apiPath = API_URL + path;
        AjaxModule.ajax({
            callback,
            method: 'GET',
            path: apiPath,
            body
        });
    }
}
