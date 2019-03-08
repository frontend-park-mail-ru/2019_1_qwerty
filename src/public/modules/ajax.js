
const noop = () => null;

export default class AjaxModule {
    static ajax ({
        callback = noop,
        method = 'GET',
        path = '/',
        body = {}
    } = {}) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, path, true);

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

    static doPost ({ callback = noop,
        path = '/',
        body = {}
    } = {}) {
        AjaxModule.ajax({
            callback,
            method: 'POST',
            path,
            body
        });
    }

    static doGet ({ callback = noop,
        path = '/',
        body = {}
    } = {}) {
        AjaxModule.ajax({
            callback,
            method: 'GET',
            path,
            body
        });
    }
}


