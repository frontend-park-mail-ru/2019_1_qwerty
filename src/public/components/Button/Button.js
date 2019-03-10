
const noop = () => null;

export default class ButtonComponent {
    constructor ({
        name = '',
        title = '',
        type = '',
        parent = document.body,
        onClick = noop
    } = {}) {
        this.type = type;
        this.title = title;
        this.parent = parent;
        this.name = name;
        this._elem = null;
        this.onClick = onClick;
    }

    render () {
        this.parent.innerHTML = window.fest['components/Button/Button.tmpl'](this);

        this._elem = document.querySelector(`input[name='${this.name}']`);
    }
}
