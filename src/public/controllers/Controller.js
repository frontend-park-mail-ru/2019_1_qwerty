import EventBus from '../modules/EventBus.js';
import router from '../modules/Router.js';
import View from '../views/View.js';

export default class Controller {
    constructor (data = {}) {
        this.data = data;
        this.EventBus = EventBus;
        this.view = new View(data);
        this.routeFunction = this.routeFunction.bind(this);
    }

    getData () {
        return this.data;
    }

    show () {
        this.view.render();
    }

    createViewAndRender () {
        return null;
    }

    routeFunction (path) {
        return event => {
            event.preventDefault();
            this.view.onDestroy();
            router.go(path);
        };
    }
}
