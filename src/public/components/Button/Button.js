
export default class ButtonComponent {
    constructor ({
        name = '',
        classes = []
    } = {}) {
        this.classes = classes;
        this.name = name;
    }

    set callback (callback) {
        this._callback = callback;
    }

    get callback () {
        return this._callback;
    }
}
