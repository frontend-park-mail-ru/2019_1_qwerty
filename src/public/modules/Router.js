
class Router {
    constructor () {
        this.routes = {};
        this.errorController = null;
        this.current = null;

        window.addEventListener('popstate', event => {
            console.dir(event);
            this.getPage(event.state.path);
            // this.routes[event.state.path]();
        });
    }

    register (path, controller) {
        this.routes[path] = controller;
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
        // if (!this.routes.hasOwnProperty(path)) {
        //     this.errorFunction();
        //     return;
        // }
        if (this.current) {
            this.current.destroy();
        }

        this.current = this.routes[path] || this.errorController;
        this.current.show();
    }

    error (controller) {
        this.errorController = controller;
    }
}

export default new Router();
