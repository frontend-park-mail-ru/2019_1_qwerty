
export default class Controller {
    constructor ({
        EventBus = {},
        View = null,
        data = {}
    }) {
        this.data = data;
        this.EventBus = EventBus;
        this.View = View;
    }

    getData () {
        return {};
    }

    show () {
        this.view.render();
    }
}
