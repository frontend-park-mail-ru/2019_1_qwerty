
const noop = () => null;

class AjaxModule {
    ajax({
        callback = noop,
        method = "GET",
        path = "/",
        body = {}
    } = {}) {
        const xhr = new XMLHttpRequest();
        xhr.open(method, path, true);

        xhr.withCredentials = true;

        xhr.onreadystatechange = function () {
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

    doPost ({callback = noop,
           path = "/",
           body = {}
    } = {}) {
        this.ajax({
            callback,
            method : "POST",
            path,
            body
        });
    }

    doGet ({callback = noop,
                path = "/",
                body = {}
            } = {}) {
        this.ajax({
            callback,
            method : "GET",
            path,
            body
        });
    }
}
