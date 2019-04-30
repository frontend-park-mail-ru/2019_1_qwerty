import { API_URL } from '../config.js';

export default class AjaxModule {
    // static sendData ({
    //     path = '/',
    //     file
    // }) {
    //     const newPath = API_URL + path;
    //     const xhr = new XMLHttpRequest();
    //     xhr.open('POST', newPath, true);
    //     xhr.withCredentials = true;
    //     xhr.onreadystatechange = () => {
    //         if (xhr.readyState !== 4) return;
    //         if (xhr.status !== 200) {
    //             alert('файл больше 2 мб');
    //         }
    //     };
    //     const formdata = new FormData();
    //     formdata.append('file', file);
    //     xhr.send(formdata);
    // }
    static sendData ({
        path = '/',
        file
    }) {
        const formData = new FormData();
        formData.append('file', file);

        return fetch(API_URL + path, {
            method: 'POST',
            headers: { 'Content-Type': 'multipart/form-data' },
            mode: 'cors',
            credentials: 'include',
            body: formData
        });
    }

    /**
     * Метод отсылки пост запроса с помощью fetch
     *
     * @param {string} path путь запроса
     * @param {Object} body данные.
     */

    static doFetchPost ({
        path = '/',
        body = null
    } = {}) {
        return fetch(API_URL + path, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(body)
        });
    }

    /**
     * Метод отсылки гет запроса с помощью fetch
     *
     * @param {string} path путь запроса
     */
    static doFetchGet ({
        path = '/'
    } = {}) {
        return fetch(API_URL + path, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            }
        });
    }
}
