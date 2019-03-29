
export default class Controller {
    constructor ({
        EventBus = {},
        View = null,
        data = {}
    }) {
        this.data = data;
        this.EventBus = EventBus;
    }

    getData () {
        return {};
    }

    show () {
        this.view.render();
    }
}
