
const noop = () => null;

export default class ButtonComponent {
    constructor ({
        name = '',
        title = '',
        parent = document.body,
        onClick = noop
    } = {}) {
        this.title = title;
        this.parent = parent;
        this.name = name;
        this.class = 'button';
        this._elem = null;
        this._onClick = onClick;
    }

    render () {
        this.parent.innerHTML = window.fest['components/Button/Button.tmpl'](this);

        this._elem = document.querySelector(`input[name='${this.name}']`);
    }
}
