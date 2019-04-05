class Router {
    constructor () {
        this.routes = {};

        window.addEventListener('popstate', event => {
            console.dir(event);
            this.routes[event.state.path]();
        });
    }

    register (path, func) {
        this.routes[path] = func;
    }

    go (path) {
        window.history.pushState({
            path
        }, '', path);
        this.routes[path]();
    }
}

export default new Router();
