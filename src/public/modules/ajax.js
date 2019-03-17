
const noop = () => null;
const API_URL = 'http://localhost:8080/api';

export default class AjaxModule {
    static sendData ({
        path = '/',
        file
    }) {
        const newPath = API_URL + path;
        const xhr = new XMLHttpRequest();
        xhr.open('POST', newPath, true);
        xhr.withCredentials = true;

        const formdata = new FormData();
        formdata.append('file', file);
        xhr.send(formdata);
    }

    /**
     * Метод отсылки пост запроса с помощью fetch
     *
     * @param {string} path путь запроса
     * @param {Object} body данные.
     */

    static doFetchPost({
        path = "/",
        body = null,
    } = {}) {
        return fetch(API_URL + path, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(body),
        });
    }

    /**
     * Метод отсылки гет запроса с помощью fetch
     *
     * @param {string} path путь запроса
     */
    static doFetchGet({
        path = "/",
    } = {}) {
        return fetch(API_URL + path, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });
    }
}
