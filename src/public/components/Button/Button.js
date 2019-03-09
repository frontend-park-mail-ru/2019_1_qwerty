
export default class ButtonComponent {
    constructor ({
        name = '',
        parent = document.body
    } = {}) {
        this.parent = parent;
        this.name = name;
        this.class = 'button';
    }

    render () {
        this.parent.innerHTML = window.fest['components/Button/Button.tmpl'](this);

        this._elem = document.querySelector(`input[name='${this.name}']`);
    }

    set onClick (callback) {
        this._onClick = callback;
    }

    get onClick () {
        return this._onClick;
    }

}
