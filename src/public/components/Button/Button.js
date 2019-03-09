
export default class ButtonComponent {
    constructor ({
        name = '',
        parent = document.body
    } = {}) {
        this.parent = parent;
        this.name = name;
        this.class = 'button';
    }

    set onClick (callback) {
        this._onClick = callback;
    }

    get onClick () {
        return this._callback;
    }
}
