import EventBus from '../modules/EventBus.js';

export default class Controller {
    constructor (data = {}) {
        this.data = data;
        this.EventBus = EventBus;
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
}
