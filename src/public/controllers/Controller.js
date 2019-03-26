
export default class Controller {
    constructor (data) {
        this.data = data;
        this.view = new data.View(this.getData());
    }

    getData () {
        return {};
    }

    show () {
        this.view.render();
    }
}
