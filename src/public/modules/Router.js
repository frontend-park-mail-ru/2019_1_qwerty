const noop = () => null;

class Router {
    constructor () {
        this.routes = {};
        this.errorFunction = noop;

        window.addEventListener('popstate', event => {
            console.dir(event);
            this.getPage(event.state.path);
            // this.routes[event.state.path]();
        });
    }

    register (path, func) {
        this.routes[path] = func;
    }

    go (path, params = '') {
        if (params !== '') {
            params = '?' + params;
        }
        window.history.pushState({
            path
        }, '', path + params);
        this.getPage(path);
        // this.routes[path]();
    }

    getPage (path) {
        if (!this.routes.hasOwnProperty(path)) {
            this.errorFunction();
            return;
        }
        this.routes[path]();
    }

    error (func) {
        this.errorFunction = func;
    }
}

export default new Router();
